import React, { useState, useEffect } from "react";
import Base from "../core/base";
import { isAdminAuthenticated } from "../auth/helper";
import { userRegister, getUser, userUpdate } from "./helper/adminapicall";
import { Redirect } from "react-router-dom";

const UpdateUser = ({ match, history }) => {
  const [values, setValues] = useState({
    uid: "",
    name: "",
    phone: "",
    rank: "",
    shift: "",
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

  const shifts = [
    { id: "Shift 1", value: 1 },
    { id: "Shift 2", value: 2 },
    { id: "Other", value: 3 },
  ];

  const preload = () => {
    getUser(user.gid, match.params.userId, token)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            uid: data.uid,
            name: data.name,
            phone: data.phone,
            rank: data.officer_rank,
            shift: data.shift,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    preload();
  }, []);

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
    userUpdate(user.gid, match.params.userId, token, {
      uid,
      name,
      phone,
      rank,
      shift,
      password,
    })
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
        <h4>Official Updated Succesfully</h4>
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

  const toManageUsers = () => {
    setTimeout(() => {
      if (isRedirect) {
        history.push("/admin/manageusers");
      }
    }, 2000);
  };

  const UpdationForm = () => (
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
              <option value={shift}>Shift {shift}</option>
              {shifts.map((sh, index) => (
                <option key={index} value={sh.value}>
                  {sh.id}
                </option>
              ))}
            </select>
          </div>
          <br />
          <button onClick={onSubmit} className="btn btn-md bg-info btn-block">
            Update User
          </button>
        </form>
        <br /> <br />
      </div>
    </div>
  );

  return (
    <Base
      title="Update Traffic Official's Account"
      description="You can update the accounts of registered traffic officials in your station here"
    >
      <br />
      {UpdationForm()}
      <br />
      {successMessage()}
      {errorMessage()}
      {toManageUsers()}
    </Base>
  );
};

export default UpdateUser;
