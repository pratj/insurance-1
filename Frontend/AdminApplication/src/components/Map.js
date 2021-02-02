import GoogleMapReact from "google-map-react";
import React, { useRef } from "react";
import useSwr from "swr";
import "./Map.css";
import RoomIcon from "@material-ui/icons/Room";
import { Tooltip } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "../AppBar";

const fetcher = (...args) => fetch(...args).then((response) => response.json());
const Marker = ({ children }) => children;
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "gray",
    color: "yellow",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

function Map() {
  const url = "http://localhost:9090/api/map/location";
  const { data, error } = useSwr(url, { fetcher });
  const insurances = data && !error ? data.slice(0, 200) : [];

  return (
    <div style={{ height: "91.7vh", width: "100%" }}>
      <AppBar />
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
        defaultCenter={{ lat: 20.59, lng: 78.96 }}
        //defaultCenter={{ lat: 52.6376, lng: -1.135171 }}
        defaultZoom={5}
      >
        {insurances.map((insurance) => (
          <Marker
            key={insurance.ViewTime}
            lat={
              insurance.userLocation.coordinates.lat +
              ((Math.random() > 0.5 ? 0.001 : -0.009) + Math.random() * 0.008)
            }
            lng={
              insurance.userLocation.coordinates.lng +
              ((Math.random() > 0.5 ? 0.001 : -0.009) + Math.random() * 0.008)
            }
          >
            {console.log(
              insurance.userLocation.coordinates.lng +
                ((Math.random() > 0.5 ? 0.001 : -0.009) + Math.random() * 0.008)
            )}
            {console.log(
              insurance.userLocation.coordinates.lat +
                ((Math.random() > 0.5 ? 0.001 : -0.009) + Math.random() * 0.008)
            )}
            <HtmlTooltip
              title={
                <React.Fragment>
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                      display: "inline",
                      marginTop: "10px",
                    }}
                    src="favicon.ico"
                  />
                  <Typography style={{ display: "inline" }} color="inherit">
                    {"       "}
                    {insurance.category}
                  </Typography>
                  <em>Data</em>
                  <p>Product Chosen: {insurance.product}</p>
                  <p>Time viwed: {insurance.ViewTime}</p>
                  <p>User Bought: {insurance.userBought.toString()}</p>
                  {insurance.userBought === true ? (
                    <p>Partner Bought: {insurance.partner}</p>
                  ) : (
                    <p></p>
                  )}
                </React.Fragment>
              }
            >
              {insurance.userBought === true ? (
                <RoomIcon style={{ color: "yellow" }} />
              ) : (
                <RoomIcon style={{ color: "red" }} />
              )}
            </HtmlTooltip>
          </Marker>
        ))}
      </GoogleMapReact>
    </div>
  );
}

export default Map;
