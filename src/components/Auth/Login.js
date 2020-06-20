import React, {useState} from "react";
import {Link} from "react-router-dom";
import useFormValidation from "./useFormValidation";
import validateLogin from "./validateLogin";
import firebase from "../../firebase";

const INITIAL_STATE = {
  name: '',
  email: '',
  password: ''
}

const Login = ({history}) => {
  const [login, setLogin] = useState(true);
  const [firebaseError, setfirebaseError] = useState(null);

  const authenticateUser = async () => {
    try {
      login ? await firebase.login(email, password) : await firebase.register(name, email, password);
      history.push("/");
    } catch (error) {
      console.error("Authentication error.", error);
      setfirebaseError(error.message);
    }
  }

  const {handleChange, handleSubmit, values, handleBlur, isSubmitting, errors} = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);
  const {name, email, password} = values;

  return (
    <div>
      <h2 className="mv3">{login ? 'Sign In' : 'Create an account'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-column">
        {!login && (
          <input
            name="name"
            value={name}
            type="text"
            placeholder="Your Name"
            autoComplete="off"
            onChange={handleChange}
          />
        )}
        <input
          className={errors.email && 'error-input'}
          name="email"
          onBlur={handleBlur}
          value={email}
          type="email"
          placeholder="Email Address"
          autoComplete="off"
          onChange={handleChange}
        />

        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          className={errors.password && 'error-input'}
          name="password"
          onBlur={handleBlur}
          value={password}
          type="password"
          placeholder={login ? 'Enter your password' : "Choose a secure password"}
          onChange={handleChange}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        {firebaseError && <p className="error-text">{firebaseError}</p>}
        <div className="flex mt3">
          <button type="submit" className="button pointer mr2" disabled={isSubmitting}
                  style={{backgroundColor: isSubmitting ? 'grey' : 'orange'}}>Submit
          </button>
          <button
            type="button"
            className="button pointer"
            onClick={() => setLogin(prevLogin => !prevLogin)}>
            {login ? "Need to create an account?" : "Already Have an Account?"}
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <Link to="/forgot">Forgot Password?</Link>
      </div>
    </div>
  )
}

export default Login;
