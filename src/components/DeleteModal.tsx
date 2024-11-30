import React from "react";
import Label from "./Label";
import styled from "styled-components";

type Props = {
  name?: string;
  handleDeleteUser: () => void;
  setDeleteModal: (v: boolean) => void;
};

function DeleteModal({ name = 'xx', handleDeleteUser, setDeleteModal }: Props) {
  return (
    <>
      <Label size="1.2rem">Are you sure ?</Label>
      <Label sx={{ marginTop: "2rem" }}>
        Delete {name} data it can't be recovered.
      </Label>
      <ButtonContainer>
        <Button onClick={handleDeleteUser} style={{ background: "green" }}>
          Delete
        </Button>
        <Button
          onClick={() => setDeleteModal(false)}
          style={{ background: "red" }}
        >
          Cancel
        </Button>
      </ButtonContainer>
    </>
  );
}

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 2rem;
  margin-top: 2rem;
`;

const Button = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
`;

export default DeleteModal;
