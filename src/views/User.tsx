import React, { useState } from 'react'
import Label from '../components/Label'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faGlobe, faLocationDot, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Modal from '../components/Modal';
import { addNotification, deleteUser, removeNotification, updateUser } from '../store/action';
import { FormContainer, FormField, Input, GeoContainer, GeoInput, GenerateButton, SubmitButton, Error} from './List/components/SearchAndFilterPanel';
import { useForm, SubmitHandler } from 'react-hook-form';
import { NotificationCard, User } from '../types';

type UserFormInputs = Omit<User, "id">;

const generateRandomCoordinate = (min: number, max: number) => {
  return (Math.random() * (max - min) + min).toFixed(6); // Keep 6 decimal places
};

function UserView() {
    const { id } = useParams();

    const users = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = users.find((user) => user.id === Number(id));

    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [editUserModal, setEditUserModal] = useState<boolean>(false);

    const handleDeleteUser = () => {
        dispatch(deleteUser((Number(id))));
        navigate('/');
    };

    const { register, handleSubmit, formState: { errors }, setValue } = useForm(user && {
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
      });

    const handleGenerateCoordinates = () => {
        const randomLat = generateRandomCoordinate(-90, 90); // Latitude between -90 and 90
        const randomLng = generateRandomCoordinate(-180, 180); // Longitude between -180 and 180
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
        msg: 'User updated.',
        type: 'success',
        id: Date.now().toString(),
      };
  
      dispatch(addNotification(notification));

      setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);
    };
  return (
    <>
    <div style={{width: '100%', height: '100%', display: 'flex'}}>
        <div style={{width: '30%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <img alt='user' src="https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg" style={{ borderRadius: '50%', width: '15rem', height: '15rem', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)' }}/>
            <div style={{width: '70%', display: 'flex', flexDirection: 'column', marginTop: '5rem'}}>
                <Label size='1.5rem'>{user?.name}</Label>
                <Label sx={{color: 'gray'}}>{user?.username}</Label>
            </div>
            <div style={{display: 'flex', width: '70%', justifyContent: 'space-between', marginTop: '2rem'}}>
                <Label>Email</Label>
                <Label sx={{color: 'gray'}}>{user?.email}</Label>
            </div>
            <div style={{display: 'flex', width: '70%', justifyContent: 'space-between', marginTop: '1rem'}}>
                <Label>Phone</Label>
                <Label sx={{color: 'gray'}}>{user?.phone}</Label>
            </div>
            <div style={{display: 'flex', width: '70%', justifyContent: 'end', marginTop: '3rem', gap: '2rem'}}>
                <div onClick={() => setEditUserModal(true)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '10px', backgroundColor: 'blue', color: 'white', cursor: 'pointer', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)'}}>
                    <FontAwesomeIcon icon={faPen}/>
                    <Label>Edit</Label>
                </div>
                <div onClick={() => setDeleteModal(true)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '10px', backgroundColor: 'red', color: 'white', cursor: 'pointer', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)'}}>
                    <FontAwesomeIcon icon={faTrash}/>
                    <Label>Delete</Label>
                </div>
            </div>
        </div>
        <div style={{width: '70%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem'}}>
            <div style={{width: '50%', padding: '1rem', borderRadius: '10px', backgroundColor: '#2d2d30', gap: '1rem', display: 'flex', alignItems: 'center'}}>
                <FontAwesomeIcon icon={faGlobe} color='white' />
                <Label>Website</Label>
                <Label sx={{color: 'gray', marginLeft: 'auto'}}>{user?.website}</Label>
            </div>

            <div style={{width: '50%', padding: '1rem', borderRadius: '10px', backgroundColor: '#2d2d30', gap: '1rem', display: 'flex', flexDirection: 'column'}}>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <FontAwesomeIcon icon={faBriefcase} color='white' />
                    <Label>Company</Label>
                </div>
                <div style={{width: '100%', background: '#3e3e42', height: '1px'}}/>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Label>Name</Label>
                    <Label sx={{color: 'gray', marginLeft: 'auto'}}>{user?.company.name}</Label>
                </div>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Label>Catch Phrase</Label>
                    <Label sx={{color: 'gray', marginLeft: 'auto'}}>{user?.company.catchPhrase}</Label>
                </div>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Label>Bs</Label>
                    <Label sx={{color: 'gray', marginLeft: 'auto'}}>{user?.company.bs}</Label>
                </div>
            </div>

            <div style={{width: '50%', padding: '1rem', borderRadius: '10px', backgroundColor: '#2d2d30', gap: '1rem', display: 'flex', flexDirection: 'column'}}>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <FontAwesomeIcon icon={faLocationDot} color='white' />
                    <Label>Address</Label>
                </div>
                <div style={{width: '100%', background: '#3e3e42', height: '1px'}}/>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Label>Street</Label>
                    <Label sx={{color: 'gray', marginLeft: 'auto'}}>{user?.address.street}</Label>
                </div>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Label>Suiet</Label>
                    <Label sx={{color: 'gray', marginLeft: 'auto'}}>{user?.address.suite}</Label>
                </div>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Label>City</Label>
                    <Label sx={{color: 'gray', marginLeft: 'auto'}}>{user?.address.city}</Label>
                </div>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Label>Zipcode</Label>
                    <Label sx={{color: 'gray', marginLeft: 'auto'}}>{user?.address.zipcode}</Label>
                </div>
            </div>
        </div>
    </div>
    {deleteModal && <Modal onClose={() => setDeleteModal(false)}>
    <Label size='1.2rem'>Are you sure ?</Label>
    <Label sx={{marginTop: '2rem'}}>Delete {user?.name} data it can't be recovered.</Label>
    <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '2rem', marginTop: '2rem'}}>
        <div onClick={handleDeleteUser} style={{padding: '0.5rem 1rem', cursor: 'pointer', background: 'green', color: 'white', borderRadius: '10px', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)'}}>Delete</div>
        <div onClick={() => setDeleteModal(false)} style={{padding: '0.5rem 1rem', cursor: 'pointer', background: 'red', color: 'white', borderRadius: '10px', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)'}}>Cancel</div>
    </div>
</Modal>}
{editUserModal && <Modal onClose={() => setEditUserModal(true)}>
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
}

export default UserView