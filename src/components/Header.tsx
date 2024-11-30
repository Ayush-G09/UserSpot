import { faHubspot } from "@fortawesome/free-brands-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setMode } from "../store/action";
import styled from "styled-components";
import Label from "./Label";

function Header() {
  const mode = useSelector((state: RootState) => state.mode);

  const dispatch = useDispatch();

  const toggleMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    dispatch(setMode(newMode));
  };
  return (
    <StyledHeader>
      <FontAwesomeIcon
        icon={faHubspot}
        style={{ fontSize: "1.5rem", color: "red" }}
      />
      <Label size="1.2rem" weight="bold">
        UserSpot
      </Label>
      <div
        style={{
          width: "70px",
          height: "30px",
          boxShadow: "inset 0px 0px 6px 0px rgba(0, 0, 0, 0.3)",
          borderRadius: "20px",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          padding: "0 3px",
          position: "relative",
        }}
      >
        <div
          onClick={toggleMode}
          style={{
            width: "25px",
            height: "25px",
            borderRadius: "50%",
            backgroundColor: mode === "light" ? "transparent" : "gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: mode === "light" ? "black" : "white",
            cursor: "pointer",
            position: "absolute",
            left: mode === "light" ? 2 : 48,
            transition: "0.3s ease-in-out",
          }}
        >
          <FontAwesomeIcon icon={faMoon} />
        </div>
        <div
          onClick={toggleMode}
          style={{
            width: "25px",
            height: "25px",
            borderRadius: "50%",
            backgroundColor: mode === "light" ? "orange" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: mode === "light" ? "white" : "black",
            cursor: "pointer",
            position: "absolute",
            left: mode === "light" ? 48 : 2,
            transition: "0.3s ease-in-out",
          }}
        >
          <FontAwesomeIcon icon={faSun} />
        </div>
      </div>
    </StyledHeader>
  );
}

const StyledHeader = styled.div`
  height: 7%;
  width: 100%;
  display: flex;
  border-bottom: 1px solid ${(p) => p.theme.tertiary};
  box-sizing: border-box;
  align-items: center;
  padding: 0 1rem;
  gap: 0.5rem;
`;

export default Header;
