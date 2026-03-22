import React from "react";
import { Link } from "react-router-dom";
import logout from "../icon/logout.png";
import { withRouter } from "react-router";
import home from "../icon/home.png";

export function Header(props) {
  function handleLogout() {
    localStorage.removeItem("token");
    props.history.push("/login");
  }

  function handleHome() {
    props.history.push("/");
  }

  return (
    <>
      <nav>
        <Link to="/addMember">Add Member</Link>
        <Link to="/moveMember">Move Member</Link>
      </nav>
      <header>
        <h1>
          Team Tracker
          <img src={logout} alt="" onClick={handleLogout} />
          <img src={home} alt="" onClick={handleHome} />
        </h1>
      </header>
    </>
  );
}

export default withRouter(Header);
