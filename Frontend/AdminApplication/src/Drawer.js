import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { Link, useHistory } from "react-router-dom";
import DonutSmallIcon from "@material-ui/icons/DonutSmall";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import MultilineChartIcon from "@material-ui/icons/MultilineChart";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import "./Drawer.css";
import routeConstants from "./shared/constants/routes";

const {
  ANALYTICS,
  BARCHART1,
  BARCHART2,
  DOUGHNUTCHART1,
  DOUGHNUTCHART2,
} = routeConstants;

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function AppDrawer() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleAnalytics = () => {
    history.push(ANALYTICS.route);
  };
  const handleBarChart = () => {
    history.push(BARCHART1.route);
  };
  const handleBarChart2 = () => {
    history.push(BARCHART2.route);
  };
  const handleDoughnutChart1 = () => {
    history.push(DOUGHNUTCHART1.route);
  };
  const handleDoughnutChart2 = () => {
    history.push(DOUGHNUTCHART2.route);
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <ListItem button key="Analytics">
        <ListItemIcon>
          {" "}
          <MultilineChartIcon />
        </ListItemIcon>
        <ListItemText primary="View All the Stats" onClick={handleAnalytics} />
      </ListItem>

      <Divider />
      <ListItem button key="BarChart">
        <ListItemIcon>
          {" "}
          <InsertChartIcon />
        </ListItemIcon>
        <ListItemText
          primary="Partners in each Category"
          onClick={handleBarChart}
        />
      </ListItem>

      <Divider />
      <ListItem button key="BarChart2">
        <ListItemIcon>
          {" "}
          <InsertChartIcon />
        </ListItemIcon>
        <ListItemText
          primary="Partners bought in each Category"
          onClick={handleBarChart2}
        />
      </ListItem>

      <Divider />
      <ListItem button key="DoughnutChart1">
        <ListItemIcon>
          {" "}
          <DonutSmallIcon />
        </ListItemIcon>
        <ListItemText
          primary="Data on Partners"
          onClick={handleDoughnutChart1}
        />
      </ListItem>

      <Divider />
      <ListItem button key="DoughnutChart2">
        <ListItemIcon>
          {" "}
          <DonutSmallIcon />
        </ListItemIcon>
        <ListItemText
          primary="Viewed Insurances"
          onClick={handleDoughnutChart2}
        />
      </ListItem>

      <Divider />
    </div>
  );

  return (
    <div>
      {["bottom"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            className="drawerbutton"
            style={{
              background: "white",
              color: "gray",
              boxShadow: "2px 2px 5px",
              padding: "10px",
              borderRadius: "5px",
            }}
            onClick={toggleDrawer(anchor, true)}
          >
            <MenuOpenIcon />
            Open Menu
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
