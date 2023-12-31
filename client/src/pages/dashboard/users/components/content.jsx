import { useState } from 'react';
import { MagnifyingGlassIcon, PencilSquareIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import ReactTimeAgo from 'react-time-ago';
import DropDown from '@/components/dashboard/users/Dropdown';
import { SelectMenu, SelectNoSearch } from '@/components/common/Select';
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useNavigate, Router, Link, NavLink } from 'react-router-dom';
import UserPermitModal from './userPermitModal';
import DefaultImage from '../../../../../public/img/default_avatar.png';
import {
  Typography,
  Avatar,
} from "@material-tailwind/react";


const API_URL = process.env.API_URL;

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


  const len = users.filter(user => (!user.role.includes('admin') && !user.role.includes('normal'))).length;
  console.log(users.filter(user => (!user.role.includes('admin') && !user.role.includes('normal'))), 'staff numbers')
  const rowCount = 10;
  const disCount = 5;
  const pageCount = Math.ceil(len / 10);
  const [currentPage, setCurrentPage] = useState(1);
  let pages = [];
  if (pageCount < disCount) for (let i = 1; i <= pageCount; i++) pages.push(i);
  else if (pageCount - currentPage + 1 <= disCount)
    for (let i = pageCount - disCount + 1; i <= pageCount; i++) pages.push(i);
  else {
    let st = currentPage;
    if (st > pageCount - disCount) st = pageCount - disCount + 1;
    for (let i = st; i <= st + 1; i++) pages.push(i);
    pages.push('...');
    for (let i = pageCount - 1; i <= pageCount; i++) pages.push(i);
  }

  const setPage = page => {
    if (typeof page === 'number') setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < pageCount) setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const uusers = users.filter(user => (!user.role.includes('admin') && !user.role.includes("normal"))).slice((currentPage - 1) * rowCount, currentPage * rowCount);

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
              Staffs
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
          {/* {isAdmin ? ( */}
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none mb-2">
            <NavLink
              className="block flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              to={"/dashboard/users/edit/new"}
              state={null}
            >
              <PlusCircleIcon width={20} className="mr-1 text-white" />
              {"New Staff"}
            </NavLink>
          </div>

          {/* ) : null} */}
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 rounded-md border-t  sm:border">
            <thead className={`bg-blue-400 text-white`}>
              <tr>
                <th
                  scope="col"
                  className="truncate py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
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
                  className="px-2 py-3.5 text-left text-sm font-semibold sm:pl-4"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-2 py-3.5 text-left text-sm font-semibold "
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="truncate px-2 py-3.5 text-left text-sm  font-semibold "
                  style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}
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
              {uusers.map((user, index) => (
                <tr key={index} className='hover:bg-indigo-50'>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                    <Link to={`/dashboard/users/edit/${user._id}`}>
                      {user.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800 " >
                    <div className="flex-col items-center justify-center h-full">
                      <Avatar src={user.profile_image ? API_URL + '/' + user.profile_image : DefaultImage} alt={user.contact_person} size="sm" />
                      <div>
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {user.contact_person}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                    {user.role.join(', ')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
                    {user.department.join(', ')}
                  </td>
                  {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
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
                  {/* </td> */}
                  <td className=" whitespace-nowrap px-3 py-4 text-sm text-gray-800">
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
                        navigate(`/dashboard/users/edit/${user._id}`);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end bg-white px-1 py-3 sm:px-4">
          <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">

                showing {" "}
                <span className="font-medium">{len}</span> results

              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <a
                  onClick={() => previousPage()}
                  className={`relative inline-flex cursor-pointer items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 
          ${currentPage === 1 ? " text-gray-400" : " text-gray-700"}`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </a>
                {pages.map((i) => (
                  <a
                    key={i}
                    onClick={() => setPage(i)}
                    className={`max-[340px]:hidden relative inline-flex cursor-pointer items-center px-4 py-2 text-sm font-semibold 
            ${i === currentPage
                        ? " z-10 border border-blue-600 bg-blue-50 text-blue-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        : " text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                  >
                    {i}
                  </a>
                ))}
                <a
                  onClick={() => nextPage()}
                  className={`relative inline-flex cursor-pointer items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 
          ${currentPage === pageCount
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
