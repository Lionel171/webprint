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
import axios from "axios";

const API_URL = process.env.API_URL;


import Tiff from 'tiff.js'



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
  const [userId, setUserId] = useState('');
  const [originalImage, setOriginalImage] = useState([]);

  const [defaultImg, setDefaultImg] = useState([]);
  const [fileName, setFileName] = useState('')
  const [isUploadBtn, setIsUploadBtn] = useState(false)
  const [isFree, setIsFree] = useState(false)
  const [inComment, setInComment] = useState('');


  useEffect(() => {
    if (order.internal_comment) {
      setInComment(order.internal_comment)
    }
  }, [])

  const renderImage = (item, index, image) => {
    const fileExtension = image[index].slice(image[index].lastIndexOf('.') + 1).toLowerCase();
    const isTiff = fileExtension === 'tiff' || fileExtension === 'tif';

    if (isTiff) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const buffer = e.target.result;
        const tiff = new Tiff({ buffer });

        // Get the first page of the TIFF
        tiff.setDirectory(0);
        const canvas = tiff.toCanvas();

        // Convert the canvas to a PNG data URL
        const url = canvas.toDataURL('image/png');

        // Display the image
        const img = new Image();
        img.src = url;
        img.alt = `This file is not able to display with image format(.${fileExtension}).`;
        img.height = 100;
        img.width = 100;
        img.style.objectFit = 'contain';

        const imageContainer = document.getElementById(`image-${index}`);
        if (imageContainer) {
          imageContainer.appendChild(img);
        }
      };

      fetch(`http://185.148.129.206:5000/${image[index]}`)
        .then((response) => response.blob())
        .then((blob) => reader.readAsArrayBuffer(blob));
    } else {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.src = order ? API_URL + '/' + image[index] : DefaultImage;
        img.alt = `This file is not able to display with image format(.${fileExtension}).`;
        img.height = 100;
        img.width = 100;

        img.style.objectFit = 'contain';

        const imageContainer = document.getElementById(`image-${index}`);
        if (imageContainer) {
          imageContainer.appendChild(img);
        }
      };
      fetch(`http://185.148.129.206:5000/${image[index]}`)
        .then((response) => response.blob())
        .then((blob) => reader.readAsArrayBuffer(blob));
    }
  };

  const renderOriginalImage = (item, index, image) => {
    const fileExtension = image[index].slice(image[index].lastIndexOf('.') + 1).toLowerCase();
    const isTiff = fileExtension === 'tiff' || fileExtension === 'tif';

    if (isTiff) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const buffer = e.target.result;
        const tiff = new Tiff({ buffer });

        // Get the first page of the TIFF
        tiff.setDirectory(0);
        const canvas = tiff.toCanvas();

        // Convert the canvas to a PNG data URL
        const url = canvas.toDataURL('image/png');

        // Display the image
        const img = new Image();
        img.src = url;
        img.alt = `This file is not able to display with image format(.${fileExtension}).`;
        img.height = 100;
        img.width = 100;
        img.style.objectFit = 'contain';

        const imageContainer = document.getElementById(`original_image-${index}`);
        if (imageContainer) {
          imageContainer.appendChild(img);
        }
      };

      fetch(`http://185.148.129.206:5000/${image[index]}`)
        .then((response) => response.blob())
        .then((blob) => reader.readAsArrayBuffer(blob));
    } else {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.src = order ? API_URL + '/' + image[index] : DefaultImage;
        img.alt = `This file is not able to display with image format(.${fileExtension}).`;
        img.height = 100;
        img.width = 100;

        img.style.objectFit = 'contain';

        const imageContainer = document.getElementById(`original_image-${index}`);
        if (imageContainer) {
          imageContainer.appendChild(img);
        }
      };
      fetch(`http://185.148.129.206:5000/${image[index]}`)
        .then((response) => response.blob())
        .then((blob) => reader.readAsArrayBuffer(blob));
    }
  };



  useEffect(() => {
    const fetchData = async () => {

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

    }

    fetchData();

  }, [order]);

  // get user by order
  const getUserbyOrder = async () => {
    // if (order.id) {
    const response = await userService.getUserById(order.user_id);

    if (response.state) {
      setUser(response.user);
    }

  }

  useEffect(() => {
    getUserbyOrder();
  }, [orders])

  const onChangeImagePhoto = (event, index) => {
    if (event.target.files && event.target.files[0]) {
      let tempFilie = [...imageFiles];
      tempFilie[index] = event.target.files[0];
      setImageFiles(tempFilie);
      // Get the file extension
      const fileExtension = event.target.files[0].name.split('.').pop();

      // Check if the file is an image
      const isImage = event.target.files[0].type.startsWith('image/');

      if (!isImage) {
        const fileName = event.target.files[0].name;

        // Update the orders state with the file name and extension
        const temp = orders.map((obj, subindex) => {
          if (subindex === index) {
            return {
              ...obj,
              client_art_up: fileName,
              fileExtension: fileExtension,
              imgFlag: false,
            };
          }
          return obj;
        });
        setOrders(temp);
      } else {

        if (event.target.files[0].type === 'image/tiff' || event.target.files[0].type === 'image/tif') {
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
                return {
                  ...obj,
                  client_art_up: dataUrl,
                  imgFlag: false,
                };
              }
              return obj;
            });
            setOrders(temp);
            setIsUploadBtn(true)
          };

          reader.readAsArrayBuffer(event.target.files[0]);
        } else {
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
      }
    }

    // Get only the filename from the file path
    setFileName(event.target.files[0].name);

    const default_img = defaultImg;
    default_img[index] = true;

    if (order && order._id) {
      setIsView(false);
    }
  };


  const avatarImageClick = (index) => {
    avatarFileRef.current[index].click();

  };

  const onChangePaymentType = (item, index) => {
    const temp = orders.map((obj, subindex) => {
      if (subindex === index) {
        if (item.id === 5) {
          setIsFree(true)
        } else {
          setIsFree(false)
        }
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

  }

  const onChangePrice = (value, index) => {
    const temp = orders.map((obj, subindex) => {
      if (subindex === index) {
        if (isFree) {
          setTotalPrice(0)
        } else {
          setTotalPrice(value);
        }
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

  const onChangeInComment = (value) => {
    setInComment(value)
  }

  const downloadHandle = (imageUrl) => {
    const splitUrl = imageUrl.split('/');
    const fileName = splitUrl[splitUrl.length - 1];
    const splitFileName = fileName.split('.');
    let fileExtension = ""

    if (splitUrl[0].split(":")[0] !== "data") {
      fileExtension = splitFileName[splitFileName.length - 1];
      console.log(splitUrl[0].split(":")[0], "if")

    } else {
      fileExtension = splitUrl[1].split(";")[0]
      console.log(fileExtension, "else")
    }
    saveAs(imageUrl, `work_file.${fileExtension}`);
  };


  const saveOrder = async () => {
    let flag = true;
    const temp = orders.map((obj, subindex) => {
      if (obj.price < 0) {
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

    if ((localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes('Sales Manager')) && order.status === "1") {
      let newOrder = {
        isFree: isFree,
        orders: orders
      }

      const response = await OrderService.saveOrderPrice(newOrder);
      if (response.success) {

        //change status
        await changeStaus(parseInt(order.status) + 1);

        //sending email

        const messageData = {
          from: 'orochisugai@gmail.com',
          // to: user.email,
          to: 'kingdev.talent@gmail.com',
          subject: 'Hello ' + user.contact_person + '.',
          text: `Your order is on pre-production status`,
        };

        try {
          const response = await fetch('http://185.148.129.206:5000/api/users/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
          });

          if (response.ok) {
            alert('Email sent successfully!');
          } else {
            alert('Failed to send email.');
          }
        } catch (error) {
          console.error('Error sending email:', error);
          alert('Failed to send email.');
        }
        // navigate("/dashboard/orders");
      }

    }
    if ((localStorage.getItem('role').includes("Artwork Manager") || localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes("Artwork Team Member")) && order.status === "2") {
      let newOrder = {
        id: order._id,
        files: imageFiles,
        orders: orders,
        internal_comment: inComment
      };

      const response = await OrderService.updateImage(newOrder);


      //change status
      await changeStaus(parseInt(order.status) + 1);

      //sending email

      const messageData = {
        from: 'orochisugai@gmail.com',
        // to: user.email,
        to: 'kingdev.talent@gmail.com',
        subject: 'Hello ' + user.contact_person + '.',
        text: `Your order is on ready for proudction status
            @from weprint`,
      };

      try {
        const response = await fetch('http://185.148.129.206:5000/api/users/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          alert('Email sent successfully!');
        } else {
          alert('Failed to send email.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      }
      navigate("/dashboard/orders");

    }
    if ((localStorage.getItem("role").includes('Production Manager') || localStorage.getItem('role').includes("admin")) && order.status === "3") {
      let newOrder = {
        id: order._id,
        files: imageFiles,
        orders: orders,
        internal_comment: inComment
      };


      const response = await OrderService.updateImage(newOrder);

      const res = await OrderService.assignStaff({ orders: orders });
      // if (response.success) {
      await changeStaus(parseInt(order.status) + 1);

      //sending email
      const messageData = {
        from: 'orochisugai@gmail.com',
        // to: user.email,
        to: 'kingdev.talent@gmail.com',
        subject: 'Hello ' + user.contact_person + '.',
        text: `Your order is on proudction status.`,
      };

      try {
        const response = await fetch('http://185.148.129.206:5000/api/users/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          alert('Email sent successfully!');
        } else {
          alert('Failed to send email.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      }
      navigate("/dashboard/orders");
      // }
    }
    if ((localStorage.getItem("role").includes("Production Staff") || localStorage.getItem('role').includes("admin")) && (order.status === "4")) {
      let newOrder = {
        id: order._id,
        files: imageFiles,
        orders: orders,
        internal_comment: inComment

      };
      const response = await OrderService.updateImage(newOrder);
      await changeStaus(parseInt(order.status) + 1);
      const messageData = {
        from: 'orochisugai@gmail.com',
        // to: user.email,
        to: 'kingdev.talent@gmail.com',
        subject: 'Hello ' + user.contact_person + '.',
        text: `Your order is completed.`,
      };


      try {
        const response = await fetch('http://185.148.129.206:5000/api/users/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          alert('Email sent successfully!');
        } else {
          alert('Failed to send email.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      }

      navigate("/dashboard/orders");
    }
    if ((localStorage.getItem("role").includes("Production Staff") || localStorage.getItem('role').includes("admin")) && (order.status === "5" || order.status === "6")) {
      const response = await OrderService.saveOrderPrice({ orders: orders });

      //sending email
      let current_status = "";
      if (order.status === "5") {
        current_status = "on Final Inspaction"
      } else {
        current_status = "Ready for Pick-Up/Shipped"
      }
      await changeStaus(parseInt(order.status) + 1);
      const messageData = {
        from: 'orochisugai@gmail.com',
        // to: user.email,
        to: 'kingdev.talent@gmail.com',
        subject: 'Hello ' + user.contact_person + '.',
        text: `Your order is ${current_status}.`,
      };
      console.log(messageData.text, "Current")

      try {
        const response = await fetch('http://185.148.129.206:5000/api/users/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          alert('Email sent successfully!');
        } else {
          alert('Failed to send email.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      }

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

  const holdOrder = async () => {
    const payload = {
      id: order._id,
      internal_comment: inComment
    }
    console.log(payload, "this is hold ")
    const response = await OrderService.setHold(payload);
    if (response.success) {
      navigate("/dashboard/orders");
    }
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
      if (order.total_value == 0) {
        alert("Price is not setted. You can not send invoice email!");
        return;
      } else {
        const productData = {
          price: order.total_value,
          name: order.title
        }

        if (order.payment_type === "1") {
          const res = await axios.post(`${API_URL}/api/stripe-route/create-checkout-session`, productData);

          const resData = res.data;
          const url = resData.data.url;

          const messageData = {
            from: 'orochisugai@gmail.com',
            // to: user.email,
            to: 'kingdev.talent@gmail.com',
            subject: 'Hello ' + '.',
            text: `You received invoice email: ${url}`,
          };

          try {
            const response = await fetch('http://185.148.129.206:5000/api/users/sendEmail', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(messageData),
            });

            if (response.ok) {
              alert('Email sent successfully!');
            } else {
              alert('Failed to send email.');
            }
          } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email.');
          }
        } else if (order.payment_type === "2") {
          const res = await axios.post(`${API_URL}/api/paypal/buy`, productData);

          const resData = res.data;
          const url = resData.data.url;

          const messageData = {
            from: 'orochisugai@gmail.com',
            // to: user.email,
            to: 'kingdev.talent@gmail.com',
            subject: 'Hello ' + '.',
            text: `You received invoice email: ${url}`,
          };

          try {
            const response = await fetch('http://185.148.129.206:5000/api/users/sendEmail', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(messageData),
            });

            if (response.ok) {
              alert('Email sent successfully!');
            } else {
              alert('Failed to send email.');
            }
          } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email.');
          }
        } else {
          alert("This payment type is not supported yet.")
        }

      }


    }
  };

  useEffect(() => {
    async function fetchData() {
      const orderResponse = await OrderService.getOrderById(order._id);
      setOrder(orderResponse.order);
      const response = await OrderService.getOrderDetailList(order._id);
      setOrders(response.entities);
      const image = [];
      const default_image = [];
      const original_image = [];


      response.entities.map((order, index) => {
        image.push(order.client_art_up);
        original_image.push(order.original_art_up);
        default_image.push(false);
        renderImage(order, index, image);
        renderOriginalImage(order, index, original_image);
      })

      setDefaultImg(default_image)
      setOriginalImage(image)

      let tempTotal = 0
      response.entities.map(item => {
        tempTotal = tempTotal + item.price;
      })
      setTotalPrice(tempTotal);
    }

    fetchData();
    setIsView(true)

  }, [])

  return (
    <div>
      <div className="space-y-5">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Order: {order.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            ID - {order._id}
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-600">Customer Name: {user.contact_person}</p>
          <p className="mt-1 text-sm leading-6 text-gray-600">Customer Email: {user.email}</p>
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
              { }
              {controlList.map((item) => (
                localStorage.getItem("role") === 'admin' && order.status !== "1" ? (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => controlHandle(item.id, item.totalPrice)}
                    className=" mt-2 flex  h-[40px] w-[130px] items-center justify-center  gap-x-4 rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >

                    {item.name}
                  </button>
                ) : (null)

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

      <div className="mx-auto">
        {/* Order list */}
        {orders.map((item, index) => (
          index === 0 && (localStorage.getItem('role').includes('admin') || localStorage.getItem('role').includes("Sales Manager")) && order.status === "1" ? (
            <div className="py-3 pl-10 pr-0 text-center font-semibold">
              <p className="truncate text-gray-800 text-center mt-2">PaymentType</p>
              <SelectNoSearch
                onChange={(selectedOption) => onChangePaymentType(selectedOption, index)}
                value={paymentTypeList.find((option) => option.id === item.payment_type)}
                items={paymentTypeList}
                error={item.paymentTypeFlag}
              />
            </div>
          ) : item.payment_type ? (
            <div className="truncate text-gray-800 text-center mt-2" style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              PaymentType: {order.total_value !== 0 ? paymentTypeList[item.payment_type].name : 'Free'}
            </div>
          ) : null
        ))}
        <div className="mt-4  rounded-md sm:-mx-0 relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

            <colgroup>
              <col className="" />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead className={`text-xs text-gray-700 uppercase dark:text-gray-400 bg-gray-200`}>
              <tr>
                <th scope="col" className="px-2 py-3 font-semibold ">
                  Service Type
                </th>
                <th
                  scope="col"
                  className=" py-3 pl-10 pr-0 text-center font-semibold "
                >
                  Size : Quantity
                </th>
                <th
                  scope="col"
                  className=" py-3 pl-10 pr-0 text-center font-semibold "
                >
                  Customer Image(Original)
                </th>
                <th
                  scope="col"
                  className="py-3 pl-10 pr-0 text-center font-semibold"
                >
                  {((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Team Member') || localStorage.getItem('role').includes('admin')) && (order.status === "2" || order.status === "3") || order.status === "4") && (<>Working Image</>)}
                </th>
                {((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Team Member') || localStorage.getItem('role').includes('admin')) && (order.status === "2" || order.status === "3") || order.status === "4") && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Upload New Image
                  </th>
                )}
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
                  <td className="max-w-0 px-2 py-5 align-top ">
                    <div className="truncate font-medium text-gray-900 text-left">
                      {serviceTypeList[item.service_type].name}
                    </div>

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
                          // disabled={isView}
                          value={item.comment}
                          rows={2}
                          className={`rounded-md shadow-sm sm:text-sm focus:bg-transparent border-[1px] 
                                                    h-auto border-gray-300 text-black focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none block p-2 pl-[7px] w-full ${false ? 'border-red-400' : 'border-gray-300'} `}
                        />
                      </div>
                    </div>

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
                  <td className=" py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700 ">
                    {item.original_art_up.split('.').pop() === "pdf" ? (
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          onClick={() => { window.open(API_URL + "/" + item.original_art_up) }}
                          className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          VIEW PDF(.{item.original_art_up.split('.').pop()})
                        </button>
                      </div>

                    ) : (
                      <div className="flex justify-center" >
                        <div id={`original_image-${index}`} />
                      </div>
                    )}
                    <div className="text-center" >
                      <button
                        type="submit"
                        onClick={() => downloadHandle(API_URL + "/" + item.original_art_up)}
                        className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </td>
                  {((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Team Member') || localStorage.getItem('role').includes('admin')) && (order.status === "2" || order.status === "3" || order.status === "4")) && (
                    <td className=" py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700 ">
                      {originalImage[index].split('.').pop() === "pdf" ? (
                        <div className="flex justify-center">
                          <button
                            type="submit"
                            onClick={() => { window.open(API_URL + "/" + originalImage[index]) }}
                            className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"

                          >
                            VIEW PDF(.{originalImage[index].split('.').pop()})
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center" >
                          <div id={`image-${index}`} />
                        </div>
                      )}

                      {/* {(((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Team Member') || localStorage.getItem('role').includes('admin')) && (order.status === "2" || order.status === "1" || order.status === "3" || order.status === "4") )) ? ( */}
                      <div className="text-center" >
                        <button
                          type="submit"
                          onClick={() => downloadHandle(API_URL + "/" + originalImage[index])}
                          className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          <FaDownload />
                        </button>
                      </div>
                      {/* ) : null} */}
                    </td>
                  )}

                  <td className=" py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700">
                    <div className="flex justify-center">
                      <div className="flex items-center mr-3">
                        {((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Team Member') || localStorage.getItem('role').includes('admin')) && (order.status === "2" || order.status === "3" || order.status === "4")) ? (
                          <>
                            <input type='file' onChange={(event) => onChangeImagePhoto(event, index)} hidden ref={(el) => (avatarFileRef.current[index] = el)} />
                            <div className="text-center" style={{ position: 'relative' }}>
                              {item.client_art_up && !item.client_art_up.startsWith('data:image/') ? (
                                <p>{defaultImg[index] ? (isView ? item.client_art_up : fileName) : "Upload"} </p>
                              ) : (
                                <img
                                  src={item.client_art_up ? (isView ? API_URL + '/' + item.client_art_up : item.client_art_up) : DefaultImage}
                                  alt={`This file is not able to display with image format(.${item.client_art_up.slice(item.client_art_up.lastIndexOf('.') + 1).toLowerCase()}).`}

                                  onClick={() => avatarImageClick(index)}
                                  height={100}
                                  width={100}
                                  style={{ objectFit: 'contain' }}
                                />
                              )}
                              <div className="text-center" >
                                <button
                                  type="submit"
                                  onClick={() => avatarImageClick(index)}
                                  className="mr-2 text-center mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                  <FaUpload />
                                </button>
                                {defaultImg[index] && (
                                  <button
                                    type="submit"
                                    onClick={() => downloadHandle(item.client_art_up)}
                                    className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                  >
                                    <FaDownload />
                                  </button>
                                )}

                              </div>
                            </div>
                          </>
                        ) :
                          (<div className="flex justify-center" >
                            {/* {item.client_art_up && !item.client_art_up.startsWith('data:image/') ? (
                              <p>{item.client_art_up} (This file is not able to image format)</p>
                            ) : ( */}
                            {item.client_art_up ? (
                              item.client_art_up.split('.').pop() === "pdf" ? (
                                <div className="flex justify-center">
                                  <button
                                    type="submit"
                                    onClick={() => { window.open(API_URL + "/" + item.original_art_up) }}
                                    className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                  >
                                    VIEW PDF(.{item.original_art_up.split('.').pop()})
                                  </button>
                                </div>
                              ) : (
                                <div id={`image-${index}`} />
                              )
                            ) : (
                              <p>(This file is not able to display with image format)</p>
                            )}
                          </div>
                          )}
                      </div>
                    </div>
                  </td>
                  {(localStorage.getItem('role') === 'admin' && order.status === "1") ? (
                    <td className="py-5 pl-10  text-right align-top tabular-nums text-gray-700 text-left">
                      {
                        isFree ? (null) : (
                          <Input
                            type="number"
                            onChange={(e) => onChangePrice(e.target.value, index)}
                            value={isFree ? 0 : item.price}
                            error={item.priceFlag}
                            maxLength={50}
                            className="w-[20px]"
                            disabled={isFree}
                          />
                        )
                      }

                    </td>
                  ) : (
                    <td className="py-2 pl-10 pr-0 text-right align-top tabular-nums text-gray-700 ">
                      <div className="ttruncate text-gray-700 text-center mt-3">
                        ${!isFree ? item.price : 0}
                      </div>
                    </td>
                  )}
                  {((localStorage.getItem('role').includes('Production Manager') || localStorage.getItem('role').includes('admin')) && order.status === "3") && (


                    <td className="ml-5 max-w-0 px-0 py-5 align-top text-center ">
                      <div className='mr-2'>
                        <SelectNoSearch
                          className="mr-2"
                          onChange={(selectedOption) => onChangeStaff(selectedOption, index)}
                          items={staffList.filter(st => st.department === serviceTypeList[item.service_type].name)}
                        />
                      </div>
                    </td>
                  )}

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


      {(localStorage.getItem("role").includes('Artwork Manager') || localStorage.getItem('role').includes("admin")) && (
        <div className="mt-6 flex items-center justify-end gap-x-6">

          {order.status === '2' && (
            <>
              <div className="mt-2">
                <label className='block text-sm font-medium text-gray-700'>
                  Internal Comment
                </label>
                <div className="mt-1">
                  <textarea
                    type="text"
                    id="incomment"
                    name="incomment"
                    onChange={(e) => 
                      {
                        setInComment(e.target.value)
                      }
                    }
                    // disabled={isView}
                    value={inComment}
                    // rows={5}
                    className={`rounded-md shadow-sm sm:text-sm focus:bg-transparent border-[1px] 
                                                    h-auto border-gray-300 text-black focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none block p-2 pl-[7px] w-full ${false ? 'border-red-400' : 'border-gray-300'} `}
                  />
                </div>
              </div>
              <Link
                to={`/dashboard/orders`}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              {order.hold === 0 && (
                <button
                  type="submit"
                  onClick={saveOrder}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Start Work
                </button>
              )}

              {order.hold === 0 ? (
                <button
                  type="submit"
                  onClick={holdOrder}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Hold production
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={holdOrder}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Restart
                </button>
              )}

            </>
          )}
        </div>
      )
      }
      {(localStorage.getItem("role").includes("Production Manager") || localStorage.getItem("role").includes("admin")) && (
        <div className="mt-6 flex items-center justify-end gap-x-6">

          {order.status === "3" && (
            <>
              <div className="mt-2">
                <label className='block text-sm font-medium text-gray-700'>
                  Internal Comment
                </label>
                <div className="mt-1">
                  <textarea
                    type="text"
                    id="incomment"
                    name="incomment"
                    onChange={(e) => 
                      {
                        setInComment(e.target.value)
                      }
                    }
                    // disabled={isView}
                    value={inComment}
                    // rows={5}
                    className={`rounded-md shadow-sm sm:text-sm focus:bg-transparent border-[1px] 
                                                    h-auto border-gray-300 text-black focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none block p-2 pl-[7px] w-full ${false ? 'border-red-400' : 'border-gray-300'} `}
                  />
                </div>
              </div>
              <Link
                to={`/dashboard/orders`}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              {order.hold === 0 && (
                <button
                  type="submit"
                  onClick={saveOrder}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {/* Assign Task */}
                  Save
                </button>
              )}

              {order.hold === 0 ? (
                <button
                  type="submit"
                  onClick={holdOrder}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Hold production
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={holdOrder}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Restart
                </button>
              )}

            </>

          )}

        </div>
      )}
      {(localStorage.getItem("role").includes("Production Staff") || localStorage.getItem("role").includes("admin")) && (
        <div className="mt-6 flex items-center justify-end gap-x-6">

          {order.status === "4" ? (
            <>
              <div className="mt-2">
                <label className='block text-sm font-medium text-gray-700'>
                  Internal Comment
                </label>
                <div className="mt-1">
                  <textarea
                    type="text"
                    id="incomment"
                    name="incomment"
                    onChange={(e) => 
                      {
                        setInComment(e.target.value)
                      }
                    }
                    // disabled={isView}
                    value={inComment}
                    // rows={5}
                    className={`rounded-md shadow-sm sm:text-sm focus:bg-transparent border-[1px] 
                                                    h-auto border-gray-300 text-black focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none block p-2 pl-[7px] w-full ${false ? 'border-red-400' : 'border-gray-300'} `}
                  />
                </div>
              </div>
              <Link
                to={`/dashboard/orders`}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              {order.hold === 0 && (
                <button
                  type="submit"
                  onClick={saveOrder}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Complete
                </button>
              )}

              {order.hold === 0 ? (
                <button
                  type="submit"
                  onClick={holdOrder}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Hold production
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={holdOrder}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Restart
                </button>
              )}

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