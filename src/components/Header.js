import React, {useContext} from "react";
import {withRouter, NavLink} from "react-router-dom";
import {FirebaseContext} from "../firebase";

const Header = () => {
  const {currentUser, firebase} = useContext(FirebaseContext);

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
        <div className="divider"> |</div>
        <NavLink className="header-link" to="/top">
          Top
        </NavLink>
        <div className="divider"> |</div>
        <NavLink to="/search" className="header-link">
          Search
        </NavLink>
        {currentUser && (
          <>
            <div className="divider"> |</div>
            <NavLink to="/create" className="header-link">
              Submit
            </NavLink>
          </>
        )}
      </div>
      <div className="flex">
        {
          currentUser ? (
              <>
                <div className="header-name">{currentUser.displayName}</div>
                <div className="divider"> |</div>
                <div className="header-button" onClick={() => firebase.logout()}>Log Out</div>
              </>
            ) :
            <NavLink to="/login" className="header-link">
              Log In
            </NavLink>
        }

      </div>
    </div>
  );
}

export default withRouter(Header);
