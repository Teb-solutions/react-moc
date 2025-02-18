import { color, motion } from "framer-motion";
import {
  Paper,
  Typography,
  Skeleton,
  Button,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

import { useState, useEffect } from "react";

import ReactApexChart from "react-apexcharts";

const AnalyticsTab = ({ data }) => {
  // console.log(data);
  const [month, setMonth] = useState(1);
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    console.log("this is testing");
    console.log(data);
    const test = data?.mocSummary?.find((item) => item.noOfMonths === month);
    console.log(test);
    setMonthlyData(test);
  }, [data, month]);
  return (
    <>
      <motion.div className="sm:row-span-2">
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <div className="mt-12 sm:mt-0 sm:ml-8 px-20">
            <Tabs
              value={month}
              onChange={(ev, value) => setMonth(value)}
              indicatorColor="secondary"
              textColor="inherit"
              variant="scrollable"
              scrollButtons={false}
              className="-mx-4 min-h-40"
              classes={{
                indicator: "flex justify-center bg-transparent w-full h-full",
              }}
              TabIndicatorProps={{
                children: (
                  <Box
                    sx={{ bgcolor: "text.disabled" }}
                    className="w-full h-full rounded-full opacity-20"
                  />
                ),
              }}
            >
              {data?.mocSummary?.map((item) => (
                <Tab
                  key={item.noOfMonths}
                  label={
                    "Last " +
                    item.noOfMonths +
                    (item.noOfMonths === 1 ? " Month" : " Months")
                  }
                  value={item.noOfMonths}
                  className="normal-case"
                />
              ))}
            </Tabs>
          </div>
        </div>
        <div className="grid grid-cols-1  sm:grid-cols-4 mt-24 gap-24 px-24">
          <Paper className="flex flex-col flex-auto p-30 pt-24 pb-24 shadow rounded-2xl overflow-hidden bg-none w-full">
            <ClassificationChart data={monthlyData} />
          </Paper>
          <Paper className="flex flex-col col-span-2 flex-auto p-30 pt-24 pb-24 shadow rounded-2xl overflow-hidden bg-none w-full">
            <StatusChart data={monthlyData} />
          </Paper>
          <Paper className="flex flex-col flex-auto p-30 pt-24 pb-24 shadow rounded-2xl overflow-hidden bg-none w-full">
            <ClassChart data={monthlyData} />
          </Paper>
        </div>
        <div className="grid grid-cols-1  sm:grid-cols-4 my-24 gap-24 px-24">
          
          <Paper className="flex flex-col flex-auto p-30 pt-24 pb-24 shadow rounded-2xl overflow-hidden bg-none w-full">
            <OpenStatusChart data={monthlyData} />
          </Paper>
          <Paper className="flex flex-col col-span-3 flex-auto p-30 pt-24 pb-24 shadow rounded-2xl overflow-hidden bg-none w-full">
            {data &&
              data.mocActivitydaysCount &&
              data.mocActivitydaysCount.length > 0 && (
                <MOCActivityStatusChart data={data.mocActivitydaysCount} />
              )}
          </Paper>
        </div>
        
        {/* <div className="grid grid-cols-1 my-24 gap-24 px-24">
          <Paper className="flex flex-col flex-auto p-30 pt-24 pb-24 shadow rounded-2xl overflow-hidden bg-none w-full">
            {data &&
              data.mocActivitydaysCount &&
              data.mocActivitydaysCount.length > 0 && (
                <MOCStatusChart data={data.mocActivitydaysCount} />
              )}
          </Paper>
        </div> */}
      </motion.div>
    </>
  );
};
export default AnalyticsTab;

const ClassificationChart = ({ data }) => {
  const series = [data?.permanentMOC || 0, data?.temporaryMoc || 0];

  const options = {
    chart: {
      type: "donut",
    },
    labels: ["Permanent MOC", "Temporary MOC"],
    legend: {
      show: true,
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-left font-semibold"> By Classification</h3>
      <div id="chart" className="mt-10">
        <ReactApexChart
          width={350}
          options={options}
          series={series}
          type="donut"
        />
      </div>
    </div>
  );
};

const ClassChart = ({ data }) => {
  const series = [data?.classI || 0, data?.classII || 0];

  const options = {
    chart: {
      type: "pie",
      width: 380,
    },
    labels: ["Class I", "Class II"],
    colors: ["#A5978B", "#2b908f"],
    legend: {
      show: true,
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-left font-semibold"> By Class</h3>
      <div id="chart" className="mt-10">
        <ReactApexChart
          width={350}
          options={options}
          series={series}
          type="donut"
        />
      </div>
    </div>
  );
};

const OpenStatusChart = ({ data }) => {
  const series = [data?.pending || 0, data?.opened || 0];

  const options = {
    chart: {
      type: "donut",
    },
    labels: ["Open", "Closed"],
    legend: {
      show: true,
      position: "bottom",
    },
    colors: ["#d4526e", "#2b908f"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-left font-semibold"> By Status</h3>
      <div id="chart" className="mt-10">
        <ReactApexChart
          width={350}
          options={options}
          series={series}
          type="donut"
        />
      </div>
    </div>
  );
};

const StatusChart = ({ data }) => {
  const [state, setState] = useState({
    series: [
      {
        data: [
          data?.draft || 0,
          data?.approval || 0,
          data?.approved || 0,
          data?.implementation || 0,
          data?.compleated || 0,
        ],
      },
    ],
    labels: ["Draft", "Approval", "Approved", "Implementation", "Completed"],
    options: {
      chart: {
        type: "bar",
        height: 380,
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      colors: ["#f48024", "#A5978B", "#546E7A", "#69d2e7", "#90ee7e"],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: [
          "Draft",
          "Approval",
          "Approved",
          "Implementation",
          "Completed",
        ],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },

      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    },
  });

  const series = [
    {
      data: [
        data?.draft || 0,
        data?.approval || 0,
        data?.approved || 0,
        data?.implementation || 0,
        data?.compleated || 0,
      ],
    },
  ];
  const options = {
    chart: {
      type: "bar",
      height: 380,
    },
    plotOptions: {
      bar: {
        barHeight: "100%",
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: "bottom",
        },
      },
    },
    colors: ["#f48024", "#A5978B", "#546E7A", "#69d2e7", "#90ee7e"],
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["#fff"],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [
        "Draft",
        "Approval",
        "Approved",
        "Implementation",
        "Completed",
      ],
    },
    yaxis: {
      labels: {
        show: false,
      },
    },

    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-left font-semibold"> By Status</h3>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={300}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

// const MOCStatusChart = ({ data }) => {
 
//   const CatNameReadable = {
//     draft: "Draft",
//     approval: "Approval",
//     approved: "Approved",
//     implementations: "Implementations",
//     completed: "Completed",
//     cancelled: "Cancelled",
//   };
//   const categories = [
//     "draft",
//     "approval",
//     "approved",
//     "implementations",
//     "completed",
//     "cancelled",
//   ];

//   const series = categories.map((catName) => ({
//     name: CatNameReadable[catName],
//     data: data.map((item) => item[catName] || null),
//   }));

//   const series2 = data.map((moc) => ({
//     name: moc.mocNo,
//     data: data.map((item) => 1 || 0),
//   }));

//   const options = {
//     chart: {
//       type: "bar",
//       height: 350,
//       stacked: true,
//     },
//     colors: [
//       "#33b2df",
//       "#546E7A",
//       "#d4526e",
//       "#13d8aa",
//       "#A5978B",
//       "#2b908f",
//       "#f9a3a4",
//       "#90ee7e",
//       "#f48024",
//       "#A5978B",
//       "#2b908f",
//       "#f9a3a4",
//       "#90ee7e",
//     ],
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         dataLabels: {
//           total: {
//             enabled: true,
//             offsetX: 0,
//             style: {
//               fontSize: "13px",
//               fontWeight: 900,
//             },
//           },
//         },
//       },
//     },
//     stroke: {
//       width: 1,
//       colors: ["#fff"],
//     },

//     xaxis: {
//       categories: categories,
//       labels: {
//         formatter: function (val) {
//           return val;
//         },
//       },
//     },
//     yaxis: {
//       title: {
//         text: undefined,
//       },
//     },
//     tooltip: {
//       y: {
//         formatter: function (val) {
//           return val + "days";
//         },
//       },
//     },
//     fill: {
//       opacity: 1,
//     },
//     legend: {
//       position: "bottom",
//       horizontalAlign: "left",
//       offsetX: 40,
//     },
//   };

//   return (
//     <div>
//       <h3 className="text-left font-semibold">
//       Status Summary of MOC's Created Last Month
//         <small className="text-secondary ml-2">(in days)</small>
//       </h3> 
//       <p className="my-10">
//         This chart shows the status of the MOC's created over last month.
//       </p>
//       <div id="chart">
//         <ReactApexChart
//           options={options}
//           series={series}
//           type="bar"
//           height={350}
//         />
//       </div>
    
//     </div>
//   );
// };


const MOCActivityStatusChart = ({ data }) => {
    const categories = data.map((item) => item.mocNo);
  
    const stackNameReadable = {
      start: "Draft",
      aprove: "Approve",
      summeryform: "Summary",
      evaluation: "Evaluation",
      evSicApprove: "SIC Approval",
      evCorpHseApprove: "CoHSE Approval",
      evVpDivApprove: "VP DIV Approval",
      evVpHseprove: "VP HSE Approval",
      implementation: "Implementation",
      impSicApprove: "Imp SIC Approval",
      impCorpHseApprove: "Imp CoHSE Approval",
      impVpDivApprove: "Imp VP DIV Approval",
      impVpHeseprove: "Imp VP HSE Approval",
      // draft: "Draft",
      // approval: "Approval",
      // approved: "Approved",
      // implementations: "Implementations",
      // completed: "Completed",
      // cancelled: "Cancelled",
    };
    const stackNames = [
      "start",
      "aprove",
      "summeryform",
      "evaluation",
      "evSicApprove",
      "evCorpHseApprove",
      "evVpDivApprove",
      "evVpHseprove",
      "implementation",
      "impSicApprove",
      "impCorpHseApprove",
      "impVpDivApprove",
      "impVpHeseprove",
      // "draft",
      // "approval",
      // "approved",
      // "implementations",
      // "completed",
      // "cancelled",
    ];
  
    const series = stackNames.map((stackName) => ({
      name: stackNameReadable[stackName],
      data: data.map((item) => item[stackName] || 0),
    }));
  
    const options = {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
  
      xaxis: {
        categories: categories,
        labels: {
          formatter: function (val) {
            return val;
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "days";
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
        offsetX: 40,
      },
    };
  
    return (
      <div>
        <h3 className="text-left font-semibold">
        Time Summary of MOC Activities Over the Last Month
          <small className="text-secondary ml-2">(in days)</small>
        </h3> 
        <p className="my-10">
          This chart shows the number of days taken to complete each stage of MOC's over the last month.
        </p>
        <div id="chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      
      </div>
    );
  };
  