import React, { useEffect, useState } from 'react';
import { User } from '../../../types';
import { faEllipsisVertical, faArrowUpRightFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Label from '../../../components/Label';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../store/action';
import Modal from '../../../components/Modal';

type Props = {
  user: User;
};

function UserCard({ user }: Props) {
  const mode = useSelector((state: RootState) => state.mode);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const tooltipElement = document.getElementById(`tooltip-${user.id}`);
    const toolContainer = document.getElementById(`tool-container-${user.id}`);

    if (tooltipElement) {
      tooltipElement.style.visibility = tooltipOpen ? 'visible' : 'hidden';
      tooltipElement.style.opacity = tooltipOpen ? '1' : '0';
      tooltipElement.style.transform = tooltipOpen ? 'scaleY(1)' : 'scaleY(0)';
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolContainer &&
        !toolContainer.contains(event.target as Node) &&
        tooltipElement &&
        !tooltipElement.contains(event.target as Node)
      ) {
        setTooltipOpen(false);
      }
    };

    if (tooltipOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [tooltipOpen, user.id]);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleDeleteUser = () => {
      dispatch(deleteUser(user.id));
      setDeleteModal(false);
  };

  return (
    <>
    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '22%', display: 'flex', padding: '0.6rem 0', gap: '0.5rem' }}>
        <img
          alt="user"
          src="https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg"
          style={{ borderRadius: '50%', width: '2rem', height: '2rem' }}
        />
        <div style={{ width: '83%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <Label>{user.name}</Label>
          <Label size="0.7rem" sx={{ color: 'gray' }}>
            {user.phone}
          </Label>
        </div>
      </div>
      <div style={{ width: '23%', gap: '0.5rem', display: 'flex' }}>
        <Label size="0.8rem">{user.email}</Label>
      </div>
      <div style={{ width: '34%', gap: '0.5rem', display: 'flex' }}>
        <Label>{`${user.address.street}, ${user.address.city}, ${user.address.zipcode}`}</Label>
      </div>
      <div style={{ width: '18%', gap: '0.5rem', display: 'flex' }}>
        <Label>{user.company.name}</Label>
      </div>
      <div
        id={`tool-container-${user.id}`}
        onClick={() => setTooltipOpen(!tooltipOpen)}
        style={{
          width: '3%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: mode === 'light' ? 'black' : 'white',
          cursor: 'pointer',
        }}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
        <div
          id={`tooltip-${user.id}`}
          onClick={(e) => e.stopPropagation()} 
          style={{
            position: 'absolute',
            visibility: 'hidden',
            opacity: 0,
            transform: 'scaleY(0)',
            padding: '0rem 0.5rem',
            display: 'flex',
            borderRadius: '5px',
            backgroundColor: '#fafafa',
            boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)',
            top: '-40%',
            right: '80%',
            zIndex: 10,
          }}
        >
        <div style={{padding: '0.5rem'}}>
          <FontAwesomeIcon onClick={() => navigate(`/user/${user.id}`)} size="xs" color="blue" icon={faArrowUpRightFromSquare} />
        </div>
        <div style={{padding: '0.5rem'}}>
          <FontAwesomeIcon onClick={() => setDeleteModal(true)} size="xs" color="red" icon={faTrash} />
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
</>
  );
}

export default UserCard;
