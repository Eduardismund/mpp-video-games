import React, {useEffect, useState} from "react";
import {Bar, Line, Pie} from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import {videoGameStore} from "./WrapperVideoGameStore.js";
import ChartContainer from "./ChartContainer.jsx";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  BarElement, // Register BarElement for horizontal bars
  Title,
  Tooltip,
  Legend
);

function VideoGameStatisticsChart() {
  const [pricePercentilesData, setPricePercentilesData] = useState({
    labels: [],
    datasets: [
      {
        label: "Price Percentiles",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  });
  const [genrePopularityData, setGenrePopularityData] = useState({
    labels: [],
    datasets: [
      {
        label: "Genre Popularity",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  });
  const [releaseYears, setReleaseYears] = useState({
    labels: [],
    datasets: [
      {
        label: "Release Years",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  });

  const [storeUpdateCount, setStoreUpdateCount] = useState(0)

  function onStoreUpdate() {
    setStoreUpdateCount(prev => prev + 1)
  }

  useEffect(() => {
    videoGameStore.addSubscriber('statistic-chart', onStoreUpdate);
  }, []);

  useEffect(() => {
    async function fetchData() {
      // Fetch data from the statistics API
      const {priceMetrics, genrePopularity, totalCount, releaseYears} = await videoGameStore.getVideoGameStatistics({
        priceMetrics: {percentiles: [10, 40, 60, 90]},
        genrePopularity: 3,
        releaseYears: true,
        totalCount: true,
      });

      // Process the data
      const priceLabels = ["10%", "40%", "60%", "90%"];
      const priceValues = [
        priceMetrics.percentiles?.find((p) => p.p === 10)?.v,
        priceMetrics.percentiles?.find((p) => p.p === 40)?.v,
        priceMetrics.percentiles?.find((p) => p.p === 60)?.v,
        priceMetrics.percentiles?.find((p) => p.p === 90)?.v,
      ].filter(elem => !!elem);

      // Update the chart data state
      setPricePercentilesData({
        labels: priceLabels,
        datasets: [
          {
            label: "Price Percentiles",
            data: priceValues,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.3,
          },
        ],
      });

      const labels = genrePopularity.map((data) => data.genre);
      labels.push("Others")
      const values = genrePopularity.map((data) => data.count);
      values.push(totalCount - values.reduce((a, b) => a + b, 0))

      setGenrePopularityData({
        labels: labels,
        datasets: [
          {
            label: "Genre Popularity",
            data: values,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
            tension: 0.3,
          },
        ],
      });
      const yearLabels = releaseYears.map((data) => data.year);
      const yearValues = releaseYears.map((data) => data.count);

      setReleaseYears({
        labels: yearLabels,
        datasets: [
          {
            label: "Release Years",
            data: yearValues,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)"],
            tension: 0.3,
          },
        ],
      });
    }

    // Fetch data and update chart on mount
    fetchData();
  }, [storeUpdateCount]);

  return (
    <>
      <ChartContainer>
        <Bar
          data={pricePercentilesData}
          options={{
            responsive: true,
            indexAxis: "y", // This makes the chart horizontal
            scales: {
              x: {
                beginAtZero: true,
              },
            },
          }}
        />
      </ChartContainer>
      <ChartContainer>
        <Pie
          data={genrePopularityData}
          options={{
            responsive: true,
          }}
        />
      </ChartContainer>
      <ChartContainer>
        <Line
          data={releaseYears}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </ChartContainer>
    </>
  );
}

export default VideoGameStatisticsChart;
