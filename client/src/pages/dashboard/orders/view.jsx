import { saveAs } from "file-saver";

import Input from '@/components/common/Input';
import { useEffect, useState, useRef } from 'react';
import OrderService from "@/services/order-service"
import DepartmentService from "@/services/department-service"
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context";
import Constant from '@/utils/constant';
import { FaDownload, FaUpload, FaPaperPlane, FaRegEnvelope } from 'react-icons/fa';
import userService from '@/services/user-service';
import OrderStep from './components/orderStep';
import DefaultImage from '../../../../public/img/default.png';
import userIcon from '../../../../public/img/default_avatar.png'
import { SelectNoSearch } from '@/components/common/Select';
import { position } from "@chakra-ui/react";
import axios from "axios";
import Spinner from '../../../../public/img/spinner.gif';
import {
  CalendarDaysIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import { FaCreditCard, FaPaypal, FaBackward } from 'react-icons/fa';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
} from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.API_URL;


import Tiff from 'tiff.js'



const serviceTypeList = [
  { id: 0, name: "", value: "" },
  { id: 1, name: "Screen Print", value: "screen_print" },
  { id: 2, name: "We Print DTF", value: "we_print_dtf" },
  { id: 3, name: "Gang Sheet", value: "gang_sheet" },
  { id: 4, name: "Signs & Banners", value: "signs_bannersr" },
  { id: 5, name: "Embroidery", value: "embroidery" },
  { id: 6, name: "Vinyl Transfer", value: "vinyl_transfer" },
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
  const uploadFileRef = useRef([]);
  const designImgeRef = useRef([]);
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
  const [defaultDesignImg, setDefaultDesignImg] = useState([]);
  const [designImgName, setDesignImgName] = useState([]);
  const [fileName, setFileName] = useState([]);
  const [imageName, setImageName] = useState([]);
  const [isUploadBtn, setIsUploadBtn] = useState(false)
  const [isFree, setIsFree] = useState(false)
  const [inComment, setInComment] = useState('');
  const [customerComment, setCustomerComment] = useState('');
  const [isSpinner, setIsSpinner] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [alertHeader, setAlertHeader] = useState("");
  const [comment, setComment] = useState('');
  const [count, setCount] = useState(true);
  const [logonState, setLogonState] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isPreStatus, setIsPreStatus] = useState(false)
  const handleOpen = () => setOpen(!open);

  function DialogCustomAnimation() {
    return (
      <>
        <Dialog
          open={open}
          handler={handleOpen}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <DialogHeader>{alertHeader}.</DialogHeader>
          <DialogBody divider>
            {alertContent}
          </DialogBody>
          <DialogFooter>
            <Button variant="gradient" color="green" onClick={handleOpen}>
              <span>OK</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  }



  useEffect(() => {


    if (order.internal_comment) {
      setInComment(order.internal_comment)
    }
    if (order.customer_comment) {
      setCustomerComment(order.customer_comment)
    }

    setLogonState(order.staff_logon_state);

  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const temp_departments = [{ id: 0, name: "" }];
        const res = await DepartmentService.getDepartments();

        res.department.forEach((dep, index) => {
          temp_departments[index + 1] = { id: index + 1, name: dep.name };
        });
        setDepartments(temp_departments);
      } catch (error) {
        // Handle error
        console.log(error);
      }
    };

    fetchData();
  }, []);


  const approveDesign = async (state) => {
    const payload = {
      id: order._id,
      approve_state: state
    }
    setIsSpinner(true)
    const res = await OrderService.ApproveDesign(payload);
    setIsSpinner(false)
    console.log(res.success)
    if (res.success) {
      if (state === 1) {

        setAlertHeader("Sucess!")
        setAlertContent(`You have approved this design. Thank you!`);
        setOpen(true)
      } else {
        setAlertHeader("Sucess!")
        setAlertContent(`You have disapproved this design. Leave your opnion on chatting room with us!`);
        setOpen(true)
      }

    } else {
      setAlertHeader("Failed!")
      setAlertContent(`Your operation is failed!`);
      setOpen(true)
    }
  }

  const logon = async (payload) => {
    const response = await OrderService.staffLogon(payload);
    setIsSpinner(true);
    if (response.successs) {
      setIsSpinner(false);
      payload.state ? setLogonState(true) : setLogonState(false);
      if (!logonState) {
        setAlertHeader("Sucess!")
        setAlertContent(`Log on is successful for this order!`);
        setOpen(true)
      } else {
        setAlertHeader("Sucess!")
        setAlertContent(`Log off is successful for this order!`);
        setOpen(true)
      }

    } else {
      setIsSpinner(false);
      setAlertHeader("Failed!")
      setAlertContent(`Log on/Log off is failed for this order!`);
      setOpen(true)
    }
  }

  const assignStaff = async () => {


    if (orders[0].staff_id) {
      const res = await OrderService.assignStaff({ orders: orders });

      if (res.success) {
        ;
        setAlertHeader("Sucess!")
        setAlertContent(`New staff is assigned for this work`);
        setOpen(true)
      }
    } else {
      setAlertHeader("WARNNING!")
      setAlertContent(`You can not assign new staff. You should to select a staff.`);
      setOpen(true)
    }


  }
  const releaseStaff = async () => {

    if (orders[0].staff_id) {
      const res = await OrderService.releaseStaff({ orders: orders });

      if (res.success) {
        ;
        setAlertHeader("Sucess!")
        setAlertContent(`This staff is released for this work`);
        setOpen(true)
      }
    } else {
      setAlertHeader("WARNNING!")
      setAlertContent(`You can not release this staff. There is no assigned staff`);
      setOpen(true)
    }
  }



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

  const renderDesignlImage = (item, index, image) => {
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

        const imageContainer = document.getElementById(`design_image-${index}`);
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


      setService(departments[order.service_type].name);
      const payload = {
        department: departments[order.service_type].name,
        status: order.status
      }

      const response = await userService.getStaffByService(payload);
      setStaffList(response.staff)
      console.log(response.staff, "response sstaff")

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
  // get staff by order
  const getStaffbyOrder = async () => {
    // if (order.id) {
    const response = await userService.getUserById(order.staff_id);

    if (response.state) {
      setStaff(response.user);
    }

  }

  useEffect(() => {
    getUserbyOrder();
    getStaffbyOrder();
  }, [orders])

  const handleUpload = async (file, index, name, select) => {
    setIsSpinner(true);
    let newFile = {
      id: order._id,
      index: index,
      files: file,
      select: select
    };

    const response = await OrderService.uploadFile(newFile);


    if (response.success) {
      setIsSpinner(false);
      setAlertHeader("Sucess!")
      setAlertContent(`upload for file '${name}' is successful!`);
      setOpen(true)
    } else {
      setIsSpinner(false);
      setAlertHeader("Failed!")
      setAlertContent(`upload for file '${name}' is failed!`);
      setOpen(true)
    }
  }

  const onChangeImagePhoto = (event, index) => {

    if (event.target.files && event.target.files[0]) {
      let tempFilie = [...imageFiles];
      tempFilie[index] = event.target.files[0];
      setImageFiles(tempFilie);
      // Get the file extension
      const fileExtension = event.target.files[0].name.split('.').pop();

      // Check if the file is an image
      const isImage = event.target.files[0].type.startsWith('image/');


      const file = orders[0].client_art_up;
      const filename = event.target.files[0].name;
      setFileName(orders[0].fileName);
      const file_name = fileName;

      if (!isImage) {


        let reader = new FileReader();
        reader.onload = event => {

          // Update the orders state with the file name and extension
          const temp = orders.map((obj, subindex) => {
            const temp_file = obj.client_art_up.map((ele, sub_subindex) => {
              if (sub_subindex === index) {
                file[index] = event.target.result;
                file_name[index] = filename;
              }
              setFileName(file_name)

              return file;
            })
            return {
              ...obj,
              client_art_up: temp_file[index],
              fileExtension: fileExtension,
              imgFlag: false,
            }
          });
          setOrders(temp);
        }
        reader.readAsDataURL(event.target.files[0]);

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

              const temp_file = obj.client_art_up.map((ele, sub_subindex) => {
                if (sub_subindex === index) {
                  file[index] = dataUrl;
                  file_name[index] = filename;

                }
                setFileName(file_name)

                return file;
              })
              return {
                ...obj,
                client_art_up: temp_file[index],
                imgFlag: false,
              }
            });
            //   design_img[index] = dataUrl;
            //   img_name[index] = design_img_name;

            // }
            // setDesignImgName(img_name)

            setOrders(temp);
            setIsUploadBtn(true)
          };

          reader.readAsArrayBuffer(event.target.files[0]);
        } else {
          let reader = new FileReader();
          reader.onload = event => {
            const temp = orders.map((obj, subindex) => {

              const temp_file = obj.client_art_up.map((ele, sub_subindex) => {
                if (sub_subindex === index) {
                  file[index] = event.target.result;
                  file_name[index] = filename;

                }
                setFileName(file_name)

                return file;
              })
              return {
                ...obj,
                client_art_up: temp_file[index],
                imgFlag: false,
              }
            });
            setOrders(temp);
          };
          reader.readAsDataURL(event.target.files[0]);
        }
      }
      ;

    }



    const default_file = defaultImg;
    default_file[index] = true;
    setDefaultImg(default_file);



    if (order && order._id) {
      setIsView(false);
    }

  };
  const onChangeImage = (event, index) => {

    if (event.target.files && event.target.files[0]) {
      let tempFilie = [...imageFiles];
      tempFilie[index] = event.target.files[0];
      setImageFiles(tempFilie);
      // Get the file extension
      const fileExtension = event.target.files[0].name.split('.').pop();

      // Check if the file is an image
      const isImage = event.target.files[0].type.startsWith('image/');

      const design_img = orders[0].design_img;
      const design_img_name = event.target.files[0].name;
      setDesignImgName(orders[0].fileName);
      const img_name = designImgName;


      if (!isImage) {

        setAlertHeader("Failed!")
        setAlertContent(`You can only upload imagee. Please try again with image file`);
        setOpen(true)
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

              const temp_file = obj.design_img.map((ele, sub_subindex) => {
                if (sub_subindex === index) {
                  design_img[index] = dataUrl;
                  img_name[index] = design_img_name;

                }
                setDesignImgName(img_name)

                return design_img;
              })
              return {
                ...obj,
                design_img: temp_file[index],
                imgFlag: false,
              }
            });

            setOrders(temp);
            setIsUploadBtn(true)
          };

          reader.readAsArrayBuffer(event.target.files[0]);
        } else {
          let reader = new FileReader();
          reader.onload = event => {
            const temp = orders.map((obj, subindex) => {

              const temp_file = obj.design_img.map((ele, sub_subindex) => {
                if (sub_subindex === index) {
                  design_img[index] = event.target.result;
                  img_name[index] = design_img_name;

                }
                setDesignImgName(img_name)

                return design_img;
              })
              return {
                ...obj,
                design_img: temp_file[index],
                imgFlag: false,
              }
            });
            setOrders(temp);
          };
          reader.readAsDataURL(event.target.files[0]);
        }
      }
      ;

    }

    const default_img = defaultDesignImg;
    default_img[index] = true;
    setDefaultDesignImg(default_img);


    if (order && order._id) {
      setIsView(false);
    }

  };
  const fileUploadClick = (index) => {
    uploadFileRef.current[index].click();

  };
  const designImgClick = (index) => {
    designImgeRef.current[index].click();

  };

  const onChangePaymentType = (item) => {

    const temp = orders.map((obj, subindex) => {

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

    });

    setOrders(temp);

  };

  const onChangeStaff = (item, index) => {

    const temp = orders.map((obj, subindex) => {

      return {
        ...obj,
        staffFlag: false,
        staff_id: item.id,
      };


    });
    setOrders(temp);

  }

  const onchangeDueDate = (date) => {
    setSelectedDate(date);

    const temp = orders.map((obj, subindex) => {

      return {
        ...obj,
        duedateFlag: false,
        due_date: date
      };


    });
    setOrders(temp);

  }

  const onChangePrice = (value) => {
    const temp = orders.map((obj, subindex) => {
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

    });
    setOrders(temp);
    console.log(orders, "price orders")
  };

  const onChangeAbout = (value) => {
    setComment(value)
    const temp = orders.map((obj, subindex) => {

      return {
        ...obj,
        comment: value,
      };

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
    console.log(imageUrl, "image")
    saveAs(imageUrl, `work_file.${fileExtension}`);
  };

  const sendCustomerComment = async () => {

    let flag = true;
    if (customerComment === "") {
      flag = false;
      setIsSpinner(false);

      setAlertHeader("Failed!")
      setAlertContent(`You can not send this message.  Please make sure to provide the necessary information or content in the message box before sending`);
      setOpen(true)

    } else {
      setIsSpinner(true);
      let payload = {
        message: customerComment,
        order_id: order._id
      }
      const response = await OrderService.sendToCustomerMsg(payload);
      setIsSpinner(false);

      if (response.success) {
        setAlertHeader("Sucess!")
        setAlertContent(`Your message is sent successfully`);
        setOpen(true)
        //send email
        const messageData = {
          from: 'orochisugai@gmail.com',
          // to: user.email,
          to: 'kingdev.talent@gmail.com',
          subject: 'Hello ' + user.contact_person + '.',
          text: `You received message about order ${order.title} from WEPRINT.
"${customerComment}"
Please check notification on your dashbord of our site.
from WEPRINT`,
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
            setIsSpinner(false);

            alert('Email sent successfully!');
          } else {
            setIsSpinner(false);

            alert('Failed to send email.');
          }
        } catch (error) {
          console.error('Error sending email:', error);
          alert('Failed to send email.');
        }

      }
    }

  }


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
      if (order.status === "1") {
        if (obj.due_date === undefined) {
          flag = false;


          return {
            ...obj,
            duedateFlag: true,
          };
        }
      }

      if (obj.payment_type === null) {
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

    setIsSpinner(true);

    if ((localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes('Sales Manager')) && order.status === "1") {
      let newOrder = {
        isFree: isFree,
        orders: orders
      }

      const response = await OrderService.saveOrderPrice(newOrder);
      if (response.success) {
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
            setIsSpinner(false);

            alert('Email sent successfully!');
          } else {
            setIsSpinner(false);

            alert('Failed to send email.');
          }
        } catch (error) {
          console.error('Error sending email:', error);
          alert('Failed to send email.');
        }
        //change status
        await changeStaus(parseInt(order.status) + 1);
        navigate("/dashboard/orders");
      }

    }
    if ((localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes("Sales Manager")) && order.status === "2") {
      let newOrder = {
        id: order._id,
        internal_comment: inComment
      };

      const response = await OrderService.updateOrder(newOrder);
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
          setIsSpinner(false);

          alert('Email sent successfully!');
        } else {
          setIsSpinner(false);

          alert('Failed to send email.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      }
      //change status
      await changeStaus(parseInt(order.status) + 1);
      navigate("/dashboard/orders");

    }
    if ((localStorage.getItem("role").includes('Sales Manager') || localStorage.getItem('role').includes("admin")) && order.status === "3") {
      let newOrder = {
        id: order._id,
        internal_comment: inComment
      };

      const response = await OrderService.updateOrder(newOrder);


      // if (response.success) {


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
          setIsSpinner(false);
          alert('Email sent successfully!');
        } else {
          setIsSpinner(false);
          alert('Failed to send email.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      }
      //change status
      if (order.payment_type === 5) {
        await changeStaus(parseInt(order.status) + 2);
      } else {
        await changeStaus(parseInt(order.status) + 1);

      }
      navigate("/dashboard/orders");
      // }
    }
    if (((localStorage.getItem("role").includes('admin') || localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Staff')) && order.status === '4')) {
      let newOrder = {
        id: order._id,
        internal_comment: inComment,

      }
      if (localStorage.getItem("role").includes('admin')) {
        const response = await OrderService.updateOrder(newOrder);


        // if (response.success) {


        //sending email
        const messageData = {
          from: 'orochisugai@gmail.com',
          // to: user.email,
          to: 'kingdev.talent@gmail.com',
          subject: 'Hello ' + user.contact_person + '.',
          text: `Your order is on artwork department status.`,
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
            setIsSpinner(false);
            alert('Email sent successfully!');
          } else {
            setIsSpinner(false);
            alert('Failed to send email.');
          }
        } catch (error) {
          console.error('Error sending email:', error);
          alert('Failed to send email.');
        }
        //change status
        // if (!localStorage.getItem('role').includes('Artwork Staff')) {

        await changeStaus(parseInt(order.status) + 1);
        // }
        navigate("/dashboard/orders");
      } else {
        if (order.approve_design) {
          const response = await OrderService.updateOrder(newOrder);


          // if (response.success) {


          //sending email
          const messageData = {
            from: 'orochisugai@gmail.com',
            // to: user.email,
            to: 'kingdev.talent@gmail.com',
            subject: 'Hello ' + user.contact_person + '.',
            text: `Your order is on artwork department status.`,
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
              setIsSpinner(false);
              alert('Email sent successfully!');
            } else {
              setIsSpinner(false);
              alert('Failed to send email.');
            }
          } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email.');
          }
          //change status
          // if (!localStorage.getItem('role').includes('Artwork Staff')) {

          await changeStaus(parseInt(order.status) + 1);
          // }
          navigate("/dashboard/orders");
          // }
        } else {
          setIsSpinner(false);

          setAlertHeader("Failed!")
          setAlertContent(`Customer didn't approve your design . You need to wait up till customer approve this.`);
          setOpen(true)
        }
      }




    }
    if ((localStorage.getItem("role").includes("Production Staff") || localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes("Production Manager")) && (order.status === "5")) {
      let newOrder = {
        id: order._id,
        files: imageFiles,
        orders: orders,
        internal_comment: inComment

      };
      const response = await OrderService.updateOrder(newOrder);
      const res = await OrderService.assignStaff({ orders: orders });

      const messageData = {
        from: 'orochisugai@gmail.com',
        // to: user.email,
        to: 'kingdev.talent@gmail.com',
        subject: 'Hello ' + user.contact_person + '.',
        text: `Your order is in production status.`,
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
          setIsSpinner(false);
          alert('Email sent successfully!');
        } else {
          setIsSpinner(false);
          alert('Failed to send email.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      }
      //change status
      // if (!localStorage.getItem('role').includes('Production Staff')) {
      await changeStaus(parseInt(order.status) + 1);
      // }
      navigate("/dashboard/orders");
    }
    if ((localStorage.getItem("role").includes("Production Staff") || localStorage.getItem('role').includes("admin")) && (order.status === "6" || order.status === "7")) {
      const response = await OrderService.saveOrderPrice({ orders: orders });

      //sending email
      let current_status = "";
      if (order.status === "6") {
        current_status = "on Final Inspaction"
      } else {
        current_status = "ready for pick up"
      }

      const messageData = {
        from: 'orochisugai@gmail.com',
        // to: user.email,
        to: 'kingdev.talent@gmail.com',
        subject: 'Hello ' + user.contact_person + '.',
        text: `Your order is ${current_status}.`,
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
          setIsSpinner(false);
          alert('Email sent successfully!');
        } else {
          setIsSpinner(false);
          alert('Failed to send email.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      }
      //change status
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

  const holdOrder = async () => {
    const payload = {
      id: order._id,
      internal_comment: inComment
    }
    setIsSpinner(true);
    const response = await OrderService.setHold(payload);
    if (response.success) {
      setIsSpinner(false);
      navigate("/dashboard/orders");
    }
  }

  const changeStaus = async (step) => {
    if (step < 1) {
      alert("You can not backward department")
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

  const controlHandle = async () => {

    if (order.total_value == 0) {
      alert("Price is not setted. You can not send invoice email!");
      return;
    } else {
      const productData = {
        price: order.price,
        name: order.title
      }

      console.log(productData, "dddd")

      if (order.payment_type === 1) {
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
      } else if (order.payment_type === 2) {
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

  };


  useEffect(() => {
    async function fetchData() {
      const orderResponse = await OrderService.getOrderById(order._id);
      setOrder(orderResponse.order);


      // if (count) {

      //   if (order.status === "7") {
      //     setAlertHeader("Order Status!")
      //     setAlertContent(`This order is inspected`);
      //     setOpen(true)
      //   }

      //   if (order.status === "8") {
      //     setAlertHeader("Order Status!")
      //     setAlertContent(`This order is ready for pick up`);
      //     setOpen(true)
      //   }
      //   setCount(false);
      // }


      // const response = await OrderService.getOrderDetailList(order._id);

      // Fetch the data and populate orders_temp array
      const orders_temp = [];
      const file_name = order.client_art_up;
      const design_temp = [];

      // if (order.design_img !== [""]) {
      // design_temp = order.design_img
      // } else {
      order.design_img.map((obj, index) => {
        design_temp.push(obj)
      })
      // }
      console.log(order.design_img, "what happend?")
      const order_temp = {
        ...order,
        paymentTypeFlag: false,
        priceFlag: false,
        duedateFlag: false,
        fileName: file_name,
        designImgName: design_temp,
      }
      orders_temp.push(order_temp);

      // Update the state with orders_temp
      setOrders(orders_temp);

      const image = [];
      const default_image = [];
      const original_image = [];
      const design_image = [];

      // response.entities.map((order, index) => {
      //   image.push(order.client_art_up);
      //   original_image.push(order.original_art_up);
      //   default_image.push(false);
      //   renderImage(order, index, image);
      //   renderOriginalImage(order, index, original_image);
      // })

      order.client_art_up.map((file, index) => {
        image.push(file);
        renderImage(order, index, image);
      });

      order.original_art_up.map((o_file, index) => {
        original_image.push(o_file);
        default_image.push(false);
        renderOriginalImage(order, index, original_image);
      });

      order.design_img.map((img, index) => {
        design_image.push(img);
        default_image.push(false);
        renderDesignlImage(order, index, design_image)
      })
      const imgName_temp = [];
      order.original_art_up.map((ele, i) => {
        imgName_temp.push("")
      })

      const default_design_temp = [];
      order.original_art_up.map((ele, i) => {
        default_design_temp.push(false);
      })

      setDefaultImg(default_image);
      setDefaultDesignImg(default_design_temp);
      setOriginalImage(original_image);
      setDesignImgName(imgName_temp);
      setFileName(original_image);

      // let tempTotal = 0;
      // response.entities.map(item => {
      //   tempTotal = tempTotal + item.price;
      // });
      setTotalPrice(order.price);

    }


    fetchData();
    setIsView(true);


  }, [isPreStatus]);

  const previousStatus = async () => {
    setIsSpinner(true);
    await changeStaus(parseInt(order.status) - 1);

    setIsSpinner(false);
    navigate("/dashboard/orders");
  }




  return (
    <div>
      <DialogCustomAnimation />
      {isSpinner && (

        <div className="fixed w-[80%] h-screen z-10  flex justify-center items-center">
          <img className='w-[100px] h-[100px] justify-center flex text-center' src={Spinner} alt="Loading..." />
        </div>

      )}

      <div className="space-y-5">
        {((localStorage.getItem('role').includes('admin')) && (order.status !== "1")) && (
          <button
            key={order._id}
            type="button"
            onClick={previousStatus}
            className=" mt-2 flex  h-[40px] w-[250px] items-center justify-center  gap-x-4 rounded bg-green-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <FaBackward /> Return to Previous Department
          </button>
        )}
        {((localStorage.getItem('role').includes('Artwork Manager')) && (order.status === "4")) && (
          <button
            key={order._id}
            type="button"
            onClick={previousStatus}
            className=" mt-2 flex  h-[40px] w-[250px] items-center justify-center  gap-x-4 rounded bg-green-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <FaBackward /> Return to Previous Department
          </button>
        )}
        {((localStorage.getItem('role').includes('Production Manager')) && (order.status === "5" || order.status === "6" || order.status === "7" || order.status === "8")) && (
          <button
            key={order._id}
            type="button"
            onClick={previousStatus}
            className=" mt-2 flex  h-[40px] w-[250px] items-center justify-center  gap-x-4 rounded bg-green-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <FaBackward /> Return to Previous Department
          </button>
        )}


        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Order: {order.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            ID -  #{parseInt(order.order_id, 16) % 10000}
          </p>
          {localStorage.getItem('role').includes('admin') || localStorage.getItem("role").includes("Sales Team Member") ? (
            <>
              <p className="mt-1 text-sm leading-6 text-gray-600">Create By: {localStorage.getItem('role')}-{user.contact_person}</p>
              <p className="mt-1 text-sm leading-6 text-gray-600">Customer Email: {user.email}</p>
              <Avatar src={user.profile_image ? API_URL + '/' + user.profile_image : userIcon} alt={user.contact_person} size="sm" />
            </>

          ) : (
            <>
              <p className="mt-1 text-sm leading-6 text-gray-600">Customer Name: {user.contact_person}</p>
              <p className="mt-1 text-sm leading-6 text-gray-600">Customer Email: {user.email}</p>
              <Avatar src={user.profile_image ? API_URL + '/' + user.profile_image : userIcon} alt={user.contact_person} size="sm" />
            </>

          )}

          {(order.status === "4" || order.status === "5" || order.status === "6" || order.status === "7" || order.status === "8") && (
            <>
              <p className="mt-1 text-sm leading-6 text-gray-600">Staff Name: {staff.contact_person}</p>
              <p className="mt-1 text-sm leading-6 text-gray-600">Staff Email: {staff.email}</p>
              <Avatar src={staff.profile_image ? API_URL + '/' + staff.profile_image : userIcon} alt={staff.contact_person} size="sm" />
            </>
          )}
        </div>

        <div className="border-b border-gray-900/10 pb-2 mb-4">
          {order.status === "7" && (
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Order was Inspected!
            </h1>
          )}

          {order.status === "8" && (
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
              currentPaymentType={order.payment_type}
              className="w-1/2"
            />
            <dl className="w-1/2 flex-wrap pl-2">
              { }

              {((localStorage.getItem("role") === 'admin' || localStorage.getItem("role").includes('Sales Manager')) && order.status !== "1") ? (
                <button

                  type="button"
                  onClick={controlHandle}
                  className=" mt-2 flex  h-[40px] w-[130px] items-center justify-center  gap-x-4 rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <FaRegEnvelope />
                  Invoice
                </button>
              ) : (null)}


              {((localStorage.getItem("role").includes("Production Staff") || localStorage.getItem("role").includes("Artwork Staff")) && (order.status === "4" || order.status === "5" || order.status === "6")) && (
                logonState ? (
                  <button
                    key={order._id}
                    type="button"
                    onClick={() => logon({ id: order._id, state: false })}
                    className=" mt-2 flex  h-[40px] w-[130px] items-center justify-center  gap-x-4 rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Log Off
                  </button>
                ) : (
                  <button
                    key={order._id}
                    type="button"
                    onClick={() => logon({ id: order._id, state: true })}
                    className=" mt-2 flex  h-[40px] w-[130px] items-center justify-center  gap-x-4 rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Log On
                  </button>
                )

              )}
              {((localStorage.getItem("role") === 'admin' || localStorage.getItem("role").includes('Sales Manager')) && order.status !== "1") && (
                <>
                  <div className="flex pl-6 pt-2 mr-2">
                    <dt className="text-sm font-semibold leading-6 text-gray-900">
                      Price
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
                      {localStorage.getItem('role').includes('normal') && user.contact_person}
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
                      <time dateTime="2023-01-31">{order && order.date.substring(0, 10)}</time>
                    </dd>
                  </div>
                  <div className="mt-2 flex w-full flex-none gap-x-4 px-6">
                    {order.payment_type === 1 ? (
                      <dt className="flex-none">
                        <span className="sr-only">Status</span>
                        <FaCreditCard
                          className="h-6 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </dt>
                    ) :
                      order.payment_type === 2 ? (
                        <dt className="flex-none">
                          <span className="sr-only">Status</span>
                          <FaPaypal
                            className="h-6 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </dt>
                      ) : (null)}

                    <dd className="text-sm leading-6 text-gray-500">
                      {(order && order.payment_type) && paymentTypeList[order.payment_type].name}
                    </dd>
                  </div>
                </>
              )}


            </dl>
          </div>
        </div>
      </div>

      <div className="mx-auto">
        {/* Order list */}

        {(localStorage.getItem('role').includes('admin') || localStorage.getItem('role').includes("Sales Manager")) && order.status === "1" ? (
          <div className="py-3 pl-10 pr-0 text-center font-semibold">
            <p className="block text-sm font-medium text-gray-700">PaymentType</p>
            <SelectNoSearch
              onChange={(selectedOption) => onChangePaymentType(selectedOption)}
              value={paymentTypeList.find((option) => option.id === order.payment_type)}
              items={paymentTypeList}
              error={orders[0] && orders[0].paymentTypeFlag}
            />
          </div>
        ) : order.payment_type ? (
          <div className="truncate text-gray-800 text-center mt-2" style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            PaymentType: {order.price !== 0 ? paymentTypeList[order.payment_type].name : 'Free'}
          </div>
        ) : null}

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
                  {localStorage.getItem('role').includes('normal') ? ("My Order File(Original)") : ("Customer File(Original)")}
                </th>

                {/* {((!localStorage.getItem('role').includes('normal')) && (order.status !== "1")) && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Working File
                  </th>
                )} */}
                {((localStorage.getItem('role').includes('normal')) && (order.status === "4" || order.status === "5" || order.status === "6" || order.status === "7")) && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Design Proof
                  </th>
                )}

                {((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Staff') || localStorage.getItem('role').includes('admin') || localStorage.getItem('role').includes('Production Staff') || localStorage.getItem('role').includes('Production Manager')) && (order.status === "2" || order.status === "3" || order.status === "4" || order.status === "5")) && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Upload New File
                  </th>
                )}
                {((localStorage.getItem('role').includes('Sales Manager')) && (order.status === "2" || order.status === "3")) && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Upload New File
                  </th>
                )}
                {((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('admin')) && (order.status === "4")) && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                   Design Proof
                  </th>
                )}

                {(localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes('Sales Manager') || localStorage.getItem('role').includes('normal')) && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Price
                  </th>

                )}
                {((localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes('Sales Manager') || localStorage.getItem('role').includes('Production Manager')) && order.status === "1") && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Due Date
                  </th>
                )}


                {((localStorage.getItem('role').includes("Production Manager") || localStorage.getItem('role').includes("admin")) && (order.status === "5" || order.status === "6")) && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Assign Production Staff
                  </th>
                )}
                {((localStorage.getItem('role').includes("Artwork Manager") || localStorage.getItem('role').includes("admin")) && order.status === "4") && (
                  <th
                    scope="col"
                    className="py-3 pl-10 pr-0 text-center font-semibold"
                  >
                    Assign Artwork Staff
                  </th>
                )}

              </tr>
            </thead>
            <tbody>

              <tr key={order._id} className="border-b border-gray-100">
                <td className="max-w-0 px-2 py-5 align-top ">
                  <div className="truncate font-medium text-gray-900 text-left">

                    {departments[order.service_type] && departments[order.service_type].name}
                  </div>
                </td>
                <td className=" py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700 ">
                  <div className="ttruncate text-gray-500 text-center">
                    {order.quantity.map((quantity, index) => {
                      return (
                        order.size[index] + ': ' + quantity
                      )
                    }).join(', ')}
                  </div>
                </td>
                <td className="py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700">
                  {order.original_art_up && order.original_art_up[0] && (
                    order.original_art_up.map((o_file, index) => {
                      return (
                        <>
                          {o_file.split('.').pop() === "pdf" ? (
                            <div className="flex justify-center">
                              <button
                                type="submit"
                                onClick={() => { window.open(API_URL + "/" + o_file) }}
                                className="text-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                              >
                                VIEW PDF(.{o_file.split('.').pop()})
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div id={`original_image-${index}`} />
                            </div>
                          )}

                          <div className="text-center mb-1">
                            <button
                              type="submit"
                              onClick={() => downloadHandle(API_URL + "/" + o_file)}
                              className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                              <FaDownload />
                            </button>
                          </div>

                        </>
                      );
                    })
                  )}
                </td>


                {/* {((!localStorage.getItem('role').includes('normal')) && (order.status !== "1")) && (
                  <td className="py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700">
                    {order && order.client_art_up.map((o_file, index) => {
                      return (
                        <>
                          {o_file.split('.').pop() === "pdf" ? (
                            <div className="flex justify-center">
                              <button
                                type="submit"
                                onClick={() => { window.open(API_URL + "/" + o_file) }}
                                className="text-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                              >
                                VIEW PDF(.{o_file.split('.').pop()})
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div id={`image-${index}`} />
                            </div>
                          )}

                          <div className="text-center mb-1">
                            <button
                              type="submit"
                              onClick={() => downloadHandle(API_URL + "/" + o_file)}
                              className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </>
                      );
                    })}
                  </td>
                )} */}

                {((localStorage.getItem('role').includes('normal')) && (order.status === "4" || order.status === "5" || order.status === "6" || order.status === "7")) && (
                  <td className="py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700">
                    {(order && order.design_img) ? order.design_img.map((img, index) => {
                      return (
                        <>
                          {img.split('.').pop() === "pdf" ? (
                            <div className="flex justify-center">
                              <button
                                type="submit"
                                onClick={() => { window.open(API_URL + "/" + img) }}
                                className="text-center mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                              >
                                VIEW PDF(.{img.split('.').pop()})
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div id={`design_image-${index}`} />
                            </div>
                          )}

                          <div className="text-center mb-1">
                            <button
                              type="submit"
                              onClick={() => downloadHandle(API_URL + "/" + img)}
                              className="text-center mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                              <FaDownload />
                            </button>

                            <div className="text-center">
                              <button
                                type="submit"
                                onClick={() => approveDesign(2)}
                                className="text-center mr-0.5 mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                              >
                                DISAPPROVE
                              </button>

                              <button
                                type="submit"
                                onClick={() => approveDesign(1)}
                                className=" text-center mr-0.5 mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                              >
                                APPROVE
                              </button>
                            </div>

                          </div>
                        </>
                      );
                    }) : ("No Design Fiel")}
                  </td>
                )}

                {
                  ((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('Artwork Staff') || localStorage.getItem('role').includes('admin') || localStorage.getItem('role').includes('Production Staff') || localStorage.getItem('role').includes('Production Manager')) && (order.status === "2" || order.status === "3" || order.status === "4" || order.status === "5")) && (
                    <td className="py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700">
                      {(orders[0] && orders[0].client_art_up) && (orders[0].client_art_up.map((file, index) => {

                        return (
                          <div className="flex justify-center" key={index}>
                            <div className="flex items-center mr-3">
                              <input type='file' onChange={(event) => onChangeImagePhoto(event, index)} hidden ref={(el) => (uploadFileRef.current[index] = el)} />
                              <div className="text-center mb-3" style={{ position: 'relative' }}>
                                {file && !file.startsWith('data:image/') ? (
                                  <p>{defaultImg[index] ? (isView ? fileName[index] : fileName[index]) : "choose working file."}</p>
                                ) : (
                                  <img
                                    src={file ? (isView ? API_URL + '/' + file : file) : DefaultImage}
                                    alt={`This file is not able to display with image format(.${fileName[index].slice(fileName[index].lastIndexOf('.') + 1).toLowerCase()}).`}
                                    onClick={() => fileUploadClick(index)}
                                    height={100}
                                    width={100}
                                    style={{ objectFit: 'contain' }}
                                  />
                                )}
                                <div className="text-center">
                                  <button
                                    type="submit"
                                    onClick={() => fileUploadClick(index)}
                                    className=" text-center mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                  >
                                    Choose File
                                  </button>
                                  {defaultImg[index] && (
                                    <>
                                      <div className="text-center">
                                        <button
                                          type="submit"
                                          onClick={() => downloadHandle(file)}
                                          className="text-center mr-0.5 mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        >
                                          <FaDownload />
                                        </button>

                                        <button
                                          type="submit"
                                          onClick={() => handleUpload(imageFiles, index, fileName[index], "working")}
                                          className=" text-center mr-0.5 mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        >
                                          <FaUpload />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }))}
                    </td>
                  )
                }
                {
                  ((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('admin')) && (order.status === "4")) && (
                    <td className="py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700">
                      {(orders[0] && orders[0].design_img) && (orders[0].design_img.map((img, index) => {
                        return (
                          <div className="flex justify-center" key={index}>
                            <div className="flex items-center mr-3">
                              <input type='file' onChange={(event) => onChangeImage(event, index)} hidden ref={(el) => (designImgeRef.current[index] = el)} />
                              <div className="text-center mb-3" style={{ position: 'relative' }}>
                                {/* {img && !img.startsWith('data:image/') ? (
                                  <p>{defaultDesignImg[index] ? (isView ? designImgName[index] : designImgName[index]) : "choose desgin image."}</p>
                                ) : ( */}
                                <img
                                  src={img ? (isView ? API_URL + '/' + img : img) : DefaultImage}
                                  alt={`This file is not able to display with image format(.${designImgName[index].slice(designImgName[index].lastIndexOf('.') + 1).toLowerCase()}).`}
                                  onClick={() => designImgClick(index)}
                                  height={100}
                                  width={100}
                                  style={{ objectFit: 'contain' }}
                                />
                                {/* )} */}
                                <div className="text-center">
                                  <button
                                    type="submit"
                                    onClick={() => designImgClick(index)}
                                    className=" text-center mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                  >
                                    Choose Image
                                  </button>
                                  {defaultDesignImg[index] && (
                                    <>
                                      <div className="text-center">
                                        <button
                                          type="submit"
                                          onClick={() => downloadHandle(img)}
                                          className="text-center mr-0.5 mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        >
                                          <FaDownload />
                                        </button>

                                        <button
                                          type="submit"
                                          onClick={() => handleUpload(imageFiles, index, fileName[index], "design")}
                                          className=" text-center mr-0.5 mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        >
                                          <FaUpload />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }))}
                    </td>
                  )
                }
                {
                  ((localStorage.getItem('role').includes('Sales Manager')) && (order.status === "2" || order.status === "3")) && (
                    <td className="py-5 pl-10 pr-0 text-right align-top tabular-nums text-gray-700">
                      {(orders[0] && orders[0].client_art_up) && (orders[0].client_art_up.map((file, index) => {

                        // orders[0] && console.log(orders[0].client_art_up, defaultImg[index], "ordersordersorderos")
                        return (
                          <div className="flex justify-center" key={index}>
                            <div className="flex items-center mr-3">
                              <input type='file' onChange={(event) => onChangeImagePhoto(event, index)} hidden ref={(el) => (avatarFileRef.current[index] = el)} />
                              <div className="text-center mb-3" style={{ position: 'relative' }}>
                                {file && !file.startsWith('data:image/') ? (
                                  <p>{defaultImg[index] ? (isView ? fileName[index] : fileName[index]) : "choose working file."}</p>
                                ) : (
                                  <img
                                    src={file ? (isView ? API_URL + '/' + file : file) : DefaultImage}
                                    alt={`This file is not able to display with image format(.${fileName[index].slice(fileName[index].lastIndexOf('.') + 1).toLowerCase()}).`}
                                    onClick={() => avatarImageClick(index)}
                                    height={100}
                                    width={100}
                                    style={{ objectFit: 'contain' }}
                                  />
                                )}
                                <div className="text-center">
                                  <button
                                    type="submit"
                                    onClick={() => avatarImageClick(index)}
                                    className=" text-center mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                  >
                                    Choose File
                                  </button>
                                  {defaultImg[index] && (
                                    <>
                                      <div className="text-center">
                                        <button
                                          type="submit"
                                          onClick={() => downloadHandle(file)}
                                          className="text-center mr-0.5 mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        >
                                          <FaDownload />
                                        </button>

                                        <button
                                          type="submit"
                                          onClick={() => handleUpload(imageFiles, index, fileName[index], "working")}
                                          className=" text-center mr-0.5 mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        >
                                          <FaUpload />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }))}
                    </td>
                  )
                }

                {(((localStorage.getItem('role').includes('admin') || localStorage.getItem('role').includes('Sales Manager')) && order.status === "1")) ? (
                  <td className="py-5 pl-10  text-right align-top tabular-nums text-gray-700 text-left mr-2">
                    {
                      isFree ? (null) : (
                        <Input
                          type="number"
                          onChange={(e) => onChangePrice(e.target.value)}
                          value={isFree ? 0 : order.price}
                          error={orders[0] && orders[0].priceFlag}
                          maxLength={50}
                          className="w-[20px]"
                          disabled={isFree}
                        />
                      )
                    }

                  </td>
                ) : (
                  (localStorage.getItem('role').includes("admin") || localStorage.getItem('role').includes('Sales Manager') || localStorage.getItem('role').includes('Sales Manager') || localStorage.getItem('role').includes('normal')) && (
                    <td className="py-2 pl-10 pr-0 text-right align-top tabular-nums text-gray-700 mr-2">
                      <div className="ttruncate text-gray-700 text-center mt-3">
                        ${!isFree ? order.price : 0}
                      </div>
                    </td>
                  )
                )}
                {(((localStorage.getItem('role') === 'admin' || localStorage.getItem('role').includes('Sales Manager') || localStorage.getItem('role').includes('Production Manager')) && order.status === "1")) && (
                  <td className="py-5 pl-10  text-right align-top tabular-nums text-gray-700 text-left mr-2">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => onchangeDueDate(date)}
                      className="custom-datepicker border rounded p-3 text-gray-800 mr-3"
                    />
                    {(orders[0] && orders[0].duedateFlag) && <p className="mr-5 text-red-500">Please select a due date.</p>}

                  </td>
                )}
                {((localStorage.getItem('role').includes('Production Manager') || localStorage.getItem('role').includes('admin')) && (order.status === "5" || order.status === "6")) && (
                  <td className="ml-5 max-w-0 px-0 py-5 align-top text-center ">
                    <div className='mr-2'>
                      <SelectNoSearch
                        className="mr-2"
                        onChange={(selectedOption) => onChangeStaff(selectedOption)}
                        items={staffList.filter(st => st.department.includes(departments[order.service_type].name))}
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        onClick={releaseStaff}
                        className="text-center mr-0.5 mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      >
                        Release Staff
                      </button>

                      <button
                        type="submit"
                        onClick={assignStaff}
                        className=" text-center mr-0.5 mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Assign Staff
                      </button>
                    </div>

                  </td>
                )}
                {((localStorage.getItem('role').includes('Artwork Manager') || localStorage.getItem('role').includes('admin')) && order.status === "4") && (
                  <td className="ml-5 max-w-0 px-0 py-5 align-top text-center ">
                    <div className='ml-2'>
                      <SelectNoSearch
                        className="ml-2"
                        onChange={(selectedOption) => onChangeStaff(selectedOption)}
                        items={staffList.filter(st => st.department.includes(departments[order.service_type].name))}
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        onClick={releaseStaff}
                        className="text-center mr-0.5 mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      >
                        Release Staff
                      </button>

                      <button
                        type="submit"
                        onClick={assignStaff}
                        className=" text-center mr-0.5 mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Assign Staff
                      </button>
                    </div>

                  </td>
                )}

              </tr>

            </tbody>
          </table>
          <div className="border-b border-gray-900/10 pb-2 mb-4"></div>
          <div className="mt-6 flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-end sm:gap-x-6 m-2">
            <div className="mt-2 flex flex-col col-span-4 md:col-span-4 overflow-y-scroll" style={{ maxHeight: "200px" }}>
              <label className="block text-sm font-medium text-gray-700">
                Comment
              </label>
              <div className="mt-1">
                <p className="truncate text-gray-700 text-center mt-3">{order.comment}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      {
        ((localStorage.getItem("role").includes('admin') || localStorage.getItem('role').includes('Sales Manager')) && order.status === '1') ? (
          <div className="mt-6 flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-end sm:gap-x-6">
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
        ) : null
      }


      {
        (localStorage.getItem("role").includes('Sales Manager') || localStorage.getItem('role').includes("admin")) && (
          <div className="mt-6 flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-end sm:gap-x-6">

            {order.status === '2' && (
              <>
                <div className="mt-2 flex flex-col">
                  <label className='block text-sm font-medium text-gray-700'>
                    Internal Comment
                  </label>
                  <div className="mt-1">
                    <textarea
                      type="text"
                      id="incomment"
                      name="incomment"
                      onChange={(e) => {
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
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
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
      {
        (localStorage.getItem("role").includes("Sales Manager") || localStorage.getItem("role").includes("admin")) && (
          <div className="mt-6 flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-end sm:gap-x-6">

            {order.status === "3" && (
              <>
                <div className="mt-2 flex flex-col">
                  <label className='block text-sm font-medium text-gray-700'>
                    Internal Comment
                  </label>
                  <div className="mt-1">
                    <textarea
                      type="text"
                      id="incomment"
                      name="incomment"
                      onChange={(e) => {
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
        )
      }


      {
        (localStorage.getItem("role").includes("Production Manager") || localStorage.getItem("role").includes("Production Staff") || localStorage.getItem("role").includes("admin") || localStorage.getItem("role").includes("Artwork Staff") || localStorage.getItem("role").includes("Artwork Manager")) && (
          <div className="mt-6 flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-end sm:gap-x-6">

            {(order.status === "4" || order.status === "5") ? (
              <>
                <div className="mt-2 flex flex-col">
                  <label className='block text-sm font-medium text-gray-700'>
                    To Customer
                  </label>
                  <div className="mt-1">
                    <textarea
                      type="text"
                      id="incomment"
                      name="incomment"
                      onChange={(e) => {
                        setCustomerComment(e.target.value)
                      }
                      }
                      // disabled={isView}
                      value={customerComment}
                      // rows={5}
                      className={`rounded-md shadow-sm sm:text-sm focus:bg-transparent border-[1px] 
                                                    h-auto border-gray-300 text-black focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none block p-2 pl-[7px] w-full ${false ? 'border-red-400' : 'border-gray-300'} `}
                    />
                  </div>

                </div>
                <FaPaperPlane
                  className="cursor-pointer text-blue-500 text-xl focus:bg-transparent focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none mt-2"
                  onClick={sendCustomerComment}
                />

                <div className="mt-2">
                  <label className='block text-sm font-medium text-gray-700'>
                    Internal Comment
                  </label>
                  <div className="mt-1">
                    <textarea
                      type="text"
                      id="incomment"
                      name="incomment"
                      onChange={(e) => {
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
              order.status === "6" ? (
                <>
                  <div className="mt-2 flex flex-col">
                    <label className='block text-sm font-medium text-gray-700'>
                      To Customer
                    </label>
                    <div className="mt-1">
                      <textarea
                        type="text"
                        id="incomment"
                        name="incomment"
                        onChange={(e) => {
                          setCustomerComment(e.target.value)
                        }
                        }
                        // disabled={isView}
                        value={customerComment}
                        // rows={5}
                        className={`rounded-md shadow-sm sm:text-sm focus:bg-transparent border-[1px] 
                                                    h-auto border-gray-300 text-black focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none block p-2 pl-[7px] w-full ${false ? 'border-red-400' : 'border-gray-300'} `}
                      />
                    </div>

                  </div>
                  <FaPaperPlane
                    className="cursor-pointer text-blue-500 text-xl focus:bg-transparent focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none mt-2"
                    onClick={sendCustomerComment}
                  />

                  <div className="mt-2">
                    <label className='block text-sm font-medium text-gray-700'>
                      Internal Comment
                    </label>
                    <div className="mt-1">
                      <textarea
                        type="text"
                        id="incomment"
                        name="incomment"
                        onChange={(e) => {
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
                  <button
                    type="submit"
                    onClick={saveOrder}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Pickup/ship
                  </button>

                </>
              ) :
                order.status === "7" ? (
                  <>
                    <div className="mt-2 flex flex-col">
                      <label className='block text-sm font-medium text-gray-700'>
                        To Customer
                      </label>
                      <div className="mt-1">
                        <textarea
                          type="text"
                          id="incomment"
                          name="incomment"
                          onChange={(e) => {
                            setCustomerComment(e.target.value)
                          }
                          }
                          // disabled={isView}
                          value={customerComment}
                          // rows={5}
                          className={`rounded-md shadow-sm sm:text-sm focus:bg-transparent border-[1px] 
                                                    h-auto border-gray-300 text-black focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none block p-2 pl-[7px] w-full ${false ? 'border-red-400' : 'border-gray-300'} `}
                        />
                      </div>

                    </div>
                    <FaPaperPlane
                      className="cursor-pointer text-blue-500 text-xl focus:bg-transparent focus-visible:border-[1px] focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:outline-none mt-2"
                      onClick={sendCustomerComment}
                    />

                    <div className="mt-2">
                      <label className='block text-sm font-medium text-gray-700'>
                        Internal Comment
                      </label>
                      <div className="mt-1">
                        <textarea
                          type="text"
                          id="incomment"
                          name="incomment"
                          onChange={(e) => {
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
                    <button
                      type="submit"
                      onClick={saveOrder}
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Complete
                    </button>

                  </>
                ) : (
                  null
                )}

          </div>
        )
      }




    </div >
  );
}

export default OrderEdit;