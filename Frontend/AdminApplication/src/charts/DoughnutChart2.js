import { Grid } from '@material-ui/core'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'

function DoughnutChart2() {

    const [ chartData, setChartData ] = useState({})
    var backgroundColor = []
    var rgb = []

    const randomColorGenerate = (responseLength) => {
        for(var i = 0; i < responseLength; i++){
            for(var j = 0; j < 3; j++){
                rgb.push(Math.floor(Math.random() * 255))
            }
            backgroundColor.push('rgb('+rgb.join(',')+')')
            rgb = []
        }
        
    }

    const chart = () => {

        let insurances = []
        let soldInsurances = []

        axios.get("http://localhost:9090/api/category/request/count").then((response) => {

            randomColorGenerate(response.data.length)

            for(let dataObj of response.data){
                insurances.push(dataObj.category)
                soldInsurances.push(dataObj.count)
            }
            setChartData({
                labels: insurances,
                datasets: [
                    {
                      label: 'Insurances Bought',
                      data: soldInsurances,
                      backgroundColor: backgroundColor
                    }
                  ]
            })
        })
    }

    const options = {
        title: {
          display: true,
          text: 'Viewed Insurances'
        }
      }

    useEffect(() => {
        chart()
    }, [])

    return (
        
        <Grid item xs={12} sm={6}>
            <Doughnut data={chartData} options={options}/>
        </Grid>

    )
}

export default DoughnutChart2