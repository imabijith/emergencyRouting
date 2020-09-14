import L from 'leaflet';

const iconPerson = new L.Icon({
    iconUrl: require('./med.png'),
    iconAnchor: null,
    popupAnchor: [0,0],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: (30, 30),
});

export { iconPerson };