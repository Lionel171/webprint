import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  ClockIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";

import OrderService from '@/services/order-service';
import UserService from '@/services/user-service';

export function Home() {
  const [todayMoney, setTodayMoney] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [monthlyCompletedOrders, setMonthlyCompletedOrders] = useState([]);
  const [weekCustomers, setWeekCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [reviewOrdersCount, setReviewOrdersCount] = useState(0);
  const [porcessingOrdersCount, setPorcessingOrdersCount] = useState(0);
  const [compeltedOrdersCount, setcCompeltedOrdersCount] = useState(0);
  const [pickupOrdersCount, setPickupOrdersCount] = useState(0);
  const [deliveryOrdersCount, setDeliveryOrdersCount] = useState(0);

  //Total Orders
  useEffect(() => {
    async function fetchData() {
      const response = await OrderService.getOrders();
      setOrders(response.orders);
      const newOrders = response.orders.filter(order => order.status === "1");
      setNewOrdersCount(newOrders.length);

      const reviewOrders = response.orders.filter(order => order.status === "2");
      setReviewOrdersCount(reviewOrders.length);

      const porcessingOrders = response.orders.filter(order => order.status === "3");
      setPorcessingOrdersCount(porcessingOrders.length);

      const compeltedOrders = response.orders.filter(order => order.status === "4");
      setcCompeltedOrdersCount(compeltedOrders.length);

      const pickupOrders = response.orders.filter(order => order.status === "5");
      setPickupOrdersCount(pickupOrders.length);

      const deliveryOrders = response.orders.filter(order => order.status === "6");
      setDeliveryOrdersCount(deliveryOrders.length);
    }
    fetchData();
  }, []);



  //Today's Order
  useEffect(() => {
    async function fetchData() {
      const response = await OrderService.getTodayOrders();
      setTodayOrders(response.orders.length);
      const completed_orders = response.orders.filter(status => status >= "4");
      setCompletedOrders(completed_orders.length);
    }
    fetchData();
  }, [])


  // Today's Customer
  useEffect(() => {
    async function fetchData() {
      const response = await UserService.getTodayCustomers();
      setNewCustomers(response.users.length);
    }
    fetchData();
  }, []);

  // Today's money
  useEffect(() => {
    async function fetchData() {
      const response = await OrderService.getTodayMoney();
      const money = response.orders.map((res) => res.total_value);

      const total = money.reduce((acc, curr) => acc + curr, 0);
      setTodayMoney(total);

    }
    fetchData();
  }, []);

  // Total Money
  useEffect(() => {
    async function fetchData() {
      const response = await OrderService.getTotalMoney();
      const money = response.orders.map((res) => res.total_value);

      const total = money.reduce((acc, curr) => acc + curr, 0);
      setTotalMoney(total);

    }
    fetchData();
  }, []);
  //----------Chart-------------
  // Weekly Customers

  useEffect(() => {
    async function fetchData() {
      const response = await UserService.getWeekCustomers();
      if (response) {
        const updatedWeekCustomers = [0, 0, 0, 0, 0, 0, 0];
        response.users.forEach((user) => {
          if (user._id.day === 1) {
            updatedWeekCustomers[6] = user.count;
          } else if (user._id.day === 2) {
            updatedWeekCustomers[0] = user.count;
          } else if (user._id.day === 3) {
            updatedWeekCustomers[1] = user.count;
          } else if (user._id.day === 4) {
            updatedWeekCustomers[2] = user.count;
          } else if (user._id.day === 5) {
            updatedWeekCustomers[3] = user.count;
          } else if (user._id.day === 6) {
            updatedWeekCustomers[4] = user.count;
          } else {
            updatedWeekCustomers[5] = user.count;
          }
        });
        setWeekCustomers(updatedWeekCustomers);
      }
    }

    fetchData();
  }, []);
  //Monthly price for this year

  useEffect(() => {
    async function fetchData() {
      const response = await OrderService.getMonthlyMoney();
      if (response) {
        const updatedMonthlySales = [];
        const current_month = new Date().getMonth();
        for (let i = 0; i <= current_month; i++) {
          updatedMonthlySales.push(0);
          response.orders.forEach((order) => {
            if (order._id === i + 1) {
              updatedMonthlySales[i] = order.totalPrice;
            }
          });
        }
        setMonthlySales(updatedMonthlySales);
      }
    }
    fetchData();
  }, []);

  //Monthly Completed Orders.
  useEffect(() => {
    async function fetchData() {
      const response = await OrderService.getMonthlyOrders();
      if (response) {
        const updatedMonthlyOrders = [];
        const current_month = new Date().getMonth();
        for (let i = 0; i <= current_month; i++) {
          updatedMonthlyOrders.push(0);
          response.count.forEach((order) => {
            if (order._id === i + 1) {
              updatedMonthlyOrders[i] = order.count;
            }
          });
        }
        setMonthlyCompletedOrders(updatedMonthlyOrders);
      }
    }
    fetchData();
  }, []);


  return (
    localStorage.getItem('role') === 'admin' && (
      <div className="mt-12">
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-5">
          {statisticsCardsData.map(({ icon, title, footer, value, ...rest }) =>
            title === "Today's Orders" ? (
              <StatisticsCard
                key={title}
                {...rest}
                title={title}
                value={todayOrders}
                icon={React.createElement(icon, {
                  className: "w-6 h-6 text-white",
                })}
              />
            ) :
              title === "New Customers" ? (
                <StatisticsCard
                  key={title}
                  {...rest}
                  title={title}
                  value={newCustomers}
                  icon={React.createElement(icon, {
                    className: "w-6 h-6 text-white",
                  })}
                />
              ) :
                title === "Today's Completed Orders" ? (
                  <StatisticsCard
                    key={title}
                    {...rest}
                    title={title}
                    value={completedOrders}
                    icon={React.createElement(icon, {
                      className: "w-6 h-6 text-white",
                    })}
                  />
                ) :
                  title === "Today's Money" ? (
                    <StatisticsCard
                      key={title}
                      {...rest}
                      title={title}
                      value={'$' + (todayMoney / 1000) + "K"}
                      icon={React.createElement(icon, {
                        className: "w-6 h-6 text-white",
                      })}
                    />
                  ) : (
                    <StatisticsCard
                      key={title}
                      {...rest}
                      title={title}
                      value={'$' + totalMoney / 1000 + "K"}
                      icon={React.createElement(icon, {
                        className: "w-6 h-6 text-white",
                      })}
                    />
                  )
          )}
        </div>
        <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
          {statisticsChartsData.map((props) => (
            props.title === "Customers" ? (
              <StatisticsChart
                key={props.title}
                {...props}
                chart={{
                  ...props.chart,
                  series: [
                    {
                      ...props.chart.series[0],
                      data: weekCustomers,
                    },
                  ],
                }}
              // footer={
              //   <Typography
              //     variant="small"
              //     className="flex items-center font-normal text-blue-gray-600"
              //   >
              //     <ClockIcon strokeWidth={2} className="h-4 w-4 text-inherit" />
              //     &nbsp;{props.footer}
              //   </Typography>
              // }
              />
            ) :
              props.title === "Monthly Sales" ? (
                <StatisticsChart
                  key={props.title}
                  {...props}
                  chart={{
                    ...props.chart,
                    series: [
                      {
                        ...props.chart.series[0],
                        data: monthlySales,
                      },
                    ],
                  }}
                // footer={
                //   <Typography
                //     variant="small"
                //     className="flex items-center font-normal text-blue-gray-600"
                //   >
                //     <ClockIcon strokeWidth={2} className="h-4 w-4 text-inherit" />
                //     &nbsp;{props.footer}
                //   </Typography>
                // }
                />
              ) :
                (
                  <StatisticsChart
                    key={props.title}
                    {...props}
                    chart={{
                      ...props.chart,
                      series: [
                        {
                          ...props.chart.series[0],
                          data: monthlyCompletedOrders,
                        },
                      ],
                    }}
                  // footer={
                  //   <Typography
                  //     variant="small"
                  //     className="flex items-center font-normal text-blue-gray-600"
                  //   >
                  //     <ClockIcon strokeWidth={2} className="h-4 w-4 text-inherit" />
                  //     &nbsp;{props.footer}
                  //   </Typography>
                  // }
                  />
                )

          ))}
        </div>
        <div className="mb-5 pt-5 mt grid grid-cols-1 gap-6 xl:grid-cols-1 mt-3" >
          <Card>
            <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
            {/* <CardHeader  >
              <img
                className="mb-4 mt-2 p"
                src="/img/order-logo.png"
                alt="The cover of Stubborn Attachments"
              />
            </CardHeader> */}
            <CardBody className="pt-2">
              {/* <Typography variant="h6" color="blue-gray" className="mb-2">
                Orders Overview
              </Typography> */}
              {ordersOverviewData.map(({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === ordersOverviewData.length - 1 ? "after:h-0" : "after:h-4/6"
                      }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="h5"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}{" "}{title === "New Orders:"
                        ? newOrdersCount
                        : title === "Review Orders:"
                          ? reviewOrdersCount
                          : title === "Processing Orders:"
                            ? porcessingOrdersCount
                            : title === "Completed Orders:"
                              ? compeltedOrdersCount
                              : title === "Pick-Up Orders:"
                                ? pickupOrdersCount
                                : deliveryOrdersCount}{' '}{'orders'}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {/* {description} */}
                    </Typography>
                  </div>
                </div>
              ))}

            </CardBody>
          </Card>
        </div>
      </div>
    )

  );
}

export default Home;
