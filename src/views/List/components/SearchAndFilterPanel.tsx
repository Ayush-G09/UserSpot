import { faMagnifyingGlass, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import Label from '../../../components/Label';
import { User } from '../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Modal from '../../../components/Modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { addUser } from '../../../store/action';

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
}

type UserFormInputs = Omit<User, "id">;

const generateRandomCoordinate = (min: number, max: number) => {
  return (Math.random() * (max - min) + min).toFixed(6); // Keep 6 decimal places
};


function SearchAndFilterPanel({searchQuery, setSearchQuery, setShowItems, showItems, setFilterOpen, filterOpen, handleFilterChange, orgData, filterData}: Props) {
    const mode = useSelector((state: RootState) => state.mode);
    const [addUserModal, setAddUserModal] = useState<boolean>(false);

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<UserFormInputs>();

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
    reset(); // Reset the form after submission
  };
  return (
    <>
    <div style={{width: '100%', minHeight: '15%', gap: '2.5rem', display: 'flex', alignItems: 'center', boxSizing: 'border-box', padding: '0 2rem'}}>
        <div style={{width: '40%', height: '40%', borderRadius: '20px', display: 'flex', overflow: 'hidden'}}>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search name, email or company' style={{width: '92%', height: '100%', border: 'none', color: mode === 'light' ? 'black' : 'white', outline: 'none', backgroundColor: 'transparent', fontSize: '1rem', padding: '0 1rem', boxShadow: 'inset 0px 0px 5px 0px rgba(0, 0, 0, 0.3)', borderBottomLeftRadius: '20px', borderTopLeftRadius: '20px'}} />
          <div style={{width: '8%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#29b6f6', color: 'white'}}>
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', height: '35%', marginLeft: 'auto'}}>
          <Label>Items per page</Label>
          <select onChange={(e) => setShowItems(Number(e.target.value))} id='rows' value={showItems} style={{height: '100%', padding: '0 0.2rem', borderRadius: '5px', backgroundColor: 'transparent', boxShadow: 'inset 0px 0px 5px 0px rgba(0, 0, 0, 0.3)', outline: 'none', border: 'none', color: mode === 'light' ? 'black' : 'white'}}>
            <option style={{background: 'black'}} value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div id="filter" onClick={() => setFilterOpen(!filterOpen)} style={{height: '35%', gap: '0.5rem', padding: '0 0.7rem', position: 'relative', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', background: '#29b6f6', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)'}}>
          <FontAwesomeIcon icon={faFilter} />
          <Label sx={{color: 'white'}}>Filter</Label>
          <div
          onClick={(e) => e.stopPropagation()}
  id="filter-con"
  style={{
    width: "320px",
    display: "flex",
    justifyContent: 'space-between',
    borderRadius: "10px",
    padding: "1rem",
    overflow: "hidden",
    backgroundColor: "#fafafa",
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.3)",
    position: "absolute",
    top: "110%",
    right: "0%",
    opacity: 0,
    visibility: "hidden",
    transform: "scaleY(0)",
    transformOrigin: "top",
    transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out, visibility 0.3s",
    zIndex: 50,
  }}
>
            <div style={{width: '140px', backgroundColor: '#e4e5f1', padding: '0.5rem', borderRadius: '10px'}}>
            <Label>City</Label>
            <div style={{borderBottom: '1px solid black', marginTop: '0.2rem'}}/>
            {orgData.map((data) => (<div key={`${data.id}${data.address.city}`} style={{width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Label size='0.7rem' weight='bold'>{data.address.city}</Label>
              <input onChange={(e) =>handleFilterChange(e)} checked={filterData.includes(data.address.city)} style={{width: '1rem', height: '1rem'}} type="checkbox" value={data.address.city}/>
            </div>))}
            </div>
            <div style={{width: '140px', backgroundColor: '#e4e5f1', padding: '0.5rem', borderRadius: '10px'}}>
            <Label>Company</Label>
            <div style={{borderBottom: '1px solid black', marginTop: '0.2rem'}}/>
            {orgData.map((data) => (<div key={`${data.id}${data.company.name}`} style={{width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Label size='0.7rem' weight='bold'>{data.company.name}</Label>
              <input onChange={(e) =>handleFilterChange(e)} checked={filterData.includes(data.company.name)} style={{width: '1rem', height: '1rem'}} type="checkbox" value={data.company.name}/>
            </div>))}
            </div>
          </div>
        </div>
        <div onClick={() => setAddUserModal(true)} style={{height: '35%', padding: '0 0.7rem', gap: '0.5rem', cursor: 'pointer', borderRadius: '5px', background: '#29b6f6', color: 'white', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center'}}>
          <FontAwesomeIcon icon={faPlus}/>
          <Label>New User</Label>
        </div>
      </div>
      {addUserModal && <Modal onClose={() => setAddUserModal(false)}>
        <Label>Add New User</Label>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <Label>Name</Label>
        <Input {...register("name", { required: "Name is required" })} />
        {errors.name && <Error>{errors.name.message}</Error>}
      </FormField>

      <FormField>
        <Label>Username</Label>
        <Input {...register("username", { required: "Username is required" })} />
        {errors.username && <Error>{errors.username.message}</Error>}
      </FormField>

      <FormField>
        <Label>Email</Label>
        <Input {...register("email", { required: "Email is required" })} />
        {errors.email && <Error>{errors.email.message}</Error>}
      </FormField>

      <FormField>
        <Label>Street</Label>
        <Input {...register("address.street", { required: "Street is required" })} />
        {errors.address?.street && <Error>{errors.address.street.message}</Error>}
      </FormField>

      <FormField>
        <Label>Suite</Label>
        <Input {...register("address.suite")} />
      </FormField>

      <FormField>
        <Label>City</Label>
        <Input {...register("address.city", { required: "City is required" })} />
        {errors.address?.city && <Error>{errors.address.city.message}</Error>}
      </FormField>

      <FormField>
        <Label>Zipcode</Label>
        <Input {...register("address.zipcode", { required: "Zipcode is required" })} />
        {errors.address?.zipcode && <Error>{errors.address.zipcode.message}</Error>}
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
          <GenerateButton type="button" onClick={handleGenerateCoordinates}>
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
      </Modal>}
      </>
  )
};

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
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
`;

export const GeoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const GeoInput = styled(Input)`
  flex: 1;
  background: #f0f0f0;
  cursor: not-allowed;
`;

export const GenerateButton = styled.button`
  padding: 0.5rem 1rem;
  background: #007bff;
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

export default SearchAndFilterPanel