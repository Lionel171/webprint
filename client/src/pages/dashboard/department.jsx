import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  Input,
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";

import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

import { authorsTableData, projectsTableData } from "@/data";
import UserService from "@/services/user-service";
import DepartmentService from "@/services/department-service";
import DefaultImage from '../../../public/img/default_avatar.png';
import ConfirmModal from "@/components/common/comfirmModal";
import EditModal from "@/components/common/EditModal";


const API_URL = process.env.API_URL;



export function Department() {
  const [users, setUsers] = useState([]);
  const [departmentList, setDepartmentList] = useState({
    name: '',
  });
  const [SelectedepartDmentId, setSelectedDepartmentId] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
  const [edited, setEdited] = useState(false);

  const [departmentTypeList, setDepartmentTypeList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await UserService.getUserList();
      setUsers(response.entities);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await DepartmentService.getDepartments();
      setDepartmentTypeList(response.department);
    }
    fetchData();
  }, [departmentList, isDelete, isEdit])

  const saveDepartment = () => {
    async function addDepartment() {
      const response = await DepartmentService.addDepartment(departmentList);
    }

    addDepartment();
    setDepartmentList({ name: "" })
  }

  const deleteComfirm = (department) => {
    deleteFunction(department);
  };

  const deleteFunction = department => {
    setSelectedDepartmentId(department.id);
    setConfirmMessage("Are you going to precess this action");
    setIsConfirm(true);
  };

  const handleClose = () => {
    setIsConfirm(false);
    setIsEdit(false);

  }

  const editComfirm = (department) => {
    editFunction(department);
  };

  const editFunction = department => {
    setSelectedDepartmentId(department.id);
    setSelectedDepartmentName(department.name);
    setIsEdit(true);
  };

  const controlEdit = async () => {
    setEdited(true);
    setIsEdit(false);
  }


  const controlAction = async () => {
    try {
      const response = await DepartmentService.deleteDepartment(SelectedepartDmentId);
      if (response.state) {
        setIsDelete(true);
      }
      setIsConfirm(false);

    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Add Department
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="ml-10 pi-10 mt-5 flex justify-center items-center grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3 mb-10" >
              <Input
                onChange={(e) => {
                  setDepartmentList({ name: e.target.value });
                }}
                value={departmentList.name}
                maxLength={50}
              />
            </div>
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900 mb-10"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={saveDepartment}
              className="mb-10 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Save
            </button>
          </div>
        </CardBody>

      </Card>
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Manegers Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["name", "department", "role", "employed", "", ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.filter(user => (user.role.includes("Sales Manager") || user.role.includes("Artwork Manager") || user.role.includes("Project Manager"))).map(
                (user, key) => {
                  const className = `py-3 px-5 ${key === users.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={user._id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={user.profile_image ? API_URL + '/' + user.profile_image : DefaultImage} alt={user.contact_person} size="sm" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {user.contact_person}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {user.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user.department}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user.role.join(', ')}
                        </Typography>
                      </td>
                      {/* <td className={className}>
                        <Chip
                          variant="gradient"
                          color={ ? "green" : "blue-gray"}
                          value={online ? "online" : "offline"}
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      </td> */}
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }).replaceAll('/', '.')}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Link to={`/dashboard/users/edit/${user._id}`}>
                          <PencilSquareIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
                        </Link>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Departments
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["department", "members", "staffs", ""].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {departmentTypeList.map(
                (department, key) => {
                  const className = `py-3 px-5 ${key === departmentTypeList.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={department._id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          {/* <Avatar src={img} alt={name} size="sm" /> */}
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {department.name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        {users.filter(user => user.department === department.name).map((member, key) => (
                          <Tooltip key={member._id} content={member.contact_person}>
                            <Avatar
                              src={member.profile_image ? API_URL + '/' + member.profile_image : DefaultImage}
                              alt={member.contact_person}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${key === 0 ? "" : "-ml-2.5"
                                }`}
                            />
                          </Tooltip>
                        ))}
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {users.filter(user => user.department === department.name).length}
                        </Typography>
                      </td>
                      {/* <td className={className}>
                        <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                          >
                            {completion}%
                          </Typography>
                          <Progress
                            value={completion}
                            variant="gradient"
                            color={completion === 100 ? "green" : "blue"}
                            className="h-1"
                          />
                        </div>
                      </td> */}
                      <td className={className}>

                        <TrashIcon
                          onClick={() =>
                            deleteComfirm({
                              id: department._id,
                              name: department.name,
                            })
                          }
                          strokeWidth={2}
                          className="h-5 w-5 text-inherit"
                        />

                      </td>

                      <td>
                        <PencilSquareIcon
                          onClick={() =>
                            editComfirm({
                              id: department._id,
                              name: department.name,
                            })
                          }
                          strokeWidth={2}
                          className="h-5 w-5 text-inherit"
                        />
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <ConfirmModal
        open={isConfirm}
        deleteItem={controlAction}
        handleClose={handleClose}
        message={confirmMessage}
      />
      <EditModal
        open={isEdit}
        editItem={controlEdit}
        handleClose={handleClose}
        name={selectedDepartmentName}
        id={SelectedepartDmentId}
      />
    </div>
  );
}

export default Department;
