import L from "leaflet";

const warning = new L.Icon({
  iconUrl: require("./warning.png"),
  iconAnchor: null,
  popupAnchor: [0, 0],
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: (30, 30),
});

export { warning };
