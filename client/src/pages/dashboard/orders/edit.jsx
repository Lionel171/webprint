
import Input from '@/components/common/Input';
import { PhotoIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useState, useRef } from 'react';
import DefaultImage from '../../../../public/img/upload.jpg';
import OrderService from "@/services/order-service"
import { SelectNoSearch } from '@/components/common/Select';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from "@heroicons/react/20/solid";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "@/context";
import Constant from '@/utils/constant';
import userService from '@/services/user-service';
import Spinner from '../../../../public/img/spinner.gif';
 
import Tiff from 'tiff.js'


const userTypeList = [
    { id: 0, name: "normal" },
    { id: 1, name: "admin" }
];
const statusList = [
    { id: 0, name: "request" },
    { id: 0, name: "permit" }
]

const paymentTypeList = [
    { id: 0, name: "", value: "" },
    { id: 1, name: "Credit Card", value: "card" },
    { id: 2, name: "PayPal", value: "paypal" }
]

export function OrderEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const authContext = useContext(AuthContext);
    const isAdmin = authContext.role === Constant.Admin ? true : false;
    const order = location.state;
    const [title, setTitle] = useState('');
    const [titleFlag, setTitleFlag] = useState(false);
    const [uploadFiles, setUplaodFiles] = useState([]);
    const [uploadFile, setUplaodFile] = useState([]);
    const avatarFileRef = useRef([]);
    const API_URL = process.env.API_URL;
    const [customer, setCustomer] = useState({});
    const [customerList, setCustomerList] = useState([]);
    const [customerFlag, setCustomerFlag] = useState(false);
    const [isView, setIsView] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedUploadId, setSelectedUploadId] = useState(0)
    const [isSave, setIsSave] = useState(false)
    const [isSpinner, setIsSpinner] = useState(false)

    const serviceTypeList = [
        { id: 0, name: "", value: "" },
        { id: 1, name: "Screen Peinr", value: "screen_print" },
        { id: 2, name: "We Print DTF", value: "we_print_dtf" },
        { id: 3, name: "Gang Sheet", value: "gang_sheet" },
        { id: 4, name: "Signs & Banners", value: "signs_bannersr" },
        { id: 5, name: "Embroidery", value: "embroidery" },
        { id: 6, name: "Vinyl Transfer", value: "vinyl_transfer" },
        { id: 7, name: "Sublimation", value: "sublimation" },
    ];

    const addOrder = (title, id) => {
        setIsSave(true);
        let order = {
            quantity: [""],
            size: [""],
            comment: '',
            payment_type: '',
            client_art_up: [null],
            files: [null],
            service_type: 0,
            serviceTypeFlag: false,
            paymentTypeFlag: false,
            quantityFlag: false,
            sizeFlag: false,
            idFlag: false,
            imgFlag: false,
        };
        let temp = [...orders, order];
        setUplaodFile([])
        setOrders(temp);
    };

    const addSize = (index) => {
        let tempOrders = [...orders];
        tempOrders[index].size.push("");
        tempOrders[index].quantity.push("");
        setOrders(tempOrders);

    };

    const AddUploadFile = (index) => {
        let tempOrders = [...orders];
        tempOrders[index].client_art_up.push(null);
        setOrders(tempOrders);
    }

    const onDeleteUploadFile = (index, i) => {
        let tempOrders = [...orders];
        tempOrders[index].client_art_up = tempOrders[index].client_art_up.filter((uploadfile, subindex) => subindex !== i);
        setOrders(tempOrders);
    };


    const onDeleteSize = (index) => {
        let tempOrders = [...orders];
        tempOrders[index].size.pop();
        tempOrders[index].quantity.pop();
        setOrders(tempOrders);
    };


    const onChangeImagePhoto = (event, index, i) => {

        if (event.target.files && event.target.files[0]) {
            let tempFile = [...uploadFile];
            let tempFiles = [...uploadFiles];


            // Push the selected files into the tempFile array
            console.log(event.target.files, event.target.files.length)

            for (let j = 0; j < event.target.files.length; j++) {
                tempFile[i] = event.target.files[j];
            }
            tempFiles[index] = tempFile;

            setUplaodFile(tempFile);
            setUplaodFiles(tempFiles);


            // Get the file extension
            const fileExtension = event.target.files[0].name.split('.').pop();

            // Check if the file is an image
            const isImage = event.target.files[0].type.startsWith('image/');

            if (!isImage) {
                const fileName = event.target.files[0].name;

                // Update the orders state with the file name and extension
                const temp = orders.map((obj, subindex) => {
                    if (subindex === index) {
                        const updatedFile = obj.client_art_up.map((uploadfile, sub_subindex) => {
                            if (sub_subindex === i) {
                                return fileName
                            }
                            return uploadfile
                        })
                        const flag = updatedFile.some((file) => file === null);

                        return {
                            ...obj,
                            client_art_up: updatedFile,
                            fileExtension: fileExtension,
                            imgFlag: flag,
                        };
                    }
                    return obj;
                });
                setOrders(temp);
            } else {
                if (event.target.files[0].type === 'image/tiff') {
                    const reader = new FileReader();

                    reader.onload = async () => {
                        const tiff = new Tiff({ buffer: reader.result });

                        // Convert the TIFF to a canvas
                        const canvas = tiff.toCanvas();

                        // Convert the canvas to a data URL
                        const dataUrl = canvas.toDataURL('image/png');

                        // Update the orders state with the data URL
                        const temp = orders.map((obj, subindex) => {
                            if (subindex === index) {
                                const updatedFile = obj.client_art_up.map((uploadfile, sub_subindex) => {
                                    if (sub_subindex === i) {
                                        return dataUrl
                                    }
                                    return uploadfile

                                })
                                const flag = updatedFile.some((file) => file === null);

                                return {
                                    ...obj,
                                    client_art_up: updatedFile,
                                    imgFlag: flag,
                                };
                            }
                            return obj;
                        });
                        setOrders(temp);
                    };

                    reader.readAsArrayBuffer(event.target.files[0]);
                } else {
                    let reader = new FileReader();
                    reader.onload = event => {
                        const temp = orders.map((obj, subindex) => {
                            if (subindex === index) {
                                const updatedFile = obj.client_art_up.map((uploadfile, sub_subindex) => {
                                    if (sub_subindex === i) {
                                        return event.target.result
                                    }
                                    return uploadfile

                                })
                                const flag = updatedFile.some((file) => file === null);

                                return {
                                    ...obj,
                                    client_art_up: updatedFile,
                                    imgFlag: flag,
                                };
                            }
                            return obj;
                        });
                        setOrders(temp);
                    };
                    reader.readAsDataURL(event.target.files[0]);
                }

            }
        }
    };

    const avatarImageClick = (index, i) => {
        if (order) {
            return;
        }
        setSelectedUploadId(i)
        avatarFileRef.current[index].click();
    };


    const onChangeQuantity = (value, index, i) => {
        const temp = orders.map((obj, subindex) => {
            if (subindex === index) {
                const updatedQuantity = obj.quantity.map((quantity, sub_subindex) => {
                    if (sub_subindex === i) {
                        return value;
                    }
                    return quantity;
                });

                const flag = updatedQuantity.some((quantity) => quantity === '');

                return {
                    ...obj,
                    quantity: updatedQuantity,
                    quantityFlag: flag,
                };
            }
            return obj;
        });

        setOrders(temp);
    };

    const onChangeSize = (value, index, i) => {
        const temp = orders.map((obj, subindex) => {
            if (subindex === index) {
                const updatedSize = obj.size.map((size, sub_subindex) => {
                    if (sub_subindex === i) {
                        return value;
                    }
                    return size;
                });

                const flag = updatedSize.some((size) => size === '');

                return {
                    ...obj,
                    size: updatedSize,
                    sizeFlag: flag,
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

    const onChangeServiceType = (item, index) => {
        const temp = orders.map((obj, subindex) => {
            if (subindex === index) {
                return {
                    ...obj,
                    serviceTypeFlag: false,
                    service_type: item.id,
                };
            }
            return obj;
        });
        setOrders(temp);
    };

    // const onChangePaymentType = (item, index) => {
    //     const temp = orders.map((obj, subindex) => {
    //         if (subindex === index) {
    //             return {
    //                 ...obj,
    //                 paymentTypeFlag: false,
    //                 payment_type: item.id,
    //             };
    //         }
    //         return obj;
    //     });
    //     setOrders(temp);
    // };


    const onDeleteButton = (index) => {
        let temp = orders;
        temp = temp.filter((button, subIndex) => {
            return index !== subIndex;
        });
        setOrders(temp);
        let tempFile = [...uploadFile]
        tempFile = tempFile.filter((obj, subIndex) => {
            return index !== subIndex;
        });
        setUplaodFile(tempFile);
    };

    const saveOrder = async () => {
        
        let flag = true;
        
        if (title === "") {
            flag = false;
            
            setTitleFlag(true);
        }
        if (!isAdmin && !customer._id) {
            flag = false;
            setCustomerFlag(true);
        }
        const temp = orders.map((obj, subindex) => {
            if (obj.service_type === 0) {
                flag = false;
                return {
                    ...obj,
                    serviceTypeFlag: true,
                };
            }
            // if (obj.payment_type === 0) {
                //     flag = false;
                //     return {
                    //         ...obj,
                    //         paymentTypeFlag: true,
                    //     };
            // }
            if (obj.quantity === 0 || obj.quantity.length === 0) {
                flag = false;
                return {
                    ...obj,
                    quantityFlag: true,
                };
            }
            if (obj.size === [] || obj.size.length === 0) {
                flag = false;
                return {
                    ...obj,
                    sizeFlag: true,
                };
            }
            
            if (obj.client_art_up === "" || obj.client_art_up.length === 0) {
                flag = false;
                return {
                    ...obj,
                    imgFlag: true,
                };
            } 
            else {
                return {
                    ...obj
                }
            }
        });
        setOrders(temp);
        if (!flag) {
            return;
        }

        let newOrder = {
            title: title,
            files: uploadFiles,
            orders: orders,
        };

        if (isAdmin) {
            newOrder['customerId'] = customer.id
        }
        setIsSpinner(true)
        const response = await OrderService.saveOrder(newOrder);
        if (response.success) {
            
            //sending email
            // const messageData = {
            //     from: 'orochisugai@gmail.com',
            //     // to: user.email,
            //     to: 'kingdev.talent@gmail.com',
            //     subject: 'Hello ' + user.contact_person + '.',
            //     text: `${localStorage.getItem("username")} requested new order.`,
            // };
            // try {
            //     const response = await fetch('http://185.148.129.206:5000/api/users/sendEmail', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify(messageData),
            //     });

            //     if (response.ok) {
            //         setIsSpinner(false)
            //         alert('Email sent successfully!');
            //     } else {
            //         setIsSpinner(false)
            //         alert('Failed to send email.');
            //     }
            // } catch (error) {
            //     console.error('Error sending email:', error);
            //     alert('Failed to send email.');
            // }
        }
        navigate("/dashboard/orders");
    }

    const onChangeCustomer = (item) => {
        setCustomer(item);
    }
    useEffect(() => {
        async function fetchData() {
            const response = await OrderService.getOrderDetailList(order._id);
            setOrders(response.entities);
        }

        async function fetchCustomerList() {
            const response = await userService.getCustomerList();
            setCustomerList(response.entities);
        }
        if (order && order._id) {
            fetchData();
            setIsView(true);
        }
        if (authContext.role === Constant.Admin)
            fetchCustomerList();

    }, [])

    return (
        <div>
            {isSpinner && (
                <div className="fixed w-[80%] h-screen z-10  flex justify-center items-center">
                  <img className='w-[100px] h-[100px] justify-center flex text-center' src={Spinner} alt="Loading..." />
                </div>
            )}
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Order</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        This is your order title.
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <Input
                                labelName={'Title'}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    if (e.target.value != '')
                                        setTitleFlag(false)
                                }}
                                value={title}
                                error={titleFlag}
                                maxLength={50}
                            />
                        </div>
                        {/* {isAdmin ?
                            <div className="sm:col-span-3 mt-3">
                                <SelectNoSearch
                                    labelName={'Service Type'}
                                    onChange={(item) =>
                                        onChangeCustomer(item)
                                    }
                                    value={customer}
                                    items={customerList}
                                    error={customerFlag}
                                    disabled={isView}
                                />
                            </div> : null
                        }
                        {isAdmin ?
                            <div className="sm:col-span-3 mt-3 flex items-end">
                                <NavLink
                                    className=" flex rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    to={'/dashboard/user/edit'} state={null} >
                                    <div className="text-sm font-medium text-white">
                                        Add customer
                                    </div>
                                </NavLink>
                            </div> : null
                        } */}
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Order Detail</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Select artwork and service_type Type</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-6 ">

                            <button
                                onClick={() => addOrder("", "")}
                                className=" flex rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                <PlusCircleIcon
                                    className=" text-white block mr-[5px]"
                                    width={20} height={20}
                                />
                                <div className="text-sm font-medium text-white">
                                    Add order detail
                                </div>
                            </button>

                            {orders.map((order, index) => (
                                <div key={index} className='mt-10 block items-end sm:flex'>
                                    <div className="w-full justify-end mt-10">
                                        <div>
                                            <SelectNoSearch
                                                labelName={'Service Type'}
                                                onChange={(item) =>
                                                    onChangeServiceType(item, index)
                                                }
                                                value={order.service_type}
                                                items={serviceTypeList}
                                                error={order.serviceTypeFlag}
                                                disabled={isView}
                                            />
                                        </div>
                                        {/* <div className='mt-2'>
                                            <SelectNoSearch
                                                labelName={'Payment Tpye'}
                                                onChange={(item) =>
                                                    onChangePaymentType(item, index)
                                                }
                                                value={order.payment_type}
                                                items={paymentTypeList}
                                                error={order.paymentTypeFlag}
                                                disabled={isView}
                                            />
                                        </div> */}
                                        {order.size.map((size, i) => {
                                            return (
                                                <>
                                                    <div className="mt-3 col-3">
                                                        <Input
                                                            type='text'
                                                            labelName={`Size ${i + 1}`}
                                                            onChange={(e) =>
                                                                onChangeSize(e.target.value, index, i)
                                                            }
                                                            value={size}
                                                            error={order.sizeFlag}
                                                            placeholder={"100*100"}
                                                            disabled={isView}
                                                        />
                                                    </div>
                                                    <div className="mt-2">
                                                        <Input
                                                            type='number'
                                                            labelName={`Quantity ${i + 1}`}
                                                            onChange={(e) =>
                                                                onChangeQuantity(e.target.value, index, i)
                                                            }
                                                            value={order.quantity}
                                                            error={order.quantityFlag}
                                                            maxLength={50}
                                                            minLength={1}
                                                            disabled={isView}
                                                        />
                                                    </div>
                                                    {i > 0 ? (
                                                        <div className="items-end h-full mt-2 pt-4">
                                                            <MinusCircleIcon
                                                                className=" rounded-l-full text-red-400 w-[30px]  border-white border border-r-0 z-10"
                                                                onClick={() => onDeleteSize(index)}
                                                            />
                                                            <label>Delete</label>

                                                            <p><small>You can delete this (size and quantity)</small></p>


                                                        </div>
                                                    ) : (
                                                        <div className="items-end h-full  mt-2 pt-4">
                                                            <PlusCircleIcon
                                                                className=" rounded-l-full text-red-400 w-[30px]  border-white border border-r-0 z-10"
                                                                onClick={() => addSize(index)}
                                                            />
                                                            <label>Add more</label>

                                                            <p><small>You can add more (size and quantity)</small></p>
                                                        </div>
                                                    )}
                                                    <br />

                                                </>

                                            )
                                        })}

                                        <div className="mt-2">
                                            <label className='block text-sm font-medium text-gray-700'>
                                                Comment
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="comment"
                                                    name="comment"
                                                    onChange={(e) =>
                                                        onChangeAbout(e.target.value, index)
                                                    }
                                                    disabled={isView}
                                                    value={order.comment}
                                                    rows={3}
                                                    className={`rounded-md shadow-sm sm:text-sm focus:bg-transparent border-[1px] 
                                                    h-auto border-gray-300 text-black focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none block p-2 pl-[7px] w-full ${false ? 'border-red-400' : 'border-gray-300'} `}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {order.client_art_up.map((upload, i) => (
                                        <React.Fragment key={`${i}-${upload}`}>
                                            <div className=" mt-8 sm:ml-10 sm:pl-10">
                                                <div className="">
                                                    <input key={i}
                                                        type="file"
                                                        onChange={(event) => { onChangeImagePhoto(event, index, selectedUploadId) }}
                                                        hidden
                                                        name={i}
                                                        ref={(el) => (avatarFileRef.current[index] = el)}
                                                    />
                                                    {upload && !upload.startsWith('data:image/') ? (
                                                        <p className='hover:text-green-500 cursor-pointer' onClick={() => avatarImageClick(index, i)}>{upload} (This file is not able to image format)</p>
                                                    ) : (
                                                        <img
                                                            src={upload ? (isView ? API_URL + "/" + upload : upload) : DefaultImage}
                                                            alt={`This file is not able to display with image format(.${upload && upload.slice(upload.lastIndexOf('.') + 1).toLowerCase()}).`}
                                                            id={`img${i}`}
                                                            onClick={() => avatarImageClick(index, i)}
                                                            width={250}
                                                            height={250}
                                                            className="cursor-pointer"
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {i > 0 ? (
                                                <div className="items-end h-full mt-2 pt-4">
                                                    <MinusCircleIcon
                                                        className=" rounded-l-full text-red-400 w-[30px]  border-white border border-r-0 z-10"
                                                        onClick={() => onDeleteUploadFile(index, i)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="items-end h-full w-[50px] mt-2 ml-1">
                                                    <PlusCircleIcon
                                                        className=" rounded-l-full text-red-400 w-[30px]  border-white border border-r-0 z-10"
                                                        onClick={() => AddUploadFile(index)}
                                                    />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}

                                    <div className="w-[50px] mt-2 ">
                                        <TrashIcon
                                            className=" rounded-l-full text-red-400 w-[30px]  border-white border border-r-0 z-10"
                                            onClick={() => onDeleteButton(index)}
                                        />
                                    </div>


                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="rounded-md bg-red-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300">
                    Cancel
                </button>
                {isSave && (
                    <button
                        type="submit"
                        onClick={saveOrder}
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Save
                    </button>
                )}

            </div>
        </div>
    )
}

export default OrderEdit;