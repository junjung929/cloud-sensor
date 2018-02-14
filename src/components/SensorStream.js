import React from "react";
import ReactHighstrock from "react-highcharts/ReactHighstock";
import LoadingIndicator from "react-loading-indicator";
import styled from "styled-components";

const Graph = styled.div`
  min-height: 400px;
`;
const SensorStream = ({ data, title }) => {
  if (!data) {
    return <LoadingIndicator />;
  }
  // console.log("sensor", data.HR);
  let config = {
    xAxis: {
      // range: 60 // 1min
    },
    chart: {
      zoomType: "x"
    },
    rangeSelector: {
      // enabled: false
      allButtonsEnabled: true,
      buttons: [
        {
          count: 1,
          type: "minute",
          text: "1M"
        },
        {
          count: 5,
          type: "minute",
          text: "5M"
        },
        {
          count: 30,
          type: "minute",
          text: "Hour"
        },
        {
          count: 3,
          type: "hour",
          text: "Day"
        },
        {
          count: 3,
          type: "month",
          text: "Year"
        },
        {
          type: "all",
          text: "All"
        }
      ],
      inputEnabled: true,
      selected: 1
    },
    title: {
      text: title
    },
    exporting: {
      enabled: true
    },
    series: [
      {
        name: "Heart Rate",
        data: data.HR,
        tooltip: {
          valueDecimals: 2
        }
      },
      {
        name: "Respiration Rate",
        data: data.RR,
        tooltip: {
          valueDecimals: 2
        }
      },
      {
        name: "Relative Stroke Volume",
        data: data.SV,
        tooltip: {
          valueDecimals: 2
        }
      },
      {
        name: "Heart Rate Variability",
        data: data.HRV,
        tooltip: {
          valueDecimals: 2
        }
      } /* ,
            {
                name: 'Signal Strength',
                data: data.signalStrength,
                tooltip: {
                    valueDecimals: 2
                }
            } */
    ]
  };

  return (
    <Graph>
      <ReactHighstrock config={config} ref={a => (this.crg = a)} />
    </Graph>
  );
};

export default SensorStream;
