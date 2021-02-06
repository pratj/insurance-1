import { Grid } from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";

function DoughnutChart1() {
  const [chartData, setChartData] = useState({});
  var backgroundColor = [];
  var rgb = [];

  const randomColorGenerate = (responseLength) => {
    for (var i = 0; i < responseLength; i++) {
      for (var j = 0; j < 3; j++) {
        rgb.push(Math.floor(Math.random() * 255));
      }
      backgroundColor.push("rgb(" + rgb.join(",") + ")");
      rgb = [];
    }
  };
  
    const chart = () => {

        let partners = []
        let partnersCount = []

        axios.get("http://ibazzar.com/backend/api/partner/category/count").then((response) => {
        randomColorGenerate(response.data.length);

        for (let dataObj of response.data) {
          partners.push(dataObj.partner);
          partnersCount.push(dataObj.count);
        }
        setChartData({
          labels: partners,
          datasets: [
            {
              label: "Partners",
              data: partnersCount,
              backgroundColor: backgroundColor,
            },
          ],
        });
      });
  };

  const options = {
    title: {
      display: true,
      text: "Partners",
    },
  };

  useEffect(() => {
    chart();
  }, []);

  return (
    <Grid item xs={12} sm={6}>
      <Doughnut data={chartData} options={options} />
    </Grid>
  );
}

export default DoughnutChart1;
