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
      <StyledIcon icon={faHubspot} />
      <Label size="1.2rem" weight="bold">
        UserSpot
      </Label>
      <ToggleSwitch>
        <ToggleCircle onClick={toggleMode} mode={mode}>
          <FontAwesomeIcon icon={faMoon} />
        </ToggleCircle>
        <ToggleCircle onClick={toggleMode} mode={mode} isSun>
          <FontAwesomeIcon icon={faSun} />
        </ToggleCircle>
      </ToggleSwitch>
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

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  color: red;
`;

const ToggleSwitch = styled.div`
  width: 70px;
  height: 30px;
  box-shadow: ${(p) => p.theme.shadowInset};
  border-radius: 20px;
  margin-left: auto;
  display: flex;
  align-items: center;
  padding: 0 3px;
  position: relative;
`;

const ToggleCircle = styled.div<{ mode: string; isSun?: boolean }>`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.isSun
      ? props.mode === "light"
        ? "orange"
        : "transparent"
      : props.mode === "light"
      ? "transparent"
      : "gray"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.isSun
      ? props.mode === "light"
        ? "white"
        : "gray"
      : props.mode === "light"
      ? "black"
      : "white"};
  cursor: pointer;
  position: absolute;
  left: ${(props) => (props.isSun ? (props.mode === "light" ? "48px" : "2px") : props.mode === "light" ? "2px" : "48px")};
  transition: 0.3s ease-in-out;
`;

export default Header;
