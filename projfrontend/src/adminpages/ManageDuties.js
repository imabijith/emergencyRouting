import React, { useEffect, useState } from "react";
import { Map, TileLayer, Marker, GeoJSON, Popup } from "react-leaflet";
import Base from "../core/base";
import { Link } from "react-router-dom";
import { getDuties, deleteDuty } from "./helper/dutiesHelper";
import { isAdminAuthenticated } from "../auth/helper";

const ManageDuties = () => {
  const [duties, setDuties] = useState([]);

  const [values, setValues] = useState({
    error: "",
    dutiesLoaded: false,
  });

  const { error, dutiesLoaded } = values;

  const { user, token } = isAdminAuthenticated();

  const getAllStationDuties = () => {
    getDuties(user.gid, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setDuties(data);
        setValues({ ...values, dutiesLoaded: true });
      }
    });
  };

  useEffect(() => {
    getAllStationDuties();
  }, [duties]);

  const deleteOnClick = (dutyId) => {
    deleteDuty(user.gid, dutyId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      }
    });
  };

  const mapElement = (duty) => {
    return (
      <Map
        id="cardmap"
        center={[
          JSON.parse(duty.duty_location).coordinates[1],
          JSON.parse(duty.duty_location).coordinates[0],
        ]}
        zoom={15}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[
            JSON.parse(duty.duty_location).coordinates[1],
            JSON.parse(duty.duty_location).coordinates[0],
          ]}
        >
          <Popup>Duty Location</Popup>
        </Marker>
      </Map>
    );
  };

  const DutyCard = () => (
    <div className="container-fluid row">
      
      {duties &&
        duties.map((duty, index) => {
          return (
            <div
              className="col-3 text-center my-4 border rounded border-dark py-4 mx-5"
              key={index}
            >
              {duty.duty_location && mapElement(duty)}
              {!duty.duty_location && (
                <div>
                  <img
                    id="cardmap"
                    src={
                      "https://images.pexels.com/photos/532001/pexels-photo-532001.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    }
                  />
                </div>
              )}
              <br />
              <h4>
                {duty.name}, {duty.officer_rank}
              </h4>
              <h6>Duty Type: {duty.duty_type}</h6>
              <p>
                <strong>Duty Date: </strong>
                {duty.duty_date}
              </p>
              <p>
                <strong>Duty Timing:</strong>
                {duty.start_duty_time} to {duty.end_duty_time}
              </p>
              <p
                className="bg-warning rounded"
                style={{
                  display: !duty.is_live && !duty.is_done ? "" : "none",
                }}
              >
                Duty Status: Alloted
              </p>
              <p
                className="bg-success rounded"
                style={{
                  display: duty.is_live && !duty.is_done ? "" : "none",
                }}
              >
                Duty Status: Live
              </p>
              <p
                className="bg-danger rounded"
                style={{
                  display: !duty.is_live && duty.is_done ? "" : "none",
                }}
              >
                Duty Status: Ended
              </p>
              <Link
                to={`/admin/createduties/updatelocation/${duty.id}`}
                style={{ display: duty.duty_location ? "" : "none" }}
                className="btn rounded btn-sm btn-info"
              >
                Update Location
              </Link>
              <Link
                to={`/admin/createduties/addlocation/${duty.id}`}
                style={{ display: !duty.duty_location ? "" : "none" }}
                className="btn rounded btn-sm btn-info"
              >
                Add Location
              </Link>
              <Link
                to={`/admin/createduties/updateduty/${duty.id}`}
                className="btn rounded btn-sm btn-dark mx-2 px-3"
              >
                Update Duty
              </Link>
              <br />
              <button
                onClick={() => {
                  deleteOnClick(duty.id);
                }}
                className="btn rounded btn-sm btn-danger px-3 my-2"
              >
                Delete
              </button>
            </div>
          );
        })}
    </div>
  );

  return (
    <Base
      title="Manage Existing Duties"
      description="Update and Delete Existing Duties in your station"
    >
      {dutiesLoaded && DutyCard()}
    </Base>
  );
};

export default ManageDuties;
