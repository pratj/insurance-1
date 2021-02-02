import { Grid } from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import loader from "../video/video.mp4";

function BarChart() {
  const [chartData, setChartData] = useState({});
  var borderColor = [];
  var backgroundColor = [];

  var rgb = [];
  const fillColor = (responseLength) => {
    for (let i = 0; i < 3; i++) {
      rgb.push(Math.floor(Math.random() * 255));
    }
    for (let i = 0; i < responseLength; i++) {
      borderColor.push("rgb(" + rgb.join(",") + ")");
      backgroundColor.push("rgb(" + rgb.join(",") + ")");
    }
    rgb = [];
  };

  const chart = () => {
    let categories = [];
    let partnerCount = [];

    axios
      .get("http://localhost:9090/api/category/partner/count")
      .then((response) => {
        fillColor(response.data.length);

        for (let dataObj of response.data) {
          categories.push(dataObj.category);
          partnerCount.push(dataObj.partnerCount);
        }
        setChartData({
          labels: categories,
          datasets: [
            {
              label: "Partners in each category",
              data: partnerCount,
              borderColor: borderColor,
              backgroundColor: backgroundColor,
            },
          ],
        });
      });
  };

  const options = {
    title: {
      display: true,
      text: "Bar Chart",
    },
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 6,
            stepSize: 1,
          },
        },
      ],
    },
  };

  useEffect(() => {
    chart();
  }, []);

  return (
    <div>
      {" "}
      {console.log(chartData.labels)}
      {chartData.labels !== undefined ? (
        <Bar data={chartData} options={options} />
      ) : (
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
              color: "white",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            No Data Available yet
          </h1>{" "}
        </>
      )}
    </div>
  );
}

export default BarChart;
