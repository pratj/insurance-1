import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";

import loader from "../video/video.mp4";
import Requests from "../Service/Requests";

function Suggestion() {
  return (
    <div>
      <>
        <video
          id="background-video"
          style={{
            position: "absolute",
            width: "100%",
            left: "50%",
            top: "50%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%,-50%)",
            zIndex: "-1",
          }}
          loop
          autoPlay
          muted
        >
          <source src={loader} type="video/mp4" />
          <source src={loader} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
        <h1
          style={{
            color: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        ></h1>{" "}
      </>

      <div
        className="bigcard"
        style={{
          //backgroundColor: 'transparent',
          boxShadow: "20px 20px 50px rgba(0,0,0,0.5)",
          borderRadius: "10px",
          padding: "20px",
          background: "rgba(0,0,0,0.3)",
          borderTop: "3px solid rgba(255,255,255,0.1)",
          borderLeft: "3px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(5px)",
        }}
        overlayStyle={{ backgroundColor: "transparent" }}
      >
        <h1 style={{ color: "white" }}>
          {" "}
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            Hello, checkout some of our most popular Insurances
          </span>
        </h1>
        {RenderCard()}
      </div>
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    position: "absolute",
    top: theme.spacing(5),
  },
  root: {
    flexGrow: 1,
  },
}));

function RenderCard() {
  const [cardConfig, setCardConfig] = useState();

  const [cardInfo, setCardInfo] = useState({
    category: "",
    product: "",
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = (card) => {
    console.log(card.category, card.product);
    setCardInfo({
      category: card.category,
      product: card.product,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    Requests.getCategoryRequestCount().then((response) => {
      response.data.sort(GetSortOrder("count"));
      const temp = response.data.slice(0, 3);
      console.log(temp);
      setCardConfig(temp);
    });
  }, []);

  const classes = useStyles();
  function GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return -1;
      } else if (a[prop] < b[prop]) {
        return 1;
      }
      return 0;
    };
  }
  const renderCard = (card, index) => {
    return (
      <Grid item xs={12} sm={4}>
        <Card
          className="card"
          key={index}
          style={{
            borderRadius: "15px",
            maxWidth: 345,
            margin: "auto",
            marginTop: 20,
          }}
        >
          <CardActionArea onClick={() => handleClickOpen(card)}>
            {/* <CardMedia component="img" image={card.image} height="140" title={card.category}/> */}
            <CardContent className="content">
              <Typography gutterBottom variant="h5" component="h2">
                <b style={{ color: "black" }}>{card.category}</b>
              </Typography>
              <Typography gutterBottom variant="h6" component="h4">
                {card.product}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  return (
    <div className={`cardRender ${classes.root1}`} data-test="suggestion">
      <Grid container spacing={3}>
        {typeof cardConfig !== "undefined" && cardConfig.map(renderCard)}
      </Grid>
    </div>
  );
}
export default Suggestion;
