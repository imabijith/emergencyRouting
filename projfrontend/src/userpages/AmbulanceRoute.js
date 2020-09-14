import React, { useState, useEffect } from "react";
import MobileBase from "../core/mobilebase";
import { isUserAuthenticated } from "../auth/helper/userindex";
import L, { Icon } from "leaflet";
import { getDutyUser, getNotification } from "./helper/dutyhelper";
import {
  Map, 
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  CircleMarker,
  LayersControl,
} from "react-leaflet";
import { iconPerson } from "./CustomMarker";

const AmbulanceRoute = ({ match }) => {
  const [values, setValues] = useState("");

  const [duty, setDuty] = useState([]);

  const [errors, setErrors] = useState({
    error: "",
    loading: false,
    done: false,
  });

  const { error, loading, done } = errors;

  const { user, token } = isUserAuthenticated();

  const preload = () => {
    getNotification(user.id, match.params.notificationId, token).then(
      (data) => {
        if (data.error) {
          setErrors({ ...errors, error: data.error });
        } else {
          setValues(data);
          getDutyLocation();
        }
      }
    );
  };

  const getDutyLocation = () => {
    getDutyUser(user.id, match.params.dutyId, token).then((data) => {
      if (data.error) {
        setErrors({ ...errors, error: data.error });
      } else {
        setDuty(JSON.parse(data.duty_location).coordinates);
        setErrors({ ...errors, loading: true });
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const maptitle = () => (
    <div
      className="container-fluid rounded py-2 text-center"
      style={{
        background: "#2193b0",
        background: "-webkit-linear-gradient(to right, #6dd5ed, #2193b0)",
        background: "linear-gradient(to right, #6dd5ed, #2193b0)",
      }}
    >
      <h6 style={{ display: values.route_type === "to_site" ? "" : "none" }}>
        Ambulance navigating to Incident Site
      </h6>
      <h6
        style={{ display: values.route_type === "to_hospital" ? "" : "none" }}
      >
        Ambulance navigating to Hospital
      </h6>
    </div>
  );

  const BaseMap = () => {
    return (
      <div>
        <Map id={"mapid"} center={[duty[1], duty[0]]} zoom={17}>
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

          <Marker position={[duty[1], duty[0]]}>
            <Popup>Your Duty Location</Popup>
          </Marker>
          <GeoJSON
            data={JSON.parse(values.ambulance_route)}
            style={(feature) => {
              return { weight: 5, opacity: 1, color: "#000000" };
            }}
          ></GeoJSON>
          <CircleMarker
            radius={15}
            center={[
              JSON.parse(values.start_location).coordinates[1],
              JSON.parse(values.start_location).coordinates[0],
            ]}
          >
            <Popup>Starting Location</Popup>
          </CircleMarker>
          <CircleMarker
            radius={15}
            center={[
              JSON.parse(values.end_location).coordinates[1],
              JSON.parse(values.end_location).coordinates[0],
            ]}
          >
            <Popup>End Location</Popup>
          </CircleMarker>
          {values.current_location !== null && (
            <Marker
              position={[
                JSON.parse(values.current_location).coordinates[1],
                JSON.parse(values.current_location).coordinates[0],
              ]}
              icon={iconPerson}
            >
              <Popup>Ambulance Location</Popup>
            </Marker>
          )}
        </Map>
      </div>
    );
  };

  return (
    <MobileBase className="">
      {loading && maptitle()}
      {loading && BaseMap()}
    </MobileBase>
  );
};

export default AmbulanceRoute;
