import { saveAs } from "file-saver";
import Input from '@/components/common/Input';
import { useEffect, useState, useRef } from 'react';
import OrderService from "@/services/order-service"
import DepartmentService from "@/services/department-service"
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context";
import Constant from '@/utils/constant';
import { FaDownload, FaUpload } from 'react-icons/fa';
import userService from '@/services/user-service';
import OrderStep from './components/orderStep';
import DefaultImage from '../../../../public/img/default.png';
import { SelectNoSearch } from '@/components/common/Select';
import { position } from "@chakra-ui/react";



const serviceTypeList = [
  { id: 0, name: "", value: "" },
  { id: 1, name: "We Print DTF", value: "we_print_dtf" },
  { id: 2, name: "Embroidery", value: "embroidery" },
  { id: 3, name: "Screen Printing", value: "screen_printing" },
  { id: 4, name: "Vinyl Transfer", value: "vinly_transfer" },
  { id: 5, name: "Signs & Banners", value: "signs_banners" },
];

const paymentTypeList = [
  { id: 0, name: "", value: "" },
  { id: 1, name: "Credit Card", value: "credit_card" },
  { id: 2, name: "Paypal", value: "paypal" },
  { id: 3, name: "Offline", value: "offline" },
  { id: 4, name: "Imported Payment", value: "imported_payment" },
  { id: 5, name: "Free", value: "free" },
];

const controlList = [
  { id: 0, name: "Invoice Email", role: "admin" },
  // { id: 1, name: "Order cancel", role: "admin" },
  // { id: 2, name: "", role: "" },
  // { id: 3, name: "", role: "" },
];

export function OrderEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const isAdmin = authContext.role === Constant.Admin ? true : false;
  const [order, setOrder] = useState(location.state);
  const [imageFiles, setImageFiles] = useState([]);
  const avatarFileRef = useRef([]);
  const [orders, setOrders] = useState([]);
  const API_URL = process.env.API_URL;
  const [totalPrice, setTotalPrice] = useState(0);
  const [isView, setIsView] = useState(false);
  const [user, setUser] = useState([]);
  const [staff, setStaff] = useState([]);
  const [service, setService] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      console.log(orders, ">>>>>>>>>>>>>>order")
      let department = service;
      orders.map((order, index) => {
        department.push(serviceTypeList[order.service_type].name);
      })
      setService(department);
      const query = {
        department: service
      }
      const response = await userService.getStaffByService(query);
      setStaffList(response.staff)

      // response.staff.map((st, index) => {
      //   setStaffTypeList(prevState => [...prevState, { id: index, name: st.contact_person }]);
      // })


      console.log(response.staff, "staff");
    }

    fetchData();
  }, [order]);



  const getUserbyOder = async () => {
    const response = await userService.getUserById(order.user_id);
    if (response.success) {
      setUser(response);
    }
  }

  const onChangeImagePhoto = (event, index) => {
    if (event.target.files && event.target.files[0]) {
      let tempFilie = [...imageFiles]
      tempFilie[index] = event.target.files[0];
      setImageFiles(tempFilie);
      let reader = new FileReader();

      reader.onload = event => {
        const temp = orders.map((obj, subindex) => {
          if (subindex === index) {
            return {
              ...obj,
              client_art_up: event.target.result,
              imgFlag: false,
            };
          }
          return obj;
        });
        setOrders(temp);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    if (order && order._id) {
      // fetchData();
      setIsView(false)
    }

  };

  const avatarImageClick = (index) => {
    avatarFileRef.current[index].click();
  };

  const onChangePaymentType = (item, index) => {
    const temp = orders.map((obj, subindex) => {
      if (subindex === index) {
        return {
          ...obj,
          paymentTypeFlag: false,
          payment_type: item.id,
        };
      }
      return obj;
    });
    setOrders(temp);

  };

  const onChangeStaff = (item, index) => {
    const temp = orders.map((obj, subindex) => {
      if (subindex === index) {
        return {
          ...obj,
          staffFlag: false,
          staff_id: item.id,
        };
      }
      return obj;
    });
    setOrders(temp);
    console.log(temp, "temppppp")
    console.log(orders, "orders")
  }

  const onChangePrice = (value, index) => {
    const temp = orders.map((obj, subindex) => {
      if (subindex === index) {
        setTotalPrice(value);
        return {
          ...obj,
          price: value,
          priceFlag: false,
        };
      }
      return obj;
    });
    setOrders(temp);
  };

  const onChangeAbout = (value, index) => {
    const temp = orders.map((obj, subindex) => {
      if (subindex === index) {
        return {
          ...obj,
          comment: value,
        };
      }
      return obj;
    });
    setOrders(temp);
  };

  const downloadHandle = (imageUrl) => {
    let url = imageUrl;
    saveAs(url, "work_image");
  };

  const saveOrder = async () => {
    let flag = true;
    const temp = orders.map((obj, subindex) => {
      if (obj.price <= 0) {
        flag = false;
        return {
          ...obj,
          priceFlag: true,
        };
      }
      if (obj.payment_type === 0) {
        flag = false;
        return {
          ...obj,
          paymentTypeFlag: true,
        };
      }
      if (obj.client_art_up === "") {
        flag = false;
        return {
          ...obj,
          imgFlag: true,
        };
      } else {
        return {
          ...obj
        }
      }
    });

    setOrders(temp);
    if (!flag) {
      return;
    }

    if (localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes('Sales Manager')) {

      const response = await OrderService.saveOrderPrice({ orders: orders });
      if (response.success) {
        await changeStaus(parseInt(order.status) + 1);
        navigate("/dashboard/orders");
      }

    }
    if (localStorage.getItem('role').includes("Artwork Manager") && order.status === "2") {
      let newOrder = {
        files: imageFiles,
        orders: orders,
      };
      const response = await OrderService.updateImage(newOrder);
      if (response.success) {
        await changeStaus(parseInt(order.status) + 1);
        navigate("/dashboard/orders");
      }
    }
    if (localStorage.getItem("role").includes('Production Manager')) {
      const response = await OrderService.assignStaff({ orders: orders });
      if (response.success) {
        await changeStaus(parseInt(order.status) + 1);
        navigate("/dashboard/orders");
      }
    }
    if (localStorage.getItem("role").includes("Production Staff")) {
      await changeStaus(parseInt(order.status) + 1);
      navigate("/dashboard/orders");

    }
    //  else {
    //     const response = await OrderService.saveOrderPrice({ orders: orders });
    //     let newOrder = {
    //       title: order.title,
    //       files: imageFiles,
    //       orders: orders,
    //     };
    //     const res = await OrderService.saveOrder(newOrder);
    //     if (response.success) {
    //       await changeStaus(parseInt(order.status) + 1);
    //       // const payload ={
    //       //   order_id: order._id,
    //       //   comment: 
    //       // }
    //       navigate("/dashboard/orders");
    //     }
    //   }
    //   // const response = await OrderService.saveOrderPrice({ orders: orders });
    //   // if (response.success) {
    //   //   await changeStaus(parseInt(order.status) + 1);
    //   //   // const payload ={
    //   //   //   order_id: order._id,
    //   //   //   comment: 
    //   //   // }
    //   //   navigate("/dashboard/orders");
    //   // }


  }

  const changeStaus = async (step) => {
    if (step < order.status) {
      return;
    }
    const payload = {
      order_id: order._id,
      status: step
    }
    const response = await OrderService.updateStatus(payload);
    if (response.state) {
      let temp = { ...order };
      temp.status = step;
      setOrder(temp);
    }
  };

  const controlHandle = async (id) => {
    if (id === 0) {
      if (totalPrice == 0) {
        alert("Please set price!");
        return
      } else {
        const messageData = {
          from: 'showstopperurbanwear@gmail.com',
          // to: user.user.email,
          to: 'showstopperurbanwear@gmail.com',
          subject: 'Hello ' + user.user.name + '.',
          text: 'You received invoice emai: https://invoicehome.com/'
        };
        const email_response = await userService.sendEmail(messageData);
        alert("email is sent succesfully!");

      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      const response = await OrderService.getOrderDetailList(order._id);
      setOrders(response.entities);
      getUserbyOder();
      console.log(orders)

    }
    async function fetchCustomerList() {
      const response = await userService.getCustomerList();
      setCustomerList(response.entities);
    }
    if (order && order._id) {
      fetchData();
      setIsView(true)
    }
    if (authContext.role === Constant.Admin)
      fetchCustomerList();
  }, [])

  useEffect(() => {
    getUserbyOder();
    async function fetchData() {
      const orderResponse = await OrderService.getOrderById(order._id);
      setOrder(orderResponse.order);
      const response = await OrderService.getOrderDetailList(order._id);
      setOrders(response.entities);
      let tempTotal = 0
      response.entities.map(item => {
        tempTotal = tempTotal + item.price;
      })
      setTotalPrice(tempTotal);
    }
    // if (order && order._id) {
    fetchData();
    setIsView(true)
    // }
  }, [])

  return (
    <div>
      <div className="space-y-5">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Order {order.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            ID - {order._id}
          </p>
        </div>
        <div className="border-b border-gray-900/10 pb-2 mb-4">
          {order.status === "6" && (
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Order was shipped Inspected!
            </h1>
          )}

          {order.status === "7" && (
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Order was delivered successfully!
            </h1>
          )}
        </div>


        <div className="border-b border-gray-900/10 pb-2">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Order Detail
          </h2>
          <div className="mt-2 block justify-between sm:flex md:flex">
            <OrderStep
              changeStaus={() => { }}
              currentStatus={order.status}
              className="w-1/2"
            />
            <dl className="w-1/2 flex-wrap">

              {controlList.map((item) => (
                localStorage.getItem("role") === 'admin' && (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => controlHandle(item.id)}
                    className=" mt-2 flex  h-[40px] w-[130px] items-center justify-center  gap-x-4 rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >

                    {item.name}
                  </button>
                )

              ))}

              {/* <div className="flex pl-6 pt-2">
                  <dt className="text-sm font-semibold leading-6 text-gray-900">
                    Total Price
                  </dt>
                  <dd className="ml-2 text-base font-semibold leading-6 text-gray-900">
                    ${totalPrice}
                  </dd>
                </div>
               
                <div className="mt-2 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Client</span>
                    <UserCircleIcon
                      className="h-6 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm font-medium leading-6 text-gray-900">
                    {order && order.user_id.name}
                  </dd>
                </div>
                <div className="mt-2 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Due date</span>
                    <CalendarDaysIcon
                      className="h-6 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm leading-6 text-gray-500">
                    <time dateTime="2023-01-31">{order && order.date}</time>
                  </dd>
                </div>
                <div className="mt-2 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Status</span>
                    <CreditCardIcon
                      className="h-6 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm leading-6 text-gray-500">
                    {order && order.payment_req}
                  </dd>
                </div> */}
            </dl>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        {/* Order list */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
          <table className=" w-full whitespace-nowrap text-left text-sm leading-6 ml-2 mr-2">
            <colgroup>
              <col className="" />
              <col />
              <col />
              <col />
            </colgroup>
            <thead className="border-b border-gray-200 text-gray-900">
              <tr>
                <th scope="col" className="px-0 py-3 font-semibold">
                  Service Type
                </th>

                <th scope="col" className="pl-10 px-0 py-3 font-semibold ">
                  Payment Type
                </th>

                <th
                  scope="col"
                  className=" py-3 pl-10 pr-0 text-center font-semibold "
                >
                  Size : Quantity
                </th>
                <th
                  scope="col"
                  className="py-3 pl-10 pr-0 text-center font-semibold"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="py-3 pl-10 pr-0 text-center font-semibold"
                >
                  Price
                </th>
                {((localStorage.getItem('role').includes("Production Manager") || localStorage.getItem('role').includes("admin")) && order.status === "3") && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Assign Staff
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="max-w-0 px-0 py-5 align-top ">
                    <div className="truncate font-medium text-gray-900 text-left">
                      {serviceTypeList[item.service_type].name}
                    </div>
                    <div className="truncate text-gray-500 text-left" style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.comment}
                    </div>

                  </td>
                  <td className="ml-5 max-w-0 px-0 py-5 align-top text-center">
                    {/* <div className="pl-10 truncate font-medium text-gray-900"> */}
                    {/* {paymentTypeList[item.payment_type].name} */}
                    {/* <div className='mt-2'> */}
                    {((localStorage.getItem('role').includes('admin') || localStorage.getItem('role').includes("Sales Manager")) && order.status === "1") ? (
                      <SelectNoSearch
                        onChange={(selectedOption) => onChangePaymentType(selectedOption, index)}
                        value={paymentTypeList.find((option) => option.id === item.payment_type)}
                        items={paymentTypeList}
                        error={item.paymentTypeFlag}
                      // disabled={isView}
                      />
                    ) : (
                      <div className="truncate text-gray-500 text-center " style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {paymentTypeList[item.service_type].name}
                      </div>
                    )}


                    {/* </div> */}
                    {/* </div> */}
                  </td>
                  <td className=" py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700 ">
                    <div className="ttruncate text-gray-500 text-center">
                      {item.quantity.map((quantity, index) => {
                        return (
                          item.size[index] + ': ' + quantity
                        )
                      }).join(', ')}
                    </div>
                  </td>
                  <td className=" py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700">
                    <div className="flex justify-end">
                      <div className="flex items-center mr-3">
                        {/* {(localStorage.getItem('role').includes.('Artwork Manager') && order.status !== "2") || (localStorage.getItem('role').includes('admin') && order.status !== "2") || (localStorage.getItem('role') "normal" || (localStorage.getItem('role') "Production Manager" && order.status === "")) ? ( */}


                        {((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Team Member') || localStorage.getItem('role').includes('admin')) && order.status === "2") ? (
                          <>
                            <input type='file' onChange={(event) => onChangeImagePhoto(event, index)} hidden ref={(el) => (avatarFileRef.current[index] = el)} />
                            <div className="text-center" style={{ position: 'relative' }}>
                              <img
                                src={item.client_art_up ? (isView ? API_URL + '/' + item.client_art_up : item.client_art_up) : DefaultImage}
                                alt='Image'
                                onClick={() => avatarImageClick(index)}
                                width={250}
                                height={250}
                                style={{ objectFit: 'contain' }}
                              />
                              {/* <FaUpload style={{ fontSize: '50px', position: 'absolute', top: "30px", right: "100px" }} /> */}
                            </div>
                          </>
                        ) : (
                          <div className="text-center" style={{ position: 'relative' }}>
                            <img
                              src={item.client_art_up ? API_URL + "/" + item.client_art_up : DefaultImage}
                              alt="Image"
                              width={100}
                              height={100}
                              className=" "
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {(((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Team Member') || localStorage.getItem('role').includes('admin')) && order.status === "2")) ? (
                      <div className="text-center" >
                        <button
                          type="submit"
                          onClick={() => downloadHandle(API_URL + "/" + item.client_art_up)}
                          className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    ) : null}
                  </td>
                  {(localStorage.getItem('role') === 'admin' && order.status === "1") ? (
                    <td className="py-2 pl-10 pr-0 text-right align-top tabular-nums text-gray-700 text-left">
                      <Input
                        type="number"
                        onChange={(e) => onChangePrice(e.target.value, index)}
                        value={item.price}
                        error={item.priceFlag}
                        maxLength={50}
                        className="w-[20px]"
                      />
                    </td>
                  ) : (
                    <td className="py-2 pl-10 pr-0 text-right align-top tabular-nums text-gray-700 ">
                      <div className="ttruncate text-gray-700 text-center mt-3">
                        ${item.price}
                      </div>
                    </td>
                  )}

                  <td className="ml-5 max-w-0 px-0 py-5 align-top text-center">
                    {/* <div className="pl-10 truncate font-medium text-gray-900"> */}
                    {/* {paymentTypeList[item.payment_type].name} */}
                    {/* <div className='mt-2'> */}
                    {((localStorage.getItem('role').includes('Production Manager') || localStorage.getItem('role').includes('admin')) && order.status === "3") && (
                      <SelectNoSearch
                        onChange={(selectedOption) => onChangeStaff(selectedOption, index)}
                        // value={staffList.find((option) => option.name === item.department)}
                        items={staffList.filter(st => st.department === serviceTypeList[item.service_type].name)}
                      // error={item.paymentTypeFlag}
                      // disabled={isView}
                      />
                    )}


                    {/* </div> */}
                    {/* </div> */}
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {((localStorage.getItem("role").includes('admin') || localStorage.getItem('role').includes('Sales Manager')) && order.status === '1') ? (
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link
            to={`/dashboard/orders`}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            onClick={saveOrder}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Approve
          </button>
        </div>
      ) : null}


      {localStorage.getItem("role").includes('Artwork Manager') && (
        <div className="mt-6 flex items-center justify-end gap-x-6">

          {order.status === '2' && (
            <>
              <Link
                to={`/dashboard/orders`}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                onClick={saveOrder}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Start Work
              </button>
            </>
          )}
        </div>
      )
      }
      {localStorage.getItem("role").includes("Production Manager") && (
        <div className="mt-6 flex items-center justify-end gap-x-6">

          {order.status === "3" && (
            <>
              <Link
                to={`/dashboard/orders`}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                onClick={saveOrder}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Assign Task
              </button>

            </>

          )}

        </div>
      )}
      {localStorage.getItem("role").includes("Production Staff") && (
        <div className="mt-6 flex items-center justify-end gap-x-6">

          {order.status === "4" ? (
            <>
              <Link
                to={`/dashboard/orders`}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                onClick={saveOrder}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Complete
              </button>

            </>

          ) : 
          order.status === "5" ? (
            <>
              <Link
                to={`/dashboard/orders`}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                onClick={saveOrder}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Inspect
              </button>

            </>
          ) : 
          order.status === "6" ? (
            <>
              <Link
                to={`/dashboard/orders`}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                onClick={saveOrder}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Pick-up
              </button>

            </>
          ) : (null)}

        </div>
      )}




    </div >
  );
}

export default OrderEdit;