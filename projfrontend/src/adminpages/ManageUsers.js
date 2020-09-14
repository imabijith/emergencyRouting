import React, { useState, useEffect } from "react";
import Base from "../core/base";
import { Link } from "react-router-dom";
import { getUsers, deleteUser } from "./helper/adminapicall";
import { isAdminAuthenticated } from "../auth/helper";

const ManageUsers = () => {
  const [officers, setOfficers] = useState([]);

  const [error, setError] = useState("");

  const { user, token } = isAdminAuthenticated();

  const preload = () => {
    getUsers(user.gid, token).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setOfficers(data);
      }
    });
  };

  useEffect(() => {
    preload();
  }, [officers]);

  const onSubmit = (userId) => {
    deleteUser(user.gid, userId, token)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  return (
    <Base
      title="Manage Traffic Official Accounts"
      description="Manage traffic officials accounts of your station"
    >
      <h2 className="text-center">
        {officers.length} Officers are Registered from this Station
      </h2>
      <br />
      {officers &&
        officers.map((officer, index) => (
          <div>
            <div
              className="card border border-dark col-md-6 offset-3"
              key={index}
            >
              <div className="card-body text-center">
                <span className="card-title h5 text-center">{`${officer.name}, ${officer.officer_rank}`}</span>
                <p className="card-text">{`Phone: ${officer.phone}, Shift: ${officer.shift}`}</p>
                <Link
                  to={`/admin/update/user/${officer.id}`}
                  class="btn btn-info"
                >
                  Update Account
                </Link>
                <Link
                  class="btn btn-dark mx-2"
                  to={`/admin/changepassword/user/${officer.id}`}
                >
                  Change Password
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onSubmit(officer.id);
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
            <br />
          </div>
        ))}
    </Base>
  );
};

export default ManageUsers;
