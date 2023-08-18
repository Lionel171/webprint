import { chartsConfig } from "@/configs";

const CustomersView = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Customers",
      data: [50, 20, 10, 22, 50, 10, 40],
    },
  ],
  options: {
    ...chartsConfig,
    colors: "#fff",
    plotOptions: {
      bar: {
        columnWidth: "16%",
        borderRadius: 5,
      },
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ["M", "T", "W", "T", "F", "S", "S"],
    },
  },
};

const MonthlySalesChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Sales",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#fff"],
    stroke: {
      lineCap: "round",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: [
        "Jan",
        "Feb",
        "March",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  },
};

const completedTasksChart = {
  ...MonthlySalesChart,
  series: [
    {
      name: "Orders",
      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
  ],
};

export const statisticsChartsData = [
  {
    color: "blue",
    title: "Customers",
    footer: "",
    description: "",
    chart: CustomersView,
  },
  {
    color: "pink",
    title: "Monthly Sales",
    description: "",
    footer: "",
    chart: MonthlySalesChart,
  },
  {
    color: "green",
    title: "Completed Orders", 
    description: "",
    footer: "",
    chart: completedTasksChart,
  },
];

export default statisticsChartsData;
