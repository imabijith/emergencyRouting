import React, { useState } from "react";
import Base from "../core/base";
import { isAdminAuthenticated } from "../auth/helper";
import { userRegister } from "./helper/adminapicall";
import { Redirect } from "react-router-dom";

const Registration = ({ history }) => {
  const [values, setValues] = useState({
    uid: "",
    name: "",
    phone: "",
    rank: "",
    shift: "",
    password: "",
    error: "",
    success: false,
    isRedirect: false,
  });

  const {
    uid,
    name,
    phone,
    rank,
    shift,
    password,
    error,
    success,
    isRedirect,
  } = values;

  const { user, token } = isAdminAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      error: false,
      success: false,
      [name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    userRegister({ uid, name, phone, rank, shift, password }, user.gid, token)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            uid: "",
            name: "",
            phone: "",
            rank: "",
            shift: "",
            password: "",
            success: true,
            isRedirect: true,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const successMessage = () => {
    return (
      <div
        className="col-md-4 offset-sm-4 alert alert-success"
        style={{ display: success ? "" : "none" }}
      >
        <h4>Official Registered Succesfully</h4>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        className="col-md-4 offset-sm-4 alert alert-success"
        style={{ display: error ? "" : "none" }}
      >
        <h4>{error}</h4>
      </div>
    );
  };

  const toAdminDashboard = () => {
    setTimeout(() => {
      if (isRedirect) {
        history.push("/admin/dashboard");
      }
    }, 2000);
  };

  const shifts = [
    { id: "Shift 1", value: 1 },
    { id: "Shift 2", value: 2 },
    { id: "Other", value: 3 },
  ];

  const RegistrationForm = () => (
    <div className="row">
      <div className="col-md-4 offset-sm-4 border rounded border-info">
        <br />
        <form>
          <div className="form-group">
            <label className="text-black">UID</label>
            <input
              type="text"
              value={uid}
              onChange={handleChange("uid")}
              className="form-control border-dark"
            />
          </div>
          <div className="form-group">
            <label className="text-black">Name</label>
            <input
              type="text"
              value={name}
              onChange={handleChange("name")}
              className="form-control border-dark"
            />
          </div>
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
            <label className="text-black">Rank</label>
            <input
              type="text"
              value={rank}
              onChange={handleChange("rank")}
              className="form-control border-dark"
            />
          </div>
          <div className="form-group">
            <label className="text-black">Shift</label>
            <select
              onChange={handleChange("shift")}
              className="form-control border-dark"
              placeholder="Category"
            >
              <option>Select</option>
              {shifts.map((sh, index) => (
                <option key={index} value={sh.value}>
                  {sh.id}
                </option>
              ))}
            </select>
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
            Register User
          </button>
        </form>
        <br /> <br />
      </div>
    </div>
  );

  return (
    <Base
      title="Officer Account Registration"
      description="Add new accounts of traffic officials in your station here."
    >
      <br />
      {RegistrationForm()}
      <br />
      {successMessage()}
      {errorMessage()}
      {toAdminDashboard()}
    </Base>
  );
};

export default Registration;
