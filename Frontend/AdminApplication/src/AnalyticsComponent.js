import React from "react";
import BarChart from "./charts/BarChart";
import DoughnutChart1 from "./charts/DoughnutChart1";
import DoughnutChart2 from "./charts/DoughnutChart2";
import AppBar from "./AppBar";
import AppDrawer from "./Drawer";
import BarChart2 from "./charts/BarChart2";
import { Grid } from "@material-ui/core";

function AnalyticsComponent() {
  return (
    <div>
      <AppBar />
      <AppDrawer />
      <Grid container style={{ display: "flex" }}>
        <Grid item xs={false} sm={2}></Grid>
        <Grid item xs={12} sm={8}>
          <BarChart />
          <br />
          <br />
          <BarChart2 />
          <br />
          <br />
          <Grid container style={{ display: "flex" }}>
            <DoughnutChart1 />
            <DoughnutChart2 />
          </Grid>
        </Grid>
        <Grid item xs={false} sm={2}></Grid>
      </Grid>
    </div>
  );
}

export default AnalyticsComponent;
