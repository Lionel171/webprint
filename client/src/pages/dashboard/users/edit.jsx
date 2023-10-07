/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import Input from '@/components/common/Input';
import { MinusCircleIcon, PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useState, useRef } from 'react';
import DefaultImage from '../../../../public/img/default.png';
import UserService from "@/services/user-service"
import { SelectNoSearch } from '@/components/common/Select';
import { useParams, Link } from 'react-router-dom';
import { useNavigate, Router } from 'react-router-dom';
import authService from '@/services/auth-service';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import DepartmentService from "@/services/department-service";


const userTypeList = [
  { id: 0, name: "" },
  { id: 1, name: "Admin" },
  { id: 2, name: "Sales Manager" },
  { id: 3, name: "Sales Team Member" },
  { id: 4, name: "Artwork Manager" },
  { id: 5, name: "Artwork Staff" },
  { id: 6, name: "Production Manager" },
  { id: 7, name: "Production Staff" },
  // { id: 7, name: "Customer Relation" },
];
// const departmentTypeList = [
//   { id: 0, name: "", value: "" },
//   { id: 1, name: "Screen Print", value: "screen_print" },
//   { id: 2, name: "We Print DTF", value: "we_print_dtf" },
//   { id: 3, name: "Gang Sheet", value: "gang_sheet" },
//   { id: 4, name: "Signs & Banners", value: "signs_banners" },
//   { id: 5, name: "Embroidery", value: "embroidery" },
//   { id: 6, name: "Vinyl Transfer", value: "vinly_transfer" },
//   { id: 7, name: "Sublimation", value: "sublimation" }
// ];
const statusList = [
  { id: 0, name: "request" },
  { id: 1, name: "permit" },
  { id: 2, name: "cancel" }
]
const userRoleList = [
  { id: 0, name: "Admin" },
  { id: 1, name: "Sales Manager" },
  { id: 2, name: "Artwork Manager" },
  { id: 3, name: "Artwork Team Member" },
  { id: 3, name: "Production Manager" },
];
export function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [avatarFile, setAvatarFile] = useState();
  const avatarFileRef = useRef();
  const [avatarPhoto, setAvatarPhoto] = useState('');
  const API_URL = process.env.API_URL;
  const [user, setUser] = useState({
    email: "",
    profile_image: "",
    contact_person: "",
    company_name: "",
    role: [""],
    user_status: "",
    phone: "",
    address: "",
    reseller_id: "",
    name: ""
  });
  const [departmentTypeList, setDepartmentTypeList] = useState([]);


  const [isChangedStatus, setIsChangedStatus] = useState(false)


  const [errors, setErrors] = useState({
    nameError: false,
    emailError: false,
    contactPersonError: false,
    phoneError: false,
    addressError: false,
    resellerIdError: false,
    agreeError: false,
    error: false,
    passwordError: false,
  });

  useEffect(() => {
    async function fetchData() {
      const response = await DepartmentService.getDepartments();
      setDepartmentTypeList(response.department);
    }
    fetchData();
  }, [])
  const addRole = () => {
    setUser(prevUser => ({ ...prevUser, role: [...prevUser.role, ""] }));
  }
  const onDeleteButton = (index) => {
    setUser(prevUser => {
      const temp = prevUser.role.filter((button, subIndex) => index !== subIndex);
      return { ...prevUser, role: temp };
    });
  };
  const onChangeAvatarPhoto = event => {
    if (event.target.files && event.target.files[0]) {
      setAvatarFile(event.target.files[0]);
      let reader = new FileReader();
      reader.onload = event => {
        setAvatarPhoto(event.target.result);
        // setUser({
        //   ...user,
        //   profile_image: event.target.result
        // })
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const avatarImageClick = () => {
    avatarFileRef.current.click();
  };

  const updateUser = async () => {
    let flag = true;
    if (user.name === '') {
      flag = false;
      setErrors({
        ...errors,
        nameError: true
      })
    }
    if (user.email === '') {
      flag = false;
      setErrors({
        ...errors,
        emailError: true
      })
    }
    if (user.password === '') {
      flag = false;
      setErrors({
        ...errors,
        passwordError: true
      })
    }
    if (user.phone === "") {
      flag = false;
      setErrors({
        ...errors,
        phoneError: true
      })
    }
    if (!flag) {
      return;
    }

    let payload = {
      user: user,
    };

    if (avatarFile)
      payload.file = avatarFile
    if (id !== "new") {
      const response = await UserService.updateUser(payload);

    } else if (id === "new") {
      // const data = payload
      const response = await authService.registerStaff(payload.user);
      if (response) {
        if (isChangedStatus === true) {
          if (user.user_status === 'permit') {
            navigate("/dashboard/users");
            const messageData = {
              from: 'showstopperurbanwear@gmail.com',
              to: 'showstopperurbanwear@gmail.com',
              // to: user.email,
              subject: 'Hello ' + user.name + '.',
              text: 'Welcome! Your account are approved!'
            };
            const email_response = await UserService.sendEmail(messageData);
          } else if (user.user_status === "cancel") {
            navigate("/dashboard/users");
            const messageData = {
              from: 'showstopperurbanwear@gmail.com',
              to: 'showstopperurbanwear@gmail.com',
              // to: user.email,
              subject: 'Hello ' + user.name + '.',
              text: 'Sorry! Your account are not approved.!'
            };
            const email_response = await UserService.sendEmail(messageData);
            // navigate("/dashboard/users");
          }
        }
      }
    }
    navigate("/dashboard/users");

  }
  useEffect(() => {
    async function fetchData() {
      const response = await UserService.getUserById(id);
      setUser(response.user);
      //if (response.user.profile_image)
      //setAvatarPhoto(response.user.profile_image)
    }


    if (id && id !== "new")
      fetchData();
  }, [])

  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
            </div> */}
            {id !== "new" && (
              <div className="col-span-full">
                <div className="flex items-center gap-x-6">

                  <input
                    type="file"
                    onChange={onChangeAvatarPhoto}
                    hidden
                    ref={avatarFileRef}
                  />
                  <img
                    src={
                      avatarPhoto
                        ? avatarPhoto
                        : user.profile_image
                          ? API_URL + "/" + user.profile_image
                          : DefaultImage
                    }
                    alt="avatarImage"
                    onClick={avatarImageClick}
                    width={150}
                    height={150}
                    className="rounded-full"
                    style={{ objectFit: "contain" }}
                  />

                  <h1 style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                      {user.contact_person}
                    </div>
                    <div className="text-sm leading-6 text-gray-500">
                      {user.email}<span className="text-gray-700"></span>
                    </div>
                  </h1>
                </div>
              </div>
            )}


          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Input
                labelName={"Name"}
                onChange={(e) => {
                  setUser({
                    ...user,
                    contact_person: e.target.value,
                  })
                }}
                value={user.contact_person}
                error={errors.contact_person}
                maxLength={50}
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                labelName={"Company name"}
                onChange={(e) =>
                  setUser({
                    ...user,
                    name: e.target.value,
                  })
                }
                value={user.name}
                error={errors.name}
                maxLength={50}
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                labelName={"Email"}
                onChange={(e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  })
                }
                value={user.email}
                error={errors.email}
                maxLength={50}
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                labelName={"Phone"}
                onChange={(e) =>
                  setUser({
                    ...user,
                    phone: e.target.value,
                  })
                }
                value={user.phone}
                error={errors.phone}
                maxLength={50}
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                labelName={"Street address"}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: e.target.value,
                  })
                }
                value={user.address}
                error={errors.address}
                maxLength={50}
              />
            </div>
            <div className="sm:col-span-3">
              <SelectNoSearch
                labelName={"Department"}
                onChange={(item) => {
                  setUser({
                    ...user,
                    department: item.name,
                  });
                }}
                value={user.department}
                items={departmentTypeList}
                isStatus={true}
              />
            </div>
            {user.role.map((role, index) => {
              return (
                <>
                  <div key={index} className="sm:col-span-3">
                    <SelectNoSearch
                      labelName={`Role ${index + 1}`}
                      onChange={(item) => {
                        const updatedRoles = [...user.role];
                        updatedRoles[index] = item.name;
                        setUser({ ...user, role: updatedRoles });
                      }}
                      value={user.role[index]}
                      items={userTypeList}
                      isStatus={true}
                    />
                  </div>
                  {index > 0 ? (
                    <div className="items-end h-full w-[50px] mt-2 pt-4">
                      <MinusCircleIcon
                        className=" rounded-l-full text-red-400 w-[30px]  border-white border border-r-0 z-10"
                        onClick={() => onDeleteButton(index)}
                      />
                    </div>
                  ) : (
                    <div className="items-end h-full w-[50px] mt-2 pt-4">
                      <PlusCircleIcon
                        className=" rounded-l-full text-red-400 w-[30px]  border-white border border-r-0 z-10"
                        onClick={addRole}
                      />
                    </div>
                  )}
                  <br />

                </>
              )
            })}

            {id === "new" && (
              <>

                <div className="sm:col-span-3">
                  <Input
                    labelName={"Password"}
                    type="password"
                    onChange={(e) =>
                      setUser({
                        ...user,
                        password: e.target.value,
                      })
                    }
                    value={user.password}
                    error={errors.password}
                    maxLength={50}
                  />
                </div>
              </>

            )}




            {/* <div className="sm:col-span-3">
              <SelectNoSearch
                labelName={"User Status"}
                onChange={(item) => {
                  setUser({
                    ...user,
                    user_status: item.name,
                  });
                  setIsChangedStatus(true)
                }}
                value={user.user_status}
                items={statusList}
                isStatus={true}
              />
            </div> */}

            {/* <div className="sm:col-span-3">
              <SelectNoSearch
                labelName={"User Status"}
                onChange={(item) => {
                  setUser({
                    ...user,
                    role: item.name,
                  });
                }}
                value={user.role}
                items={userRoleList}
                isStatus={true}
              />
            </div> */}

            {/* <div className="sm:col-span-3 sm:col-start-1">
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Is Tax Exempt
              </legend>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-everything"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="push-everything"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Everything
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-email"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="push-email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Same as email
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-nothing"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="push-nothing"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    No push notifications
                  </label>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Orders</h2>
          <div className="mt-10 space-y-10">
            <table className='min-w-full border-t divide-y divide-gray-300 sm:border  rounded-md'>
              <thead className={`bg-blue-400 text-white`}>
                <tr>
                  <th scope='col' className='py-3.5 pl-4 text-left text-sm font-semibold  sm:pl-4'>
                    Name
                  </th>
                  <th scope='col' className='px-2 py-3.5 text-left text-sm font-semibold '>
                    Email
                  </th>
                  <th scope='col' className='px-2 py-3.5 text-left text-sm font-semibold '>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200  !border-b !border-gray-200'>
                {[0, 1].map((user, index) => (
                  <tr key={index}>
                    <td className='w-full px-1 py-4 pl-4 text-sm font-medium text-gray-900 max-w-0 sm:w-auto sm:max-w-none'>
                      <dl className='font-medium'>
                        <dt className='sr-only'>Name</dt>
                        <dd className='mt-1 text-[15px] text-gray-700 truncate'>
                          {user.name}
                        </dd>
                      </dl>
                    </td>
                    <td className='px-3 py-4 text-sm text-gray-800 whitespace-nowrap'>
                      {user.email}
                    </td>
                    <td className='px-3 py-4 text-sm text-gray-800 whitespace-nowrap'>
                      {user.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link
          to={`/dashboard/users`}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={updateUser}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default UserEdit;