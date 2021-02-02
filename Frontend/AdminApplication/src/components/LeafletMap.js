import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React from 'react'
import useSwr from 'swr'
//const position = [51.505, -0.09]
const fetcher = (...args) => fetch(...args).then(response => response.json());

function LeafletMap() {
//     const url =
//     "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10";
//   const { data, error } = useSwr(url, { fetcher });
//   const crimes = data && !error ? data.slice(0,200) : [];
  const crimes=[
    {
      "category": "anti-social-behaviour",
      "location_type": "Force",
      "location": {
        "latitude": "52.628613",
        "street": {
          "id": 883221,
          "name": "On or near Highfield Street"
        },
        "longitude": "-1.118388"
      },
      "context": "",
      "outcome_status": null,
      "persistent_id": "",
      "id": 78209889,
      "location_subtype": "",
      "month": "2019-10"
    },
    {
      "category": "anti-social-behaviour",
      "location_type": "Force",
      "location": {
        "latitude": "52.634693",
        "street": {
          "id": 883424,
          "name": "On or near St Nicholas Circle"
        },
        "longitude": "-1.140799"
      },
      "context": "",
      "outcome_status": null,
      "persistent_id": "",
      "id": 78215173,
      "location_subtype": "",
      "month": "2019-10"
    },
    {
      "category": "anti-social-behaviour",
      "location_type": "Force",
      "location": {
        "latitude": "52.631392",
        "street": {
          "id": 883371,
          "name": "On or near East Street"
        },
        "longitude": "-1.127064"
      },
      "context": "",
      "outcome_status": null,
      "persistent_id": "",
      "id": 78210437,
      "location_subtype": "",
      "month": "2019-10"
    }]
  
    return (
        <MapContainer center={[52.6376,-1.135171]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    {crimes.map(crime=>(
    
    <Marker position={[52.6376,-1.135171]}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
    ))
    }
  </MapContainer>
    )
}

export default LeafletMap
