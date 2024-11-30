import {
  faMagnifyingGlass,
  faFilter,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Label from "../../../components/Label";
import { NotificationCard, User } from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import Modal from "../../../components/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import {
  addNotification,
  addUser,
  removeNotification,
} from "../../../store/action";

type Props = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setShowItems: (value: number) => void;
  showItems: number;
  setFilterOpen: (value: boolean) => void;
  filterOpen: boolean;
  handleFilterChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  orgData: User[];
  filterData: string[];
};

type UserFormInputs = Omit<User, "id">;

const generateRandomCoordinate = (min: number, max: number) => {
  return (Math.random() * (max - min) + min).toFixed(6); // Keep 6 decimal places
};

function SearchAndFilterPanel({
  searchQuery,
  setSearchQuery,
  setShowItems,
  showItems,
  setFilterOpen,
  filterOpen,
  handleFilterChange,
  orgData,
  filterData,
}: Props) {
  const mode = useSelector((state: RootState) => state.mode);
  const [addUserModal, setAddUserModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UserFormInputs>();

  const handleGenerateCoordinates = () => {
    const randomLat = generateRandomCoordinate(-90, 90); // Latitude between -90 and 90
    const randomLng = generateRandomCoordinate(-180, 180); // Longitude between -180 and 180
    setValue("address.geo.lat", randomLat);
    setValue("address.geo.lng", randomLng);
  };

  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<UserFormInputs> = (data) => {
    const newUser = {
      ...data,
      id: Date.now(), // Generate a unique ID for the user
    };
    dispatch(addUser(newUser));
    setAddUserModal(false);
    reset();
    const notification: NotificationCard = {
      msg: "User added.",
      type: "success",
      id: Date.now().toString(),
    };

    dispatch(addNotification(notification));

    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 5000);
  };
  return (
    <>
      <Container>
        <SearchContainer>
          <SearchInput
            mode={mode}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email or company"
          />
          <SearchButton>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </SearchButton>
        </SearchContainer>
        <ItemsPerPageContainer>
          <Label>Items per page</Label>
          <ItemsSelect
            mode={mode}
            onChange={(e) => setShowItems(Number(e.target.value))}
            id="rows"
            value={showItems}
          >
            <Option value={2}>
              2
            </Option>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
          </ItemsSelect>
        </ItemsPerPageContainer>
        <FilterButton id="filter" onClick={() => setFilterOpen(!filterOpen)}>
          <FontAwesomeIcon icon={faFilter} />
          <Label sx={{ color: "white" }}>Filter</Label>
          <DropdownContainer
            onClick={(e) => e.stopPropagation()}
            id="filter-con"
            className={filterOpen ? "active" : ""}
          >
            <FilterSection>
              <Label>City</Label>
              <Divider />
              {orgData.map((data) => (
                <FilterOption key={`${data.id}${data.address.city}`}>
                  <Label size="0.7rem" weight="bold">
                    {data.address.city}
                  </Label>
                  <FilterCheckbox
                    onChange={(e) => handleFilterChange(e)}
                    checked={filterData.includes(data.address.city)}
                    type="checkbox"
                    value={data.address.city}
                  />
                </FilterOption>
              ))}
            </FilterSection>
            <FilterSection>
              <Label>Company</Label>
              <Divider />
              {orgData.map((data) => (
                <FilterOption key={`${data.id}${data.company.name}`}>
                  <Label size="0.7rem" weight="bold">
                    {data.company.name}
                  </Label>
                  <FilterCheckbox
                    onChange={(e) => handleFilterChange(e)}
                    checked={filterData.includes(data.company.name)}
                    type="checkbox"
                    value={data.company.name}
                  />
                </FilterOption>
              ))}
            </FilterSection>
          </DropdownContainer>
        </FilterButton>
        <AddUserButton onClick={() => setAddUserModal(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <Label sx={{color: 'white'}}>New User</Label>
        </AddUserButton>
      </Container>
      {addUserModal && (
        <Modal onClose={() => setAddUserModal(false)}>
          <Label>Add New User</Label>
          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <Label>Name</Label>
              <Input {...register("name", { required: "Name is required" })} />
              {errors.name && <Error>{errors.name.message}</Error>}
            </FormField>

            <FormField>
              <Label>Username</Label>
              <Input
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && <Error>{errors.username.message}</Error>}
            </FormField>

            <FormField>
              <Label>Email</Label>
              <Input
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <Error>{errors.email.message}</Error>}
            </FormField>

            <FormField>
              <Label>Street</Label>
              <Input
                {...register("address.street", {
                  required: "Street is required",
                })}
              />
              {errors.address?.street && (
                <Error>{errors.address.street.message}</Error>
              )}
            </FormField>

            <FormField>
              <Label>Suite</Label>
              <Input {...register("address.suite")} />
            </FormField>

            <FormField>
              <Label>City</Label>
              <Input
                {...register("address.city", { required: "City is required" })}
              />
              {errors.address?.city && (
                <Error>{errors.address.city.message}</Error>
              )}
            </FormField>

            <FormField>
              <Label>Zipcode</Label>
              <Input
                {...register("address.zipcode", {
                  required: "Zipcode is required",
                })}
              />
              {errors.address?.zipcode && (
                <Error>{errors.address.zipcode.message}</Error>
              )}
            </FormField>

            <FormField>
              <Label>Geo</Label>
              <GeoContainer>
                <GeoInput
                  {...register("address.geo.lat")}
                  placeholder="Latitude"
                  readOnly
                />
                <GeoInput
                  {...register("address.geo.lng")}
                  placeholder="Longitude"
                  readOnly
                />
                <GenerateButton
                  type="button"
                  onClick={handleGenerateCoordinates}
                >
                  Generate Coordinates
                </GenerateButton>
              </GeoContainer>
            </FormField>

            <FormField>
              <Label>Phone</Label>
              <Input {...register("phone")} />
            </FormField>

            <FormField>
              <Label>Website</Label>
              <Input {...register("website")} />
            </FormField>

            <FormField>
              <Label>Company Name</Label>
              <Input {...register("company.name")} />
            </FormField>

            <FormField>
              <Label>Catch Phrase</Label>
              <Input {...register("company.catchPhrase")} />
            </FormField>

            <FormField>
              <Label>BS</Label>
              <Input {...register("company.bs")} />
            </FormField>

            <SubmitButton type="submit">Add User</SubmitButton>
          </FormContainer>
        </Modal>
      )}
    </>
  );
}

export const FormContainer = styled.form`
  width: 80%;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 8px;
`;

export const FormField = styled.div`
  margin-bottom: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  background-color: ${(p) => p.theme.secondary};
  color: ${(p) => p.theme.font};
  box-shadow: ${(p) => p.theme.shadowInset};
`;

export const GeoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const GeoInput = styled(Input)`
  flex: 1;
  background: ${(p) => p.theme.secondary};
  cursor: not-allowed;
  color: ${(p) => p.theme.font};
`;

export const GenerateButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${(p) => p.theme.blue};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #28a745;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #218838;
  }
`;

export const Error = styled.span`
  color: #d9534f;
  font-size: 0.85rem;
  margin-top: 0.3rem;
  display: block;
`;

const Container = styled.div`
  width: 100%;
  min-height: 15%;
  gap: 2.5rem;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 2rem;
`;

const SearchContainer = styled.div`
  width: 40%;
  height: 40%;
  border-radius: 20px;
  display: flex;
  overflow: hidden;
`;

const SearchInput = styled.input<{ mode: string }>`
  width: 92%;
  height: 100%;
  border: none;
  color: ${(props) => (props.mode === "light" ? "black" : "white")};
  outline: none;
  background-color: transparent;
  font-size: 1rem;
  padding: 0 1rem;
  box-shadow: ${(p) => p.theme.shadowInset};
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
`;

const SearchButton = styled.div`
  width: 8%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.blue};
  color: white;
`;

const ItemsPerPageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 35%;
  margin-left: auto;
`;

const ItemsSelect = styled.select<{ mode: string }>`
  height: 100%;
  padding: 0 0.2rem;
  border-radius: 5px;
  background-color: transparent;
  box-shadow: ${(p) => p.theme.shadowInset};
  outline: none;
  border: none;
  color: ${(props) => (props.mode === "light" ? "black" : "white")};
`;

const FilterButton = styled.div`
  height: 35%;
  gap: 0.5rem;
  padding: 0 0.7rem;
  position: relative;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: ${(p) => p.theme.blue};
  box-shadow: ${(p) => p.theme.shadow};
`;

const AddUserButton = styled.div`
  height: 35%;
  padding: 0 0.7rem;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 5px;
  background: ${(p) => p.theme.blue};
  color: white;
  box-shadow: ${(p) => p.theme.shadow};
  display: flex;
  align-items: center;
`;

const DropdownContainer = styled.div`
  width: 320px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  padding: 1rem;
  overflow: hidden;
  background-color: ${(p) => p.theme.secondary};
  box-shadow: ${(p) => p.theme.shadow};
  position: absolute;
  top: 110%;
  right: 0%;
  opacity: 0;
  visibility: hidden;
  transform: scaleY(0);
  transform-origin: top;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out,
    visibility 0.3s;
  z-index: 50;

  /* Add this for visibility when active */
  &.active {
    opacity: 1;
    visibility: visible;
    transform: scaleY(1);
  }
`;

const FilterSection = styled.div`
  width: 140px;
  background-color: ${(p) => p.theme.tertiary};
  padding: 0.5rem;
  border-radius: 10px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(p) => p.theme.primary};
  margin-top: 0.5rem;
`;

const FilterOption = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FilterCheckbox = styled.input`
  width: 1rem;
  height: 1rem;
`;

const Option = styled.option`
background-color: ${(p) => p.theme.secondary};
color: ${(p) => p.theme.font};
`;

export default SearchAndFilterPanel;
