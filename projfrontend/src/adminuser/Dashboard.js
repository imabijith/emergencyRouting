import React, { useState, useEffect } from "react";
import Base from "../core/base";
import { Link } from "react-router-dom";
import {
  getLiveAccidents,
  markRead,
} from "../adminpages/helper/ambulancehelper";
import { isAdminAuthenticated } from "../auth/helper";
import {
  Map,
  TileLayer,
  GeoJSON,
  Popup,
  Marker,
  LayersControl,
} from "react-leaflet";
import { getAdmin } from "../adminpages/helper/adminapicall";
import { liveDutyLocation } from "../adminpages/helper/dutiesHelper";
import { warning } from "../adminpages/warningMarker";

const AdminDashboard = () => {
  const [values, setValues] = useState({
    error: "",
    success: false,
  });

  const [accidents, setAccidents] = useState([]);

  const [duties, setDuties] = useState([]);

  const [shape, setShape] = useState("");

  const [name, setName] = useState("");

  const { error, success, haveAccidents } = values;

  const { user, token } = isAdminAuthenticated();

  const getAccidents = () => {
    getLiveAccidents(user.gid, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setAccidents(data);
        getLiveDutyLocations();
        mapData();
      }
    });
  };

  const getLiveDutyLocations = () => {
    liveDutyLocation(user.gid, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setDuties(data);
      }
    });
  };

  const mapData = () => {
    getAdmin(user.gid, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: true });
      } else {
        setShape(data);
        setName(data.properties.name);
        setValues({ ...values, success: true });
      }
    });
  };

  useEffect(() => {
    getAccidents();
  }, []);

  const onMarkRead = (accidentId) => {
    markRead(user.gid, accidentId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      }
    });
  };

  const adminLeftSide = () => (
    <div className="card">
      <h4 className="card-header text-center text-lg py-4">Traffic Station</h4>
      <ul className="list-group">
        <li className="list-group-item ">
          <Link className="nav-link" to="/admin/registration">
            Register Officers
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/manageusers">
            Manage Officers
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/createduties">
            Add a Duty
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/manageduties">
            Manage Duties
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/analysis">
            Reported Accident Analysis
          </Link>
        </li>
      </ul>
    </div>
  );

  const liveAccidentNotification = () => (
    <div className="card bg-dark text-white py-2">
      <h4 className="card-header text-center text-lg py-4">
        Live Accident Notification
      </h4>
      <div>
        {!accidents.length == 0 &&
          accidents.map((accident, index) => (
            <div key={index}>
              <hr className="bg-white col-9 offset-1" />
              <p className="px-4 ">{`An Accident has been reported at ${accident.reported_time.slice(
                0,
                10
              )} at ${accident.reported_time.slice(11, 16)}hrs. Accident Id-${
                accident.id
              }`}</p>
              <button
                className="btn btn-info btn-sm inline col-4 offset-4 rounded"
                onClick={() => {
                  onMarkRead(accident.id);
                }}
              >
                Mark Read
              </button>
            </div>
          ))}
        {accidents.length == 0 && (
          <div>
            <hr className="bg-white col-9 offset-1" />
            <p className="px-4 ">No Accidents at the moment</p>
          </div>
        )}
      </div>
    </div>
  );

  const adminRightSide = () => (
    <div className="card">
      <h4 className="card-header text-center">{`Live Duties and Accident Map for ${name}`}</h4>
      <Map
        center={[
          shape.geometry.coordinates[0][0][0][1],
          shape.geometry.coordinates[0][0][0][0],
        ]}
        zoom={13}
      >
        <LayersControl>
          <LayersControl.BaseLayer name="Traffic" checked>
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OSM" unchecked>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <GeoJSON data={shape}>
          <Popup>{name}</Popup>
        </GeoJSON>
        {!accidents.length == 0 &&
          accidents.map((accident, index) => (
            <Marker
              key={index}
              position={[
                JSON.parse(accident.accident_location).coordinates[1],
                JSON.parse(accident.accident_location).coordinates[0],
              ]}
              icon={warning}
            >
              <Popup>{`Accident Id: ${accident.id}`}</Popup>
            </Marker>
          ))}
        {!duties.length == 0 &&
          duties.map((duty, index) => (
            <GeoJSON key={index} data={JSON.parse(duty.st_asgeojson)}></GeoJSON>
          ))}
        
      </Map>
    </div>
  );

  return (
    <Base
      title="Admin Dashboard"
      description="Welcome to Admin Dashboard"
      className="container-fluid "
    >
      <div className="row">
        <div className="col-3 border-white">
          {adminLeftSide()}
          <br />
          {liveAccidentNotification()}
          <br />
        </div>
        <div className="col-9">{success && adminRightSide()}</div>
      </div>
    </Base>
  );
};

export default AdminDashboard;
