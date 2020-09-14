import React, { useState, useEffect } from "react";
import Base from "../core/base";
import { Map, TileLayer, Marker, GeoJSON, Popup } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { getAdmin } from "./helper/adminapicall";
import { isAdminAuthenticated } from "../auth/helper";
import { getAccidentsMY } from "./helper/ambulancehelper";

const AnalysisMY = ({ match }) => {
  const [accidents, setAccidents] = useState([]);

  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [shape, setShape] = useState("");

  const [name, setName] = useState("");

  const { user, token } = isAdminAuthenticated();

  const preload = () => {
    getAccidentsMY(user.gid, token, {
      month: match.params.month,
      year: match.params.year,
    }).then((data) => {
      if (data.error || !data) {
        setError(true);
      } else {
        setAccidents(data);
        setSuccess(true);
      }
    });
  };

  const mapData = (adminId, token) => {
    getAdmin(adminId, token).then((data) => {
      if (data.error) {
        setError(true);
      } else {
        setShape(data);
        setName(data.properties.name);
      }
      preload();
    });
  };

  useEffect(() => {
    mapData(user.gid, token);
  }, []);

  const BoundaryMapView = () => (
    <Map
      center={[
        shape.geometry.coordinates[0][0][0][1],
        shape.geometry.coordinates[0][0][0][0],
      ]}
      zoom={14}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={shape}>
        <Popup>{name}</Popup>
      </GeoJSON>
      <HeatmapLayer
        points={accidents}
        longitudeExtractor={(m) => m[0]}
        latitudeExtractor={(m) => m[1]}
        intensityExtractor={10}
      />
    </Map>
  );

  return (
    <Base
      title="Analyse Accidents in your Station"
      description="This Heat Map is a representation of All Time Accidents in your Region(From Initialization of this Application)"
    >
      {success && BoundaryMapView()}
      {success && console.log(accidents)}
    </Base>
  );
};

export default AnalysisMY;
