import { useState } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceLaugh } from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import { Link } from "react-router-dom";
import { logoutUser, logInUser } from "../Api.js";
import { useNavigate } from "react-router-dom";
function Header(props) {
  const nevigate = useNavigate();
  const [user, setUser] = useState(props.user);

  const onHandleLogout = () => {
    props.onHandleLogout();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center m-2 headerStyle">
        {props.user ? (
          <DropdownButton
            id="dropdown-basic-button"
            title={`Logged in as ${props.user}`}
            className="headerDropDown"
          >
            <Dropdown.Item onClick={onHandleLogout}>Logout</Dropdown.Item>
          </DropdownButton>
        ) : (
          <div style={{ width: "150px" }}> </div>
        )}
        <h3 className="mx-auto">
          Level Up Your Laughs! <FontAwesomeIcon icon={faFaceLaugh} />
        </h3>
        {props.user ? (
          <div style={{ marginRight: "20px" }}>
            <Link to={"/profile"} className="linkStyle">
              Profile
            </Link>
          </div>
        ) : (
          <div style={{ width: "150px" }}>
            <Button
              className="btn btn-light"
              onClick={() => nevigate("/login")}
            >
              Login
            </Button>{" "}
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
