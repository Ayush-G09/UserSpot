import { useState } from "react";
import Label from "../components/Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faGlobe,
  faLocationDot,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import Modal from "../components/Modal";
import {
  addNotification,
  deleteUser,
  removeNotification,
  updateUser,
} from "../store/action";
import {
  FormContainer,
  FormField,
  Input,
  GeoContainer,
  GeoInput,
  GenerateButton,
  SubmitButton,
  Error,
} from "./List/components/SearchAndFilterPanel";
import { useForm, SubmitHandler } from "react-hook-form";
import { NotificationCard, User } from "../types";
import DeleteModal from "../components/DeleteModal";
import styled from "styled-components";

type UserFormInputs = Omit<User, "id">;

const generateRandomCoordinate = (min: number, max: number) => {
  return (Math.random() * (max - min) + min).toFixed(6);
};

function UserView() {
  const { id } = useParams();

  const users = useSelector((state: RootState) => state.users);
  const mode = useSelector((state: RootState) => state.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = users.find((user) => user.id === Number(id));

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editUserModal, setEditUserModal] = useState<boolean>(false);

  const handleDeleteUser = () => {
    dispatch(deleteUser(Number(id)));
    navigate("/");
    const notification: NotificationCard = {
      msg: "User deleted.",
      type: "success",
      id: Date.now().toString(),
    };

    dispatch(addNotification(notification));

    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 5000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm(
    user && {
      defaultValues: {
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        username: user?.username,
        website: user?.website,
        address: {
          street: user?.address.street,
          suite: user?.address.suite,
          city: user?.address.city,
          zipcode: user?.address.zipcode,
          geo: {
            lat: user?.address.geo.lat,
            lng: user?.address.geo.lng,
          },
        },
        company: {
          name: user?.company.name,
          catchPhrase: user?.company.catchPhrase,
          bs: user?.company.bs,
        },
      },
    }
  );

  const handleGenerateCoordinates = () => {
    const randomLat = generateRandomCoordinate(-90, 90);
    const randomLng = generateRandomCoordinate(-180, 180);
    setValue("address.geo.lat", randomLat);
    setValue("address.geo.lng", randomLng);
  };

  const onSubmit: SubmitHandler<UserFormInputs> = (data) => {
    const newUser = {
      ...data,
      id: user!.id,
    };
    dispatch(updateUser(newUser));
    setEditUserModal(false);

    const notification: NotificationCard = {
      msg: "User updated.",
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
      <StyledUserView>
        <LeftSection>
          <Avatar
            alt="user"
            src="https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg"
          />
          <UserInfo>
            <Label size="1.5rem">{user?.name}</Label>
            <Label sx={{ color: "gray" }}>{user?.username}</Label>
          </UserInfo>
          <DetailRow>
            <Label>Email</Label>
            <Label sx={{ color: "gray" }}>{user?.email}</Label>
          </DetailRow>
          <DetailRow>
            <Label>Phone</Label>
            <Label sx={{ color: "gray" }}>{user?.phone}</Label>
          </DetailRow>
          <ButtonGroup>
            <Button
              onClick={() => setEditUserModal(true)}
              style={{ backgroundColor: "#0288d1" }}
            >
              <FontAwesomeIcon icon={faPen} />
              <Label sx={{color: 'white'}}>Edit</Label>
            </Button>
            <Button
              onClick={() => setDeleteModal(true)}
              style={{ backgroundColor: "red" }}
            >
              <FontAwesomeIcon icon={faTrash} />
              <Label sx={{color: 'white'}}>Delete</Label>
            </Button>
          </ButtonGroup>
        </LeftSection>
        <RightSection>
          <Card>
            <FontAwesomeIcon icon={faGlobe} color={mode === 'light' ? 'black' : 'white'} />
            <Label>Website</Label>
            <Label sx={{ color: "gray", marginLeft: "auto" }}>
              {user?.website}
            </Label>
          </Card>

          <Card flexDirection="column">
            <CardHeader>
              <FontAwesomeIcon icon={faBriefcase} color={mode === 'light' ? 'black' : 'white'} />
              <Label>Company</Label>
            </CardHeader>
            <Divider />
            <CardDetailRow>
              <Label>Name</Label>
              <Label sx={{ color: "gray", marginLeft: "auto" }}>
                {user?.company.name}
              </Label>
            </CardDetailRow>
            <CardDetailRow>
              <Label>Catch Phrase</Label>
              <Label sx={{ color: "gray", marginLeft: "auto" }}>
                {user?.company.catchPhrase}
              </Label>
            </CardDetailRow>
            <CardDetailRow>
              <Label>Bs</Label>
              <Label sx={{ color: "gray", marginLeft: "auto" }}>
                {user?.company.bs}
              </Label>
            </CardDetailRow>
          </Card>

          <Card flexDirection="column">
            <CardDetailRow>
              <FontAwesomeIcon icon={faLocationDot} color={mode === 'light' ? 'black' : 'white'} />
              <Label>Address</Label>
            </CardDetailRow>
            <Divider />
            <CardDetailRow>
              <Label>Street</Label>
              <Label sx={{ color: "gray", marginLeft: "auto" }}>
                {user?.address.street}
              </Label>
            </CardDetailRow>
            <CardDetailRow>
              <Label>Suiet</Label>
              <Label sx={{ color: "gray", marginLeft: "auto" }}>
                {user?.address.suite}
              </Label>
            </CardDetailRow>
            <CardDetailRow>
              <Label>City</Label>
              <Label sx={{ color: "gray", marginLeft: "auto" }}>
                {user?.address.city}
              </Label>
            </CardDetailRow>
            <CardDetailRow>
              <Label>Zipcode</Label>
              <Label sx={{ color: "gray", marginLeft: "auto" }}>
                {user?.address.zipcode}
              </Label>
            </CardDetailRow>
          </Card>
        </RightSection>
      </StyledUserView>
      {deleteModal && (
        <Modal onClose={() => setDeleteModal(false)}>
          <DeleteModal
            handleDeleteUser={handleDeleteUser}
            setDeleteModal={setDeleteModal}
            name={user?.name}
          />
        </Modal>
      )}
      {editUserModal && (
        <Modal onClose={() => setEditUserModal(false)}>
          <Label>Edit User</Label>
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

            <SubmitButton type="submit">Update User</SubmitButton>
          </FormContainer>
        </Modal>
      )}
    </>
  );
}

const StyledUserView = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const LeftSection = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 15rem;
  height: 15rem;
  box-shadow: ${(p) => p.theme.shadow};
`;

const UserInfo = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
`;

const DetailRow = styled.div`
  display: flex;
  width: 70%;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 70%;
  justify-content: end;
  margin-top: 3rem;
  gap: 2rem;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  box-shadow: ${(p) => p.theme.shadow};
`;

const RightSection = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
`;

const Card = styled.div<{ flexDirection?: string }>`
  width: 50%;
  padding: 1rem;
  border-radius: 10px;
  background-color: ${(p) => p.theme.secondary};
  gap: 1rem;
  display: flex;
  align-items: center;
  flex-direction: ${(p) => (p.flexDirection ? p.flexDirection : "roe")};
`;

const CardHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Divider = styled.div`
  width: 100%;
  background: ${(p) => p.theme.primary};
  height: 1px;
`;

const CardDetailRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export default UserView;
