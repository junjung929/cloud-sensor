import React from "react";
import ReactHighstrock from "react-highcharts/ReactHighstock";
import LoadingIndicator from "react-loading-indicator";
import styled from "styled-components";

const Graph = styled.div`
  min-height: 400px;
`;
const SensorStream = ({ data, title, visible, className }) => {
  if (!data) {
    return <LoadingIndicator />;
  }
  let config = {
    xAxis: {
      title: "Date",
      type: "datetime",
      dateTimeLabelFormats: {
        month: "%e. %b",
        year: "%b"
      }
    },
    yAxis: {
      title: "Strength"
    },
    chart: {},
    rangeSelector: {
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
        name: "Heart Rate(HR)",
        data: data.HR,
        tooltip: {
          valueDecimals: 0
        },
        visible: visible.HR
      },
      {
        name: "Respiration Rate(RR)",
        data: data.RR,
        tooltip: {
          valueDecimals: 0
        },
        visible: visible.RR
      },
      {
        name: "Relative Stroke Volume(RSV)",
        data: data.SV,
        tooltip: {
          valueDecimals: 0
        },
        visible: visible.SV
      },
      {
        name: "Heart Rate Variability(HRV)",
        data: data.HRV,
        tooltip: {
          valueDecimals: 0
        },
        visible: visible.HRV
      },
      {
        name: "Signal Strength",
        data: data.signalStrength,
        tooltip: {
          valueDecimals: 0
        },
        visible: visible.signalStrength
      }
    ]
  };

  return (
    <Graph className={className}>
      <ReactHighstrock config={config} />
    </Graph>
  );
};

export default SensorStream;
