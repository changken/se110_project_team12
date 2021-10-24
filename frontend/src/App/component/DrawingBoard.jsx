import React, { useEffect, useState } from 'react'
import { Line } from "react-chartjs-2"

export default function DrawingBoard(props) {
  
    const [data, setData] = useState({})
    
    let i = -1
    let _backgroundColor = ""
    
    const getColor = () => {
      // let colorChips =["#85c446", "#bce7c5", "#fdbd10", "#0066b2", "#ed7902", "#0085ad", "#009f4d", "#335238" ,"#c68143" ,"#ec1c24"]
      let colorChips =["#84abd6", "#ff97ba", "#fdbd10", "#0066b2", "#ed7902", "#0085ad", "#009f4d", "#335238" ,"#c68143" ,"#ec1c24"]

      i++
      let boardColor = `${colorChips[i]}`
      _backgroundColor = boardColor
      return props.isIssue ? props.color : boardColor
    }
    
    const isFilled = () => {
      return props.isIssue || props.isCodeBase ? "origin" : false
    }


    // const getRandomColor = () => {
    //   return `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`
    // }

    useEffect(() => {
      if (props.data) {
        // let _backgroundColor = getColor()
        // if (props.color) {
        //   _backgroundColor = `${props.color}`
        //   // #bce7c5
        // }
        let datasets = Object.keys(props.data.data).map(key => {
          return {
            label: key,
            fill: isFilled(),
            borderColor: getColor(),
            backgroundColor: _backgroundColor,
            borderWidth: 2,
            pointRadius: 2,
            data: props.data.data[key],
            tension: 0
          }
        })
        
        setData({
          labels: props.data.labels,
          datasets: datasets
        })
      }
    }, [props.data])
  
    var options = {
      legend: {
        position: "top",
        display: true,
        labels: {
          boxWidth: 10
        },
      },
      scales: {
        xAxes: [
          {
            ticks: { display: true }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ]
      }
    }

    if(props.maxBoardY) {
      options.scales.yAxes[0].ticks.max = props.maxBoardY
    }
  
    return (
      <div className="App main" id={props.id}>
        <Line data={data} options={options} />
      </div>
    )
  }
  