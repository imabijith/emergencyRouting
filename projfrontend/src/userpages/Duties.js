import React, { useState, useEffect } from "react";
import MobileBase from "../core/mobilebase";
import { Link, Redirect } from "react-router-dom";
import { getDutiesForOfficer } from "./helper/dutyhelper";
import { isUserAuthenticated } from "../auth/helper/userindex";
import { joinDuty } from "../auth/helper/duties";
import { getLiveDuty } from "../user/helper/userapicalls";

const Duties = () => {
  const [duties, setDuties] = useState([]);

  const [error, setError] = useState("");

  const [liveDuty, setLiveDuty] = useState("");

  const [noLive, setNoLive] = useState(false);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [isRedirect, setisRedirect] = useState(false);

  const { user, token } = isUserAuthenticated();

  const preload = () => {
    getDutiesForOfficer(user.id, token).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setDuties(data);
        setSuccess(true);
      }
    });
  };

  const loadLiveDuty = () => {
    getLiveDuty(user.id, token).then((data) => {
      if (data) {
        if (data.error) {
          setError(data.error);
        } else {
          setLiveDuty(data);
        }
      } else {
        setNoLive(true);
      }
    });
  };

  useEffect(() => {
    loadLiveDuty();
    preload();
  }, [duties, noLive]);

  const onSubmit = (dutyId) => {
    setError(false);
    setLoading(true);
    joinDuty(user.id, dutyId, token)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setisRedirect(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const DutyCard = () => (
    <div>
      {duties &&
        duties.map((duty, index) => (
          <div
            className="col-10 offset-1 text-center text-white bg-dark py-2 my-2 rounded"
            key={index}
          >
            <h5>{`${duty.duty_type} Duty`}</h5>
            <hr className="bg-white" />
            <h6>{`Date: ${duty.duty_date.slice(0, 10)}`}</h6>
            <p>{`Time: From ${duty.start_duty_time} Till ${duty.end_duty_time}`}</p>
            <p>{duty.duty_description}</p>
            {noLive && (
              <button
                className="btn btn-success rounded mx-4"
                onClick={() => {
                  onSubmit(duty.id);
                }}
              >
                Join Duty
              </button>
            )}
            <Link
              to={`/user/duty/${duty.id}/location`}
              className="btn rounded btn-info"
            >
              View Location
            </Link>
          </div>
        ))}
    </div>
  );

  const noDuties = () => {
    return (
      <div
        className="col-10 offset-1 text-center text-white bg-dark py-2 rounded"
        style={{ display: duties.length == 0 ? "" : "none" }}
      >
        <h6>You Don't Have Any Duties</h6>
      </div>
    );
  };

  return (
    <MobileBase className="">
      {success && DutyCard()}
      {noDuties()}
      {isRedirect && <Redirect to="/user/dashboard" />}
    </MobileBase>
  );
};

export default Duties;
