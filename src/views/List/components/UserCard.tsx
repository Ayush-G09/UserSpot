import { useEffect, useState } from "react";
import styled from "styled-components";
import { NotificationCard, User } from "../../../types";
import {
  faEllipsisVertical,
  faArrowUpRightFromSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Label from "../../../components/Label";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import {
  addNotification,
  deleteUser,
  removeNotification,
} from "../../../store/action";
import Modal from "../../../components/Modal";
import DeleteModal from "../../../components/DeleteModal";

type Props = {
  user: User;
};

type State = {
  tooltipOpen: boolean;
  deleteModal: boolean;
};

function UserCard({ user }: Props) {
  const mode = useSelector((state: RootState) => state.mode);
  const [state, setState] = useState<State>({
    tooltipOpen: false,
    deleteModal: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const tooltipElement = document.getElementById(`tooltip-${user.id}`);
    const toolContainer = document.getElementById(`tool-container-${user.id}`);

    if (tooltipElement) {
      tooltipElement.style.visibility = state.tooltipOpen
        ? "visible"
        : "hidden";
      tooltipElement.style.opacity = state.tooltipOpen ? "1" : "0";
      tooltipElement.style.transform = state.tooltipOpen
        ? "scaleY(1)"
        : "scaleY(0)";
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolContainer &&
        !toolContainer.contains(event.target as Node) &&
        tooltipElement &&
        !tooltipElement.contains(event.target as Node)
      ) {
        setState((prev) => ({ ...prev, tooltipOpen: false }));
      }
    };

    if (state.tooltipOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [state.tooltipOpen, user.id]);

  const dispatch = useDispatch();

  const handleDeleteUser = () => {
    dispatch(deleteUser(user.id));
    setState((prev) => ({ ...prev, deleteModal: false }));
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

  const tooltipStyles: React.CSSProperties = {
    visibility: state.tooltipOpen ? "visible" : "hidden",
    opacity: state.tooltipOpen ? "1" : "0",
    transform: state.tooltipOpen ? "scaleY(1)" : "scaleY(0)",
  };

  return (
    <>
      <UserCardWrapper>
        <UserDetails>
          <img
            alt="user"
            src="https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg"
          />
          <div>
            <Label>{user.name}</Label>
            <Label size="0.7rem" sx={{ color: "gray" }}>
              {user.phone}
            </Label>
          </div>
          <TooltipActionWrapper>
            <FontAwesomeIcon
              onClick={() => navigate(`/user/${user.id}`)}
              size="xs"
              color="#0288d1"
              icon={faArrowUpRightFromSquare}
            />
            <FontAwesomeIcon
              onClick={() =>
                setState((prev) => ({ ...prev, deleteModal: true }))
              }
              size="xs"
              color="red"
              icon={faTrash}
            />
          </TooltipActionWrapper>
        </UserDetails>
        <UserInfo>
          <WrapperLabel>Email</WrapperLabel>
          <WrapperData>{user.email}</WrapperData>
        </UserInfo>
        <AddressWrapper>
          <Label>{`${user.address.street}, ${user.address.city}, ${user.address.zipcode}`}</Label>
        </AddressWrapper>
        <CompanyWrapper>
          <WrapperLabel>Company</WrapperLabel>
          <WrapperData>{user.company.name}</WrapperData>
        </CompanyWrapper>
        <ToolContainer
          id={`tool-container-${user.id}`}
          mode={mode}
          onClick={() =>
            setState((prev) => ({ ...prev, tooltipOpen: !state.tooltipOpen }))
          }
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
          <Tooltip
            id={`tooltip-${user.id}`}
            style={tooltipStyles} // Cast the style to React.CSSProperties
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <FontAwesomeIcon
                onClick={() => navigate(`/user/${user.id}`)}
                size="xs"
                color="#0288d1"
                icon={faArrowUpRightFromSquare}
              />
            </div>
            <div>
              <FontAwesomeIcon
                onClick={() =>
                  setState((prev) => ({ ...prev, deleteModal: true }))
                }
                size="xs"
                color="red"
                icon={faTrash}
              />
            </div>
          </Tooltip>
        </ToolContainer>
      </UserCardWrapper>
      {state.deleteModal && (
        <Modal
          onClose={() => setState((prev) => ({ ...prev, deleteModal: false }))}
        >
          <DeleteModal
            handleDeleteUser={handleDeleteUser}
            name={user?.name}
            setDeleteModal={() =>
              setState((prev) => ({ ...prev, deleteModal: false }))
            }
          />
        </Modal>
      )}
    </>
  );
}

const TooltipActionWrapper = styled.div`
  && {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
    gap: 1rem;
    width: fit-content;

    @media (min-width: 1100px) {
      display: none;
    }
  }
`;

const WrapperLabel = styled.label`
  color: ${(p) => p.theme.font};
  font-size: 0.8rem;
  color: gray;
  margin-right: auto;

  @media (min-width: 1100px) {
    display: none;
  }
`;

const WrapperData = styled.label`
  color: ${(p) => p.theme.font};
  font-size: 0.8rem;
  word-break: break-word;

  @media (min-width: 1100px) {
    font-size: 1rem;
  }
`;

const UserCardWrapper = styled.div`
  width: 96%;
  display: flex;
  align-items: start;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: ${(p) => p.theme.shadow};
  margin-bottom: 1rem;
  padding: 0 0.5rem;
  padding-bottom: 0.5rem;
  box-sizing: border-box;

  @media (min-width: 1100px) {
    width: 100%;
    align-items: center;
    flex-direction: row;
    box-shadow: none;
    margin-bottom: 0;
    padding: 0;
    padding-bottom: 0;
  }
`;

const UserDetails = styled.div`
  width: 100%;
  display: flex;
  padding: 0.6rem 0;
  gap: 0.5rem;

  img {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
  }

  div {
    width: 83%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  @media (min-width: 1100px) {
    width: 22%;
  }
`;

const UserInfo = styled.div`
  width: 100%;
  gap: 0.5rem;
  display: flex;
  align-items: center;

  @media (min-width: 1100px) {
    width: 23%;
  }
`;

const AddressWrapper = styled.div`
  width: 34%;
  gap: 0.5rem;
  display: none;

  @media (min-width: 1100px) {
    display: flex;
  }
`;

const CompanyWrapper = styled.div`
  width: 100%;
  gap: 0.5rem;
  display: flex;
  align-items: center;

  @media (min-width: 1100px) {
    width: 18%;
  }
`;

const ToolContainer = styled.div<{ mode: string }>`
  width: 3%;
  position: relative;
  display: none;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.font};
  cursor: pointer;

  @media (min-width: 1100px) {
    display: flex;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  visibility: hidden;
  opacity: 0;
  transform: scaleY(0);
  padding: 0rem 0.5rem;
  display: flex;
  border-radius: 5px;
  background-color: ${(p) => p.theme.primary};
  box-shadow: ${(p) => p.theme.shadow};
  top: -40%;
  right: 80%;
  z-index: 10;

  div {
    padding: 0.5rem;
  }
`;

export default UserCard;
