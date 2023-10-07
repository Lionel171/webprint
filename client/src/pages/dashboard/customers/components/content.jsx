import { useState } from 'react';
import { MagnifyingGlassIcon, PlusCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ReactTimeAgo from 'react-time-ago';
import DropDown from '@/components/dashboard/users/Dropdown';
import { SelectMenu, SelectNoSearch } from '@/components/common/Select';

import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import UserPermitModal from './userPermitModal';
const statusList = [
    { id: 0, name: "request" },
    { id: 1, name: "permit" },
]
export default function Content({
    users,
    editFunction,
    deleteFunction,
    searchTxt,
    setSearchTxt,
    isAdmin,
}) {
    const navigate = useNavigate();
    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavColor } = controller;
    const [openUserPermitModal, setOpenUserPermitModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState({})
    const [selectedStatus, setSelectedStatus] = useState('');

    const editItem = id => {
        editFunction(id);
    };

    const deleteComfirm = id => {
        deleteFunction(id);
    };
    // pending users length
    const pending_len = users.filter(user => (user.role[0] === "normal" && user.user_status === "request")).length;
    // permit users length
    const permit_len = users.filter(user => (user.role[0] === "normal" && user.user_status === "permit")).length;
    // cancel users length
    const cancel_len = users.filter(user => (user.role[0] === "normal" && user.user_status === "cancel")).length;

    const rowCount = 10;
    //pending users pagenagion
    const pending_disCount = 5;
    const pending_pageCount = Math.ceil(pending_len / 10);
    const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
    let pending_pages = [];
    if (pending_pageCount < pending_disCount) for (let i = 1; i <= pending_pageCount; i++) pending_pages.push(i);
    else if (pending_pageCount - pendingCurrentPage + 1 <= pending_disCount)
        for (let i = pending_pageCount - pending_disCount + 1; i <= pending_pageCount; i++) pending_pages.push(i);
    else {
        let st = pendingCurrentPage;
        if (st > pending_pageCount - pending_disCount) st = pending_pageCount - pending_disCount + 1;
        for (let i = st; i <= st + 1; i++) pending_pages.push(i);
        pending_pages.push('...');
        for (let i = pending_pageCount - 1; i <= pending_pageCount; i++) pending_pages.push(i);
    }

    const pending_setPage = page => {
        if (typeof page === 'number') setPendingCurrentPage(page);
    };

    const pending_nextPage = () => {
        if (pendingCurrentPage < pending_pageCount) setPendingCurrentPage(pendingCurrentPage + 1);
    };

    const pending_previousPage = () => {
        if (pendingCurrentPage > 1) setPendingCurrentPage(pendingCurrentPage - 1);
    };

    //permit users pagenagion
    const permit_disCount = 5;
    const permit_pageCount = Math.ceil(permit_len / 10);
    const [permitCurrentPage, setPermitCurrentPage] = useState(1);
    let permit_pages = [];
    if (permit_pageCount < permit_disCount) for (let i = 1; i <= permit_pageCount; i++) permit_pages.push(i);
    else if (permit_pageCount - permitCurrentPage + 1 <= permit_disCount)
        for (let i = permit_pageCount - permit_disCount + 1; i <= permit_pageCount; i++) permit_pages.push(i);
    else {
        let st = permitCurrentPage;
        if (st > permit_pageCount - permit_disCount) st = permit_pageCount - permit_disCount + 1;
        for (let i = st; i <= st + 1; i++) permit_pages.push(i);
        permit_pages.push('...');
        for (let i = permit_pageCount - 1; i <= permit_pageCount; i++) permit_pages.push(i);
    }

    const permit_setPage = page => {
        if (typeof page === 'number') setPermitCurrentPage(page);
    };

    const permit_nextPage = () => {
        if (permitCurrentPage < permit_pageCount) setPermitCurrentPage(permitCurrentPage + 1);
    };

    const permit_previousPage = () => {
        if (permitCurrentPage > 1) setPermitCurrentPage(permitCurrentPage - 1);
    };
    //cancel users pagenagion
    const cancel_disCount = 5;
    const cancel_pageCount = Math.ceil(cancel_len / 10);
    const [cancelCurrentPage, setCancelCurrentPage] = useState(1);
    let cancel_pages = [];
    if (cancel_pageCount < cancel_disCount) for (let i = 1; i <= cancel_pageCount; i++) cancel_pages.push(i);
    else if (cancel_pageCount - cancelCurrentPage + 1 <= cancel_disCount)
        for (let i = cancel_pageCount - cancel_disCount + 1; i <= cancel_pageCount; i++) cancel_pages.push(i);
    else {
        let st = cancelCurrentPage;
        if (st > cancel_pageCount - cancel_disCount) st = cancel_pageCount - cancel_disCount + 1;
        for (let i = st; i <= st + 1; i++) cancel_pages.push(i);
        cancel_pages.push('...');
        for (let i = cancel_pageCount - 1; i <= cancel_pageCount; i++) cancel_pages.push(i);
    }

    const cancel_setPage = page => {
        if (typeof page === 'number') setCancelCurrentPage(page);
    };

    const cancel_nextPage = () => {
        if (cancelCurrentPage < cancel_pageCount) setCancelCurrentPage(cancelCurrentPage + 1);
    };

    const cancel_previousPage = () => {
        if (cancelCurrentPage > 1) setCancelCurrentPage(cancelCurrentPage - 1);
    };

    //
    const pending_users = users.filter(user => (user.role[0] === "normal" && user.user_status === "request")).slice((pendingCurrentPage - 1) * rowCount, pendingCurrentPage * rowCount);
    const permit_users = users.filter(user => (user.role[0] === "normal" && user.user_status === "permit")).slice((permitCurrentPage - 1) * rowCount, permitCurrentPage * rowCount);
    const cancel_users = users.filter(user => (user.role[0] === "normal" && user.user_status === "cancel")).slice((cancelCurrentPage - 1) * rowCount, cancelCurrentPage * rowCount);


    // const uusers = users.slice((currentPage - 1) * rowCount, currentPage * rowCount);

    const openPermitModal = (user, status) => {
        setSelectedStatus(status.name)
        setSelectedUser(user)
        setOpenUserPermitModal(true);
    }
    const handlePermitModalClose = () => {
        setOpenUserPermitModal(false)
    }
    return (
        localStorage.getItem('role') === "admin" && (
            <div className="lg:px-2">

                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base text-xl font-semibold leading-6 text-gray-900">
                            Users
                        </h1>
                    </div>

                    <div className="mt-3 w-full sm:mt-0 sm:ml-4 sm:w-[366.484px]">
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

                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <NavLink
                            className="block flex items-center rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            to={"/dashboard/customers/edit/new"}
                            state={null}
                        >
                            <PlusCircleIcon width={20} className="mr-1 text-white" />
                            {"Add Customer"}
                        </NavLink>
                    </div>

                </div>
                <hr></hr>
                <div className="sm:flex-auto mt-4">
                    <h2 className="text-base text-xl font-semibold leading-6 text-gray-900">
                        Pending...
                    </h2>
                </div>
                <div className="mt-4  rounded-md sm:-mx-0">
                    <table className="min-w-full divide-y divide-gray-300 rounded-md border-t  sm:border">
                        <thead className={`bg-blue-400 text-white`}>
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Company Name
                                </th>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Name
                                </th>

                                <th
                                    scope="col"
                                    className="px-2 py-3.5 text-left text-sm font-semibold "
                                >
                                    Email
                                </th>
                                {/* <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Role
                                </th> */}
                                {/* <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Role
                                </th> */}
                                <th
                                    scope="col"
                                    className="px-2 py-3.5 text-left text-sm font-semibold "
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-2 py-3.5 text-left text-sm  font-semibold sm:block"
                                >
                                    Created Date
                                </th>
                                <th
                                    scope="col"
                                    className="relative py-3.5 pl-0 pr-3 sm:pr-6"
                                ></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 !border-b  !border-gray-200 bg-white">
                            {pending_users.map((user, index) => (
                                <tr key={index} className='hover:bg-indigo-50'>
                                    <Link to={`/dashboard/customers/edit/${user._id}`}>
                                        <td className="w-full max-w-0 px-1 py-4 pl-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none">
                                            <dl className="font-medium">
                                                <dt className="sr-only">Name</dt>
                                                <dd className="mt-1 truncate text-[15px] text-gray-700">
                                                    {user.name}
                                                </dd>
                                            </dl>
                                        </td>
                                    </Link>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.contact_person}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.email}
                                    </td>
                                    {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.role}
                                    </td> */}
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.user_status === "permit" ? (
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {user.user_status}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                {user.user_status}
                                            </span>
                                        )}

                                        {/* <SelectNoSearch
                      labelName={''}
                      onChange={(item) => {
                        openPermitModal(user, item);
                      }
                      }
                      value={user.user_status}
                      // defaultValue={priority}
                      items={statusList}
                      isStatus={true}
                    /> */}
                                    </td>
                                    <td className="hidden whitespace-nowrap py-4 px-3 text-sm font-medium sm:block">
                                        {user.created_at && (
                                            <ReactTimeAgo
                                                date={Date.parse(user.created_at)}
                                                locale="en-US"
                                                className="mr-2 font-bold"
                                            />
                                        )}
                                    </td>

                                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium sm:pr-6">
                                        <DropDown
                                            onDelete={() =>
                                                deleteComfirm({
                                                    id: user._id,
                                                    name: user.name,
                                                })
                                            }
                                            onEdit={() => {
                                                navigate(`/dashboard/customers/edit/${user._id}`);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-end bg-white px-1 py-3 sm:px-4">
                        <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <p className="text-sm text-gray-700"></p>
                            </div>
                            <div>
                                <nav
                                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                    aria-label="Pagination"
                                >
                                    <a
                                        onClick={() => pending_previousPage()}
                                        className={`relative inline-flex cursor-pointer items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 
          ${pendingCurrentPage === 1 ? " text-gray-400" : " text-gray-700"}`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                    {pending_pages.map((i) => (
                                        <a
                                            key={i}
                                            onClick={() => pending_setPage(i)}
                                            className={`max-[340px]:hidden relative inline-flex cursor-pointer items-center px-4 py-2 text-sm font-semibold 
            ${i === pendingCurrentPage
                                                    ? " z-10 border border-blue-600 bg-blue-50 text-blue-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                    : " text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                }`}
                                        >
                                            {i}
                                        </a>
                                    ))}
                                    <a
                                        onClick={() => pending_nextPage()}
                                        className={`relative inline-flex cursor-pointer items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 
          ${pendingCurrentPage === pending_pageCount
                                                ? " text-gray-400"
                                                : " text-gray-700"
                                            }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* -------permit users--------------- */}
                <hr></hr>
                <div className="sm:flex-auto mt-4 pt-5">
                    <h2 className="text-base text-xl font-semibold leading-6 text-gray-900">
                        Permit
                    </h2>
                </div>
                <div className="mt-4  rounded-md sm:-mx-0">
                    <table className="min-w-full divide-y divide-gray-300 rounded-md border-t  sm:border">
                        <thead className={`bg-green-400 text-white`}>
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Company Name
                                </th>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Name
                                </th>

                                <th
                                    scope="col"
                                    className="px-2 py-3.5 text-left text-sm font-semibold "
                                >
                                    Email
                                </th>
                                {/* <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Role
                                </th> */}
                                <th
                                    scope="col"
                                    className="px-2 py-3.5 text-left text-sm font-semibold "
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-2 py-3.5 text-left text-sm  font-semibold sm:block"
                                >
                                    Created Date
                                </th>
                                <th
                                    scope="col"
                                    className="relative py-3.5 pl-0 pr-3 sm:pr-6"
                                ></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 !border-b  !border-gray-200 bg-white">
                            {permit_users.map((user, index) => (
                                <tr key={index} className='hover:bg-indigo-50'>
                                    <Link to={`/dashboard/customers/edit/${user._id}`}>
                                        <td className="w-full max-w-0 px-1 py-4 pl-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none">
                                            <dl className="font-medium">
                                                <dt className="sr-only">Name</dt>
                                                <dd className="mt-1 truncate text-[15px] text-gray-700">
                                                    {user.name}
                                                </dd>
                                            </dl>
                                        </td>
                                    </Link>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.contact_person}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.email}
                                    </td>
                                    {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.role}
                                    </td> */}
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.user_status === "permit" ? (
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {user.user_status}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                {user.user_status}
                                            </span>
                                        )}

                                        {/* <SelectNoSearch
                      labelName={''}
                      onChange={(item) => {
                        openPermitModal(user, item);
                      }
                      }
                      value={user.user_status}
                      // defaultValue={priority}
                      items={statusList}
                      isStatus={true}
                    /> */}
                                    </td>
                                    <td className="hidden whitespace-nowrap py-4 px-3 text-sm font-medium sm:block">
                                        {user.created_at && (
                                            <ReactTimeAgo
                                                date={Date.parse(user.created_at)}
                                                locale="en-US"
                                                className="mr-2 font-bold"
                                            />
                                        )}
                                    </td>

                                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium sm:pr-6">
                                        <DropDown
                                            onDelete={() =>
                                                deleteComfirm({
                                                    id: user._id,
                                                    name: user.name,
                                                })
                                            }
                                            onEdit={() => {
                                                navigate(`/dashboard/customers/edit/${user._id}`);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-end bg-white px-1 py-3 sm:px-4">
                        <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <p className="text-sm text-gray-700"></p>
                            </div>
                            <div>
                                <nav
                                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                    aria-label="Pagination"
                                >
                                    <a
                                        onClick={() => permit_previousPage()}
                                        className={`relative inline-flex cursor-pointer items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 
          ${permitCurrentPage === 1 ? " text-gray-400" : " text-gray-700"}`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                    {permit_pages.map((i) => (
                                        <a
                                            key={i}
                                            onClick={() => permit_setPage(i)}
                                            className={`max-[340px]:hidden relative inline-flex cursor-pointer items-center px-4 py-2 text-sm font-semibold 
            ${i === permitCurrentPage
                                                    ? " z-10 border border-blue-600 bg-blue-50 text-blue-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                    : " text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                }`}
                                        >
                                            {i}
                                        </a>
                                    ))}
                                    <a
                                        onClick={() => permit_nextPage()}
                                        className={`relative inline-flex cursor-pointer items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 
          ${permitCurrentPage === permit_pageCount
                                                ? " text-gray-400"
                                                : " text-gray-700"
                                            }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* -------Cancle users--------------- */}
                <hr></hr>
                <div className="sm:flex-auto mt-4 pt-5">
                    <h2 className="text-base text-xl font-semibold leading-6 text-gray-900">
                        Cancel
                    </h2>
                </div>
                <div className="mt-4  rounded-md sm:-mx-0">
                    <table className="min-w-full divide-y divide-gray-300 rounded-md border-t  sm:border">
                        <thead className={`bg-red-400 text-white`}>
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Company Name
                                </th>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Name
                                </th>

                                <th
                                    scope="col"
                                    className="px-2 py-3.5 text-left text-sm font-semibold "
                                >
                                    Email
                                </th>
                                {/* <th
                                    scope="col"
                                    className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                                >
                                    Role
                                </th> */}
                                <th
                                    scope="col"
                                    className="px-2 py-3.5 text-left text-sm font-semibold "
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-2 py-3.5 text-left text-sm  font-semibold sm:block"
                                >
                                    Created Date
                                </th>
                                <th
                                    scope="col"
                                    className="relative py-3.5 pl-0 pr-3 sm:pr-6"
                                ></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 !border-b  !border-gray-200 bg-white">
                            {cancel_users.map((user, index) => (
                                <tr key={index} className='hover:bg-indigo-50'>
                                    <Link to={`/dashboard/customers/edit/${user._id}`}>
                                        <td className="w-full max-w-0 px-1 py-4 pl-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none">
                                            <dl className="font-medium">
                                                <dt className="sr-only">Name</dt>
                                                <dd className="mt-1 truncate text-[15px] text-gray-700">
                                                    {user.name}
                                                </dd>
                                            </dl>
                                        </td>
                                    </Link>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.contact_person}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.email}
                                    </td>
                                    {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.role}
                                    </td> */}
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                                        {user.user_status === "permit" ? (
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {user.user_status}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                {user.user_status}
                                            </span>
                                        )}

                                        {/* <SelectNoSearch
                      labelName={''}
                      onChange={(item) => {
                        openPermitModal(user, item);
                      }
                      }
                      value={user.user_status}
                      // defaultValue={priority}
                      items={statusList}
                      isStatus={true}
                    /> */}
                                    </td>
                                    <td className="hidden whitespace-nowrap py-4 px-3 text-sm font-medium sm:block">
                                        {user.created_at && (
                                            <ReactTimeAgo
                                                date={Date.parse(user.created_at)}
                                                locale="en-US"
                                                className="mr-2 font-bold"
                                            />
                                        )}
                                    </td>

                                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium sm:pr-6">
                                        <DropDown
                                            onDelete={() =>
                                                deleteComfirm({
                                                    id: user._id,
                                                    name: user.name,
                                                })
                                            }
                                            onEdit={() => {
                                                navigate(`/dashboard/customers/edit/${user._id}`);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-end bg-white px-1 py-3 sm:px-4">
                        <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <p className="text-sm text-gray-700"></p>
                            </div>
                            <div>
                                <nav
                                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                    aria-label="Pagination"
                                >
                                    <a
                                        onClick={() => cancel_previousPage()}
                                        className={`relative inline-flex cursor-pointer items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 
          ${cancelCurrentPage === 1 ? " text-gray-400" : " text-gray-700"}`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                    {cancel_pages.map((i) => (
                                        <a
                                            key={i}
                                            onClick={() => cancel_setPage(i)}
                                            className={`max-[340px]:hidden relative inline-flex cursor-pointer items-center px-4 py-2 text-sm font-semibold 
            ${i === cancelCurrentPage
                                                    ? " z-10 border border-blue-600 bg-blue-50 text-blue-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                    : " text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                }`}
                                        >
                                            {i}
                                        </a>
                                    ))}
                                    <a
                                        onClick={() => cancel_nextPage()}
                                        className={`relative inline-flex cursor-pointer items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 
          ${cancelCurrentPage === cancel_pageCount
                                                ? " text-gray-400"
                                                : " text-gray-700"
                                            }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <UserPermitModal
                    type={selectedStatus}
                    open={openUserPermitModal}
                    user={selectedUser}
                    handleClose={handlePermitModalClose}
                />
            </div>
        )

    );
}