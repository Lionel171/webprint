import { Fragment, useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { SelectNoSearch } from '@/components/common/Select';
import AuthService from "@/services/auth-service";


import { AuthContext } from "@/context";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function SelectModal(props) {
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState([]);
    const authContext = useContext(AuthContext);

    const handleClose = () => {
        // setDisable(false);
        props.handleClose();
    };

    const editData = async () => {
        try {
       
            const response = await AuthService.login(props.user);
            if (response.user.user_status === "permit") {

                authContext.login(response.accessToken, role, response.user.contact_person, response.user.email, response.user._id);

            }

        } catch (err) {
            console.log(err)
        }

        props.editItem();
        setOpen(false)

    };
    // const handleChange = () => {
    //     setDisable(!disable);
    // };
    useEffect(() => {
        const temp_roles = [];
        props.roles.map((role, index) => {
            temp_roles[index] = { id: index, name: role };
        })

        setRoles(temp_roles)
        setOpen(props.open);
    }, [props.open]);

    useEffect(() => {

    }, [])

    const onChangeRoles = (item) => {
        const temp_item = []
        temp_item.push(item.name)
        setRole(temp_item);
    }

    return (
        <Transition.Root show={open} as={Fragment} >
            <Dialog as='div' className='relative z-30' onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
                </Transition.Child>

                <div className='fixed inset-0 z-10 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 w-full text-center sm:items-center sm:p-0'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                            enterTo='opacity-100 translate-y-0 sm:scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                        >
                            <Dialog.Panel className='relative transform  w-full overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                                <div className='absolute top-0 right-0 hidden pt-2 pr-4 sm:block'>
                                    <button
                                        type='button'
                                        className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                        onClick={handleClose}
                                    >
                                        <span className='sr-only'>close</span>
                                        <XMarkIcon className='h-6 w-6 text-black' aria-hidden='true' />
                                    </button>
                                </div>
                                <div className='sm:flex sm:items-start sm:mb-3'>
                                    {/* <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                                        <ExclamationTriangleIcon className='h-6 w-6 text-red-600' aria-hidden='true' />
                                    </div> */}
                                    <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                                        <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                            Select the role you want to log in.
                                        </Dialog.Title>
                                        <div className='mt-2 w-full '>
                                            <p className='text-sm text-gray-500'>
                                                {/* {props.message} */}
                                            </p>
                                        </div>
                                        <div className='flex h-5 items-center justify-center mt-10 mb-[160px] '>

                                            <SelectNoSearch
                                                labelName={'Your Roles'}
                                                onChange={(item) =>
                                                    onChangeRoles(item)
                                                }
                                                // value={customer}
                                                items={roles}
                                            // error={customerFlag}
                                            // disabled={isView}
                                            />

                                            {/* <p className='text-sm text-gray-500'>Please confirm before precess</p> */}
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                                    <button
                                        type='button'
                                        // disabled={!disable}
                                        onClick={editData}
                                        className={classNames(
                                            'inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                                            'bg-red-200 '
                                        )}
                                    >
                                        Ok
                                    </button>
                                    <button
                                        type='button'
                                        className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm'
                                        onClick={() => handleClose(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}