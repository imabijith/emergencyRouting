import React, { useState } from "react";
import {
  signin,
  adminAuthenticate,
  isAdminAuthenticated,
} from "../auth/helper";
import { Redirect } from "react-router-dom";
import {
  userSignIn,
  userAuthenticate,
  isUserAuthenticated,
} from "../auth/helper/userindex";
import MobileBase from "../core/mobilebase";

const UserSignIn = () => {
  const [value, setValue] = useState({
    phone: "",
    password: "",
    error: "",
    loading: false,
    isRedirect: false,
  });

  const { phone, password, error, loading, isRedirect } = value;

  const handleChange = (name) => (event) => {
    setValue({ ...value, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValue({ ...value, error: false, loading: true });
    userSignIn({ phone, password })
      .then((data) => {
        if (data.error) {
          setValue({ ...value, error: data.error, loading: false });
        } else {
          userAuthenticate(data, () => {
            setValue({ ...value, isRedirect: true });
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const loadingMessage = () => {
    return loading && <div className="alert alert-info">Loading..</div>;
  };

  const errorMessage = () => {
    return (
      error && (
        <div className="col-md-4 offset-sm-4">
          <div
            className="alert alert-warning"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      )
    );
  };

  const { user } = isUserAuthenticated();

  const onRedirect = () => {
    if (isRedirect) {
      if (user.phone) {
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (isUserAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  const SignInForm = () => {
    return (
      <div className="row col-10 offset-1 ">
        <div className="col-12 bg-lite border rounded border-dark">
          <br />
          <form>
            <div className="form-group">
              <label className="text-black">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={handleChange("phone")}
                className="form-control border-dark"
              />
            </div>
            <div className="form-group">
              <label className="text-black">Password</label>
              <input
                type="password"
                value={password}
                onChange={handleChange("password")}
                className="form-control border-dark"
              />
            </div>
            <br />
            <button onClick={onSubmit} className="btn btn-md bg-info btn-block">
              Sign in
            </button>
          </form>
          <br /> <br />
        </div>
      </div>
    );
  };

  return (
    <MobileBase className="bg-white" title="Traffic Official Login">
      <br /> <br />
      {SignInForm()}
      {loadingMessage()}
      {errorMessage()}
      {onRedirect()}
    </MobileBase>
  );
};

export default UserSignIn;
