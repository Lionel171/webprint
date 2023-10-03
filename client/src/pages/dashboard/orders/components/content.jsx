import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, EyeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import ReactTimeAgo from 'react-time-ago';
import DropDown from './Dropdown';
import { SelectNoSearch } from '@/components/common/Select';
import Spinner from '../../../../../public/img/spinner.gif'


// import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useNavigate, NavLink } from 'react-router-dom';
import CustomPagination from "../../../../components/common/CustomPagination";

const statusList = [
  { id: '0', name: "All" },
  { id: '1', name: "Pending Review" },
  { id: '2', name: "Pre-Production" },
  { id: '3', name: "Ready for Production" },
  { id: '4', name: "In Production" },
  { id: '5', name: "Final inspection" },
  { id: '6', name: "Ready for pickup/ship" },
]
const paymentTypeList = [
  { id: '0', name: "All" },
  { id: '1', name: "Credit Cart" },
  { id: '2', name: "PayPal" },
  { id: '3', name: "Offline" },
  { id: '4', name: "Imported Payment" },
  { id: '5', name: "Free" },
]


const serviceTypeList = [
  { id: 0, name: "", value: "" },
  { id: 1, name: "We Print DTF", value: "we_print_dtf" },
  { id: 2, name: "Embroidery", value: "embroidery" },
  { id: 3, name: "Screen Printing", value: "screen_printing" },
  { id: 4, name: "Vinyl Transfer", value: "vinly_transfer" },
  { id: 5, name: "Signs & Banners", value: "signs_banners" },
];

export default function Content({
  orders,
  editFunction,
  deleteFunction,
  searchTxt,
  setSearchTxt,
  currentPage,
  totalPages,
  total,
  perPage,
  loadingData,
  onPageChange,
}) {
  const navigate = useNavigate();
  // const [controller, dispatch] = useMaterialTailwindController();
  const [filterOrders, setFilterOrders] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    setFilterOrders(orders);
    console.log(filterOrders, "this is filter orders")
  }, [orders]);


  useEffect(() => {
    if (selectedPaymentType !== null && selectedStatus !== null) {
      setFilterOrders(orders.filter(ord => ord.payment_type === selectedPaymentType && ord.status === selectedStatus));
    } else if (selectedPaymentType !== null) {
      setFilterOrders(orders.filter(ord => ord.payment_type === selectedPaymentType));
    } else if (selectedStatus !== null) {
      setFilterOrders(orders.filter(ord => ord.status === selectedStatus));
    } else {
      setFilterOrders(orders);
    }
  }, [selectedPaymentType, selectedStatus]);

  const onChangePaymentType = (e) => {
    const selectedPaymentType = e.id;
    if (selectedPaymentType === "0") {
      setSelectedPaymentType(null);
    } else {
      setSelectedPaymentType(selectedPaymentType);
    }

  }

  const onChangeStatus = (e) => {
    const selectedStatus = e.id;
    if (selectedStatus === "0") {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(selectedStatus);
    }

  }



  const editItem = (id) => {
    editFunction(id);
  };

  const deleteComfirm = (order) => {
    deleteFunction(order);
  };

  const onSetPage = (page) => {
    if (typeof page === "number" && page >= 1 && page <= totalPages)
      onPageChange(page);
  };
  return (
    <div className="lg:px-2">
      {loadingData && (
        <div className="fixed w-[80%] h-screen z-10  flex justify-center items-center">
          <img className='w-[100px] h-[100px] justify-center flex text-center' src={Spinner} alt="Loading..." />
        </div>
      )}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base text-xl font-semibold leading-6 text-gray-900">
            Orders
          </h1>
        </div>
        <div className="mt-3 w-full sm:mt-0 sm:ml-4 sm:col-3">
          <div className="flex rounded-md shadow-sm mb-5">
            <div className="relative grow focus-within:z-10">
              <SelectNoSearch
                labelName={'Status'}
                onChange={(e) => onChangeStatus(e)}
                items={statusList}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 w-full sm:mt-0 sm:ml-4 sm:col-3 ">
          <div className="flex rounded-md shadow-sm mb-5">
            <div className="relative grow focus-within:z-10">
              <SelectNoSearch
                labelName="Payment Type"
                onChange={(e) => onChangePaymentType(e)}
                items={paymentTypeList}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 w-full sm:mt-0 sm:ml-4 sm:col-3">
          <label htmlFor="desktop-search-candidate" className="sr-only">
            Search
          </label>
          <div className="flex rounded-md shadow-sm">
            <div className="relative grow focus-within:z-10">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                value={searchTxt}
                onChange={(e) => setSearchTxt(e.target.value)}
                placeholder={"Search"}
                name="mobile-search-candidate"
                id="mobile-search-candidate"
                className="search-bar block h-[38px] w-full rounded-md border-[1px] border-gray-300 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:hidden"
              />
              <input
                type="text"
                value={searchTxt}
                onChange={(e) => setSearchTxt(e.target.value)}
                placeholder={"Search"}
                name="desktop-search-candidate"
                id="desktop-search-candidate"
                className="search-bar hidden h-[38px] w-full rounded-md border-[1px] border-gray-300 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:block sm:text-sm"
              />
            </div>
          </div>
        </div>
        {(localStorage.getItem('role').includes('admin') || localStorage.getItem('role').includes('normal') || localStorage.getItem("role").includes("Sales Team Member")) && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <NavLink
              className="block flex items-center rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              to={"/dashboard/orders/edit"}
              state={null}
            >
              <PlusCircleIcon width={20} className="mr-1 text-white" />
              {"New Order"}
            </NavLink>
          </div>
        )}

      </div>
      <div className="mt-4  rounded-md sm:-mx-0 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className={`text-xs text-gray-700 uppercase dark:text-gray-400 bg-blue-500`}>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
              >
                No
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
              >
                OrderID
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800 "
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800 "
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800 "
              >
                Product Service
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800 "
              >
                Order Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
              >
                Due Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
              >
              </th>
            </tr>
          </thead>
          <tbody className="border-b border-gray-200 dark:border-gray-700 ">
            {orders &&
              filterOrders.map((order, index) => (
                <tr key={index} className='border-b border-gray-200 dark:border-gray-700 ml-3'>
                  <td className="whitespace-nowrap py-4 text-sm text-gray-800 text-center">
                    <dl className="font-medium">
                      <dt className="sr-only">Order</dt>
                      <dd className="mt-1 truncate text-[15px] text-gray-700">
                        {index + 1}
                      </dd>
                    </dl>
                  </td>
                  <NavLink to={"/dashboard/orders/view"} state={order}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800 text-center ml-2">
                      <dl className="font-medium">
                        <dt className="sr-only">Order</dt>
                        <dd className="mt-1 truncate text-[15px] text-gray-700">
                          {order.title}
                        </dd>
                      </dl>
                    </td>
                  </NavLink>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                    <dl className="font-medium">
                      <dt className="sr-only">Order</dt>
                      <dd className="mt-1 truncate text-[15px] text-gray-700">
                        {order.order_id}
                      </dd>
                    </dl>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                    <dl className="font-medium">
                      <dt className="sr-only">Order</dt>
                      <dd className="mt-1 truncate text-[15px] text-gray-700">
                        {order.order_id}
                      </dd>
                    </dl>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                    {order.hold === 0 ? (
                      parseInt(order.status) === 1 ? (
                        <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            className="h-1.5 w-1.5 fill-red-500"
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          Pending Review
                        </span>
                      ) : parseInt(order.status) === 2 ? (
                        <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            className="h-1.5 w-1.5 fill-yellow-500"
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          Pre-Production
                        </span>
                      ) : parseInt(order.status) === 3 ? (
                        <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            className="h-1.5 w-1.5 fill-green-500"
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          Ready for Production
                        </span>
                      ) : parseInt(order.status) === 4 ? (
                        <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            className="h-1.5 w-1.5 fill-blue-500"
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          In Production
                        </span>
                      ) : parseInt(order.status) === 5 ? (
                        <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            className="h-1.5 w-1.5 fill-blue-500"
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          Complete
                        </span>
                      ) : parseInt(order.status) === 6 ? (
                        <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            className="h-1.5 w-1.5 fill-indigo-500"
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          Final Inspection
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                          <svg
                            className="h-1.5 w-1.5 fill-indigo-500"
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                          >
                            <circle cx={3} cy={3} r={3} />
                          </svg>
                          Ready for pickup/ship
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                        <svg
                          className="h-1.5 w-1.5 fill-indigo-500"
                          viewBox="0 0 6 6"
                          aria-hidden="true"
                        >
                          <circle cx={3} cy={3} r={3} />
                        </svg>
                        Holding
                      </span>
                    )}

                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 ">
                    {order.price !== 0 ? '$' + order.price : '-------'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 ">
                    {serviceTypeList[order.service_type].name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800 ">
                    {order.date && (
                      <ReactTimeAgo
                        date={Date.parse(order.date)}
                        locale="en-US"
                        className="mr-2 font-bold"
                      />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                    {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }).replaceAll('/', '.')}

                  </td>


                  <td className="whitespace-nowrap px-3  py-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex">

                      <DropDown
                        onDelete={() =>
                          deleteComfirm({
                            id: order._id,
                            name: order.title,
                          })
                        }

                      // onEdit={() => {
                      //   navigate(`/dashboard/order/edit/${order._id}`);
                      //   // navigate("/dashboard/orders/edit");

                      // }}
                      />
                      <NavLink to={"/dashboard/orders/view"} state={order}>
                        <EyeIcon
                          width={20}
                          height={20}
                          className="ml-2 text-gray-700"
                        />
                      </NavLink>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div >
      <div className="flex items-center justify-end bg-white px-1 py-3 sm:px-4">
        <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700">
              showing
              <span className="font-medium">
                {total ? (currentPage - 1) * perPage + 1 : 0}
              </span>{" "}
              to
              <span className="font-medium">
                {currentPage === totalPages
                  ? total
                  : total
                    ? currentPage * perPage
                    : 0}
              </span>{" "}
              of <span className="font-medium">{total}</span> results
            </p>
          </div>
          <div>
            <CustomPagination
              totalPage={totalPages}
              currentPage={currentPage}
              onSetPage={onSetPage}
              loadingData={loadingData}
            />
          </div>
        </div>
      </div>
    </div >
  );
}
