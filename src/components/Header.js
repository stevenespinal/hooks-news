import React from "react";
import {withRouter, NavLink} from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="flex">
        <img src="/logo.png" alt="Hooks News Logo" className="logo"/>
        <NavLink to="/" className="header-title">
          Hooks News
        </NavLink>
        <NavLink to="/" className="header-link">
          New
        </NavLink>
        <div className="divider"> | </div>
        <NavLink className="header-link" to="/top">
          Top
        </NavLink>
        <div className="divider"> | </div>
        <NavLink to="/search" className="header-link">
          Search
        </NavLink>
        <div className="divider"> | </div>
        <NavLink to="/create" className="header-link">
          Submit
        </NavLink>
      </div>
      <div className="flex">
        <NavLink to="/login" className="header-link">
          Log In
        </NavLink>

      </div>
    </div>
  );
}

export default withRouter(Header);
