//import mapbox from 'mapbox-gl';

const mapbox = mapboxgl
// https://docs.mapbox.com/help/glossary/access-token/
mapbox.accessToken = import.meta.env.VITE_MAPBOX;

const key = {};

export { mapbox, key };