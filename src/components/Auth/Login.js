import React, {useState} from "react";
import useFormValidation from "./useFormValidation";
import validateLogin from "./validateLogin";

const INITIAL_STATE = {
  name: '',
  email: '',
  password: ''
}

const Login = () => {
  const {handleChange, handleSubmit, values, handleBlur, isSubmitting, errors} = useFormValidation(INITIAL_STATE, validateLogin);
  const [login, setLogin] = useState(true);
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
          placeholder="Choose a secure password"
          onChange={handleChange}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        <div className="flex mt3">
          <button type="submit" className="button pointer mr2">Submit</button>
          <button
            type="button"
            className="button pointer"
            onClick={() => setLogin(prevLogin => !prevLogin)}>
            {login ? "Need to create an account?" : "Already Have an Account?"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login;
