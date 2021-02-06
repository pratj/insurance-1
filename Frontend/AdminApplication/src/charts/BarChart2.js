import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Grid } from "@material-ui/core";

function BarChart2() {
  var chartData;
  var rgb = [];
  var borderColor = [];
  var backgroundColor = [];
  var maxTick = 6;
  const [data, setData] = useState([]);

  const randomColorGenerate = (responseLength) => {
    for (let i = 0; i < 3; i++) {
      rgb.push(Math.floor(Math.random() * 255));
    }
    for (let i = 0; i < responseLength; i++) {
      borderColor.push("rgb(" + rgb.join(",") + ")");
      backgroundColor.push("rgb(" + rgb.join(",") + ")");
    }
    rgb = [];
  };

  const barChart = (index) => {
    return (
      <Grid item xs={12} sm={4} key={index}>
        <Bar data={chartData} options={options} />
      </Grid>
    );
  };

  const chart = (data, index) => {
    let partners = [];
    let boughtCount = [];

    randomColorGenerate(data.partners.length);

    for (let dataObj of data.partners) {
      //console.log(dataObj)
      partners.push(dataObj.partner);
      boughtCount.push(dataObj.count);
    }
    chartData = {
      labels: partners,
      datasets: [
        {
          label: data.category,
          data: boughtCount,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        },
      ],
    };

    maxTick = Math.max(...boughtCount) + 3;

    borderColor = [];
    backgroundColor = [];
    return barChart(index);
  };

  var options = {
    title: {
      display: true,
      text: "Partners bought in each category",
    },
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max: maxTick,
            stepSize: 1,
          },
        },
      ],
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/category/partner/payment/count")
      .then((response) => {
        setData(response.data);
      });
  }, []);

  return (
    <Grid container style={{ display: "flex" }}>
      {/* {typeof data !== undefined && data.map((data, index) => chart(data, index))} */}
      {data.length !== 0 ? (
        data.map((data, index) => chart(data, index))
      ) : (
        <span>No purchases made yet</span>
      )}
      {/* {dummyData.map((data, index) => chart(data, index))} */}
    </Grid>
  );
}

export default BarChart2;
