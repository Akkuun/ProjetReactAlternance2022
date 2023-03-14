import React from "react"
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import Map from 'react-map-gl';

const pageUserData = () => {

    mapboxgl.accessToken="pk.eyJ1IjoibWF0aGlzd2F0dHMiLCJhIjoiY2xmODR4dm1rMGFyZjN1bzJ0bmFoYnp2byJ9.f3r7lYmiVTLbQJoBf2oNww"
    return (

        <Map
            initialViewState={{
                longitude: -122.4,
                latitude: 37.8,
                zoom: 14
            }}
            style={{width: 600, height: 400}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          center={[-74.5, 40]} zoom={14}/>
    );
};

export default pageUserData;