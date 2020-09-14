import React, { useState, useEffect } from "react";
import Base from "../core/base";
import { Link, Redirect } from "react-router-dom";
import { isAdminAuthenticated } from "../auth/helper";
import { getUsers } from "./helper/adminapicall";
import { createDuty } from "./helper/dutiesHelper";

const CreateDuty = ({ history }) => {
  const [values, setValues] = useState({
    officer_id: 0,
    duty_type: "",
    duty_description: "",
    duty_date: "",
    start_duty_time: "",
    end_duty_time: "",
    duty_id: "",
    error: "",
    success: false,
    isRedirect: false,
    toAddMap: false,
  });

  const [officers, setOfficers] = useState([]);

  const {
    officer_id,
    duty_type,
    duty_description,
    duty_date,
    start_duty_time,
    end_duty_time,
    duty_id,
    error,
    success,
    isRedirect,
    toAddMap,
  } = values;

  const { user, token } = isAdminAuthenticated();

  const preload = () => {
    getUsers(user.gid, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setOfficers(data);
      }
    });
  };

  useEffect(() => {
    preload();
  });

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
    console.log(values);
    createDuty(user.gid, token, {
      officer_id,
      duty_type,
      duty_description,
      duty_date,
      start_duty_time,
      end_duty_time,
    }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          officer_id: 0,
          duty_type: "",
          duty_description: "",
          duty_date: "",
          start_duty_time: "",
          end_duty_time: "",
          duty_id: data.id,
          success: true,
          isRedirect: true,
        });
      }
    });
  };

  const onMapSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    console.log(values);
    createDuty(user.gid, token, {
      officer_id,
      duty_type,
      duty_description,
      duty_date,
      start_duty_time,
      end_duty_time,
    }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          officer_id: 0,
          duty_type: "",
          duty_description: "",
          duty_date: "",
          start_duty_time: "",
          end_duty_time: "",
          duty_id: data.id,
          success: true,
          toAddMap: true,
        });
      }
    });
  };

  const successMessage = () => (
    <div
      className="col-md-4 offset-sm-4 alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      <h4>Duty Submitted Succesfully without Location</h4>
    </div>
  );

  const toAdminDashboard = () => {
    setTimeout(() => {
      if (isRedirect) {
        history.push("/admin/dashboard");
      }
    }, 2000);
  };

  const toAddLocationPage = () => {
    if (toAddMap)
      return <Redirect to={`/admin/createduties/addlocation/${duty_id}`} />;
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

  const DutyForm = () => (
    <div>
      <div className="row">
        <div className="col-6">
          <div className="col-md-10 offset-sm-1">
            <h4 className="text-center">Duty Details</h4>
            <div className="form-group">
              <label className="text-black">Officer</label>
              <select
                className="form-control border-dark"
                onChange={handleChange("officer_id")}
              >
                <option>Select</option>
                {officers &&
                  officers.map((officer, index) => (
                    <option key={index} type="number" value={officer.id}>
                      {officer.name}, {officer.officer_rank}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label className="text-black">
                Duty Type (Example: Point, Beat, Investigation)
              </label>
              <input
                type="text"
                onChange={handleChange("duty_type")}
                className="form-control border-dark"
              />
            </div>
            <div className="form-group">
              <label className="text-black">Duty description</label>
              <input
                type="text"
                onChange={handleChange("duty_description")}
                className="form-control border-dark"
              />
            </div>
          </div>
        </div>
        <div className="col-6">
          <h4 className="text-center text-bold">Duty Timing</h4>
          <br />
          <h6 className="text-center">Date</h6>
          <div className="col-md-10 offset-sm-1 row">
            <div className="form-group col-6 text offset-3">
              <input
                type="date"
                onChange={handleChange("duty_date")}
                className="form-control border-dark"
              />
            </div>
          </div>
          <br />
          <h6 className="text-center">Time</h6>
          <div className="col-md-10 offset-sm-1 row">
            <div className="form-group col-6">
              <label className="text-black">From (Time)</label>
              <input
                type="time"
                onChange={handleChange("start_duty_time")}
                className="form-control border-dark"
              />
            </div>
            <div className="form-group col-6">
              <label className="text-black">Till (Time)</label>
              <input
                type="time"
                onChange={handleChange("end_duty_time")}
                className="form-control border-dark"
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-3 offset-4">
              <button className="btn btn-info px-3" onClick={onMapSubmit}>
                Submit and Add Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Base
      title="Create a Duty"
      description="Create a duty, assign it to a officer, add location"
    >
      {DutyForm()}
      {successMessage()}
      {errorMessage()}
      {toAddLocationPage()}
      {toAdminDashboard()}
    </Base>
  );
};

export default CreateDuty;
