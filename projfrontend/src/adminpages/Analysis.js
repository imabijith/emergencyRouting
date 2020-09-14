import React, { useState, useEffect } from "react";
import Base from "../core/base";
import { Map, TileLayer, GeoJSON, Popup, LayersControl } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { getAdmin } from "./helper/adminapicall";
import { isAdminAuthenticated } from "../auth/helper";
import { getAccidents } from "./helper/ambulancehelper";

const Analysis = () => {
  const [accidents, setAccidents] = useState([]);

  const preload = () => {
    getAccidents(user.gid, token).then((data) => {
      if (data.error) {
        setError(true);
      } else {
        setAccidents(data);
        setSuccess(true);
      }
    });
  };
  const [error, setError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [shape, setShape] = useState("");

  const [name, setName] = useState("");

  const { user, token } = isAdminAuthenticated();

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
      <LayersControl>
        <LayersControl.BaseLayer name="OpenStreetMap" checked>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Accident" checked>
          <HeatmapLayer
            points={accidents}
            longitudeExtractor={(m) => m[0]}
            latitudeExtractor={(m) => m[1]}
            intensityExtractor={(m) => 10}
          />
        </LayersControl.Overlay>
      </LayersControl>
      <GeoJSON data={shape}>
        <Popup>{name}</Popup>
      </GeoJSON>
    </Map>
  );

  return (
    <Base
      title="Analyse Accidents in your Station"
      description="This Heat Map is a representation of All Time Accidents in your Region(From Initialization of this Application)"
    >
      {success && BoundaryMapView()}
    </Base>
  );
};

export default Analysis;
