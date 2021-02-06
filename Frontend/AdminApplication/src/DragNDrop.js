import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactJson from "react-json-view";

import * as s from "./DragNDrop.styles";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));
const useStylesAccordion = makeStyles((theme) => ({
  root: {
    width: "100%",
    //display: 'flex',
    //justifyContent:'center',
    //alignItems:'center'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

toast.configure();

function DragNDrop() {
  const classes = useStyles();
  const classesAccordion = useStylesAccordion();

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { getRootProps, getInputProps } = useDropzone();
  const [config, setConfig] = useState();
  const [highlighted, setHighlighted] = useState(false);

  ondragenter = (e) => {
    setHighlighted(true);
    console.log("DRAG ENTER");
  };
  ondragleave = (e) => {
    setHighlighted(false);
    console.log("DRAG LEAVE");
  };

  ondragover = (e) => {
    e.preventDefault();
    setHighlighted(true);
  };

  ondrop = (e) => {
    e.preventDefault();
    //console.log(e.dataTransfer.files)
    setHighlighted(false);
    Array.from(e.dataTransfer.files)
      .filter(
        (file) =>
          file.type === "application/json" &&
          file.name === "insurance_config.json"
      )
      .forEach(async (file) => {
        const text = await file.text();
        console.log(text);
        setConfig(text);
      });
  };
  const clearConfigData = () => {
    setConfig(undefined);
  };
  const sendConfigData = () => {
    typeof config !== "undefined" &&
      axios
        .post("http://localhost:9090/api/configs", JSON.parse(config))
        .then((response) => {
          console.log("Config Data Sent");
          console.log(response);
          toast.success("Config Data Sent");
        })
        .catch((error) => {
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            toast.error(
              "The request was made and the server responded with a status code that falls out of the range of 2xx"
            );
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.log(error.request);
            toast.error("The request was made but no response was received");
          } else {
            // Something happened in setting up the request and triggered an Error
            console.log("Error", error.message);
            toast.error("Error in setting up the request");
          }
          console.log(error.config);
        });
  };

  useEffect(() => {
    typeof config !== "undefined" || ("" && toast("Changes in File Detected"));
  }, [config]);

  return (
    <s.DragDrop style={{ marginTop: "90px" }}>
      <small style={{ color: "gray" }}>
        *Note: File name should be 'insurance_config.json'
      </small>
      <s.DragContainer
        {...getRootProps({ className: "dropzone" })}
        highlighted={highlighted}
      >
        <input {...getInputProps()} />
        <p style={{ marginTop: "90px" }}>
          Drag 'n' drop some files here, or click to select files
        </p>
      </s.DragContainer>

      {/* <div style={{width:"80%", display: 'flex',  justifyContent:'center', alignItems:'center'}}> */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
        className={classesAccordion.root}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classesAccordion.heading}>
            Data Preview
          </Typography>
          <Typography className={classesAccordion.secondaryHeading}>
            {" "}
            JSON Config file
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {typeof config !== "undefined" ? (
              <ReactJson src={JSON.parse(config)} />
            ) : (
              <pre>No file added yet</pre>
            )}
          </Typography>
        </AccordionDetails>
      </Accordion>
      {/* </div> */}

      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={sendConfigData}
        endIcon={<SendRoundedIcon />}
        style={{ marginTop: "200px" }}
      >
        Send Config Data
      </Button>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={clearConfigData}
        endIcon={<HighlightOffRoundedIcon />}
        style={{ marginTop: "200px" }}
      >
        Clear
      </Button>
    </s.DragDrop>
  );
}

export default DragNDrop;
