const express = require("express");
const router = express.Router();
const uploadFile = require("../../middleware/upload");
const auth = require("../../middleware/auth");
// Load User model
const User = require("../../models/User");
const Order = require("../../models/Order");
const OrderDetail = require("../../models/OrderDetail");
const OrderHistory = require("../../models/OrderHistory");
const { getPagination } = require("../../config/utils");

// const paypal = require("paypal-rest-sdk");
const nodemailer = require("nodemailer");


// paypal.configure({
//   mode: "sandbox", // or 'live' for production
//   client_id: "YOUR_CLIENT_ID",
//   client_secret: "YOUR_CLIENT_SECRET",
// });


router.post("/save-order", auth, async (req, res) => {
  let _id = req.user._id;
  const { customerId, title, orders } = req.body;
  if (customerId) _id = customerId;
  try {
    let order = new Order({
      title: title,
      status: 1,
      user_id: _id,
    });

    await order.save();

    order = await Order.findOne({ _id: order._id }).populate("Users");
    orders.map(async (item, index) => {
      const client_art_up = [];
      if (req.files) {
        const order_file = req.files.filter((file, i) => file.fieldname.startsWith(`files[${index}]`));
        order_file.map((obj, sub_i) => {
          client_art_up.push(obj.filename)
        })
      } else {
        client_art_up.push(null);
      }
      let orderDetail = new OrderDetail({
        order_id: order._id,
        status: item.status,
        title: title,
        user_id: _id,
        service_type: item.service_type,
        payment_type: item.payment_type,
        comment: item.comment,
        quantity: item.quantity,
        size: item.size,
        client_art_up: client_art_up,
        original_art_up: client_art_up,
      });
      await orderDetail.save();
    });
    let order_history = new OrderHistory({
      status: 1,
      user_id: _id,
      order_id: order._id,
      date: new Date(),
    });
    await order_history.save();
    return res.json({
      success: true,
      orders: orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error!!!");
  }
});

router.post("/save-order-price", auth, async (req, res) => {
  const { orders, isFree } = req.body;
  try {
    if (orders.length <= 0) {
      res.status(500).send("Server error");
    }
    let totalPrice = 0;
    orders.map((item) => {
      totalPrice = !isFree ? totalPrice + parseInt(item.price) : 0;
      payment_type = item.payment_type
    });
    orders.map(async (item) => {
      let orderDetail = await OrderDetail.findById(item._id);
      orderDetail.price = item.price;
      // orderDetail.price = !isFree ? item.price : 0;
      orderDetail.comment = item.comment;
      orderDetail.payment_type = item.payment_type;
      await orderDetail.save();
    });
    let order = await Order.findById(orders[0].order_id);
    order.total_value = totalPrice;
    order.payment_type = orders[0].payment_type

    await order.save();

    return res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// set hold

router.post("/hold", auth, async (req, res) => {
  const { id, internal_comment } = req.body;

  try {
    let order = await OrderDetail.findById(id);
    if (order.hold === 0) {
      order.hold = 1;
    } else {
      order.hold = 0;
    }
    order.internal_comment = internal_comment;
    // if(order.internal_coment) {
    //   order
    // }
    await order.save();

    return res.json({
      success: true
    })

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
})

//upload working file
router.post('/file-upload', auth, async (req, res) => {
  const { id, index } = req.body;
  try {
    const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(
      id,
      {
        $set: { [`client_art_up.${index}`]: req.files[0].filename },
      },
      { new: true }
    );
    return res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }

})
// send message to customer
router.post('/customer-comment', auth, async (req, res) => {
  const { message, order_id } = req.body;
  try {
    const orderDetail = await OrderDetail.findById(order_id);
    orderDetail.customer_comment = message;
    orderDetail.customer_comment_is_viewd = false;
    await orderDetail.save();

    return res.json({
      success: true,
    })
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
})

// get message from staff
router.get('/get-message', auth, async (req, res) => {

  try {
    const orderDetail = await OrderDetail.find({ user_id: req.query.user_id });

    const order_is_msg = orderDetail.filter(obj => obj.customer_comment && !obj.customer_comment_is_viewd);
    const response = [];
    order_is_msg.map((item, index) => {
      response.push({
        order_id: item._id,
        order_title: item.title,
        content: item.customer_comment,
        from: item.staff_id,
        updatedAt: item.updatedAt
      })
    })

    return res.json({
      success: true,
      result: response,
    })

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
})

//is view message
router.post('/isview-message', auth, async (req, res) => {
  const { id } = req.body;
  console.log(id, "hwy")
  try {
    const orderDetail = await OrderDetail.findById(id);
    orderDetail.customer_comment_is_viewd = true;
    await orderDetail.save()
    return res.json({
      success: true,
    })
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
})

//update order

router.post("/update", auth, async (req, res) => {
  const { id, internal_comment } = req.body;
  try {
    const orderDetail = await OrderDetail.findById(id);
    orderDetail.internal_comment = internal_comment;
    await orderDetail.save();
    return res.json({
      success: true,
    })
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
})

// router.post("/img-update", auth, async (req, res) => {
//   const { orders, id, internal_comment } = req.body;
//   try {
//     console.log(orders, "image updater")
//     if (orders.length <= 0) {
//       res.status(500).send("Server error");
//     }
//     orders.map(async (item, index) => {
//       let orderDetail = await OrderDetail.findById(item._id);
//       orderDetail.client_art_up = req.files[index] ? req.files[index].filename : orderDetail.client_art_up;
//       orderDetail.comment = item.comment;
//       await orderDetail.save();
//     });

//     return res.json({
//       success: true,
//     });
//   } catch (err) {
//     res.status(500).send("Server error!");
//   }
// });

router.post("/assign-staff", auth, async (req, res) => {
  const { orders } = req.body;
  try {
    if (orders.length <= 0) {
      res.status(500).send("Server error");
    }

    let orderDetail = await OrderDetail.findById(orders[0]._id);
    orderDetail.staff_id = orders[0].staff_id;
    await orderDetail.save();

    return res.json({
      success: true,
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error")
  }
})
//get total orders

router.get("/total", async (req, res) => {
  try {
    const response = await Order.find();
    res.json({
      orders: response,
    })

  } catch (err) {
    res.status(500).send("Server error")
  }
})

router.get("/", async (req, res) => {
  try {
    const response = await OrderDetail.findById(req.query.order_id);
    res.json({
      state: true,
      order: response,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/list", async (req, res) => {
  try {
    const { page, perPage, search } = req.query;
    var condition = search
      ? {
        $or: [
          { title: { $regex: new RegExp(search), $options: "i" } },
          // { status: { $regex: new RegExp(search), $options: "i" } },
        ],
      }
      : {};
    const { limit, offset } = getPagination(page, perPage);
    const orders = await OrderDetail.paginate(condition, {
      offset,
      limit,
    });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//get invoice orders
router.get("/invoices", auth, async (req, res) => {
  try {
    const { page, perPage, search } = req.query;
    let condition = search
      ? {
        $or: [
          { title: { $regex: new RegExp(search), $options: "i" } },
          // { status: { $regex: new RegExp(search), $options: "i" } },
        ],
      }
      : {};
    const { limit, offset } = getPagination(page, perPage);
    const orders = await Order.paginate(condition, {
      offset,
      limit,
    });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
})
//approve order
router.get("/approve", async (req, res) => {
  try {
    const { page, perPage, search } = req.query;
    var condition = search
      ? {
        $or: [
          { title: { $regex: new RegExp(search), $options: "i" } },
          // { status: { $regex: new RegExp(search), $options: "i" } },
        ],
      }
      : { status: { $in: 2 } };
    const { limit, offset } = getPagination(page, perPage);
    const orders = await OrderDetail.paginate(condition, {
      offset,
      limit,
    });
    res.json(orders);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//pending orders
router.get("/pending", async (req, res) => {
  try {
    const { page, perPage, search } = req.query;
    var condition = search
      ? {
        $or: [
          { title: { $regex: new RegExp(search), $options: "i" } },
          // { status: { $regex: new RegExp(search), $options: "i" } },
        ],
      }
      : { status: { $in: 1 } };
    const { limit, offset } = getPagination(page, perPage);
    const orders = await OrderDetail.paginate(condition, {
      offset,
      limit,
    });
    res.json(orders);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//in prodcution order

router.get("/inproduction/:id", async (req, res) => {
  try {
    const { page, perPage, search } = req.query;
    var condition = search
      ? {
        $or: [
          { title: { $regex: new RegExp(search), $options: "i" } },
          { status: { $regex: new RegExp(search), $options: "i" } },
        ],
      }
      : {
        status: { $in: [4, 5, 6, 7] },
        staff_id: req.params.id,
      };
    const { limit, offset } = getPagination(page, perPage);
    const orders = await OrderDetail.paginate(condition, { offset, limit });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// // in production
// router.get("/in-production/:id", async (req, res) => {
//   try {
//     const { page = 1, perPage = 10, search = "" } = req.query;

//     const limit = parseInt(perPage);
//     const skip = (page - 1) * limit;
//     const condition = search
//       ? {
//         $and: [
//           { staff_id: req.params.id },
//           {
//             $or: [
//               { title: { $regex: new RegExp(search), $options: "i" } },
//               { status: { $regex: new RegExp(search), $options: "i" } },
//             ],
//           },
//         ],
//       }
//       : { user_id: req.params.id };

//     const orders = await Order.find(condition)
//       .skip(skip)
//       .limit(limit);
//     const count = await Order.countDocuments(condition);
//     res.json({
//       orders,
//       totalPages: Math.ceil(count / limit),
//       currentPage: parseInt(page),
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// router.get("/current", async (req, res) => {
//   try {
//     const { page, perPage, search, id } = req.query;
//     console.log(id, "search")

//     const condition = search
//     ? {
//         $and: [
//           { user_id: id },
//           {
//             $or: [
//               { title: { $regex: new RegExp(search), $options: "i" } },
//               { status: { $regex: new RegExp(search), $options: "i" } },
//             ],
//           },
//         ],
//       }
//     : { user_id: req.params.id };
//     const { limit, offset } = getPagination(page, perPage);
//     const orders = await Order.paginate(condition, {
//       offset,
//       limit,
//     });
//     res.json(orders);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

router.get("/current/:id", async (req, res) => {
  try {
    const { page, perPage, search } = req.query;


    const condition = search
      ? {
        user_id: req.params.id,
        $or: [
          { title: { $regex: new RegExp(search), $options: "i" } },
          // { status: { $regex: new RegExp(search), $options: "i" } },
        ],
      }
      : { user_id: req.params.id };

    const { limit, offset } = getPagination(page, perPage);
    const orders = await OrderDetail.paginate(condition, {
      offset,
      limit,
    });

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    await OrderDetail.findOneAndDelete({ _id: req.params.id });
    res.json({
      state: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/update-status", auth, async (req, res) => {
  try {
    let _id = req.user._id;
    const { order_id, status } = req.body;

    let order = await OrderDetail.findById(order_id);
    if (order) {
      order.status = status;
      await order.save();
    }

    let order_history = new OrderHistory({
      status: status,
      user_id: _id,
      order_id: order_id,
      date: new Date(),
    });
    await order_history.save();

    res.json({
      state: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Home-----Get today's Orders number
router.get("/today", async (req, res) => {
  try {
    const today = new Date(); // Get today's date
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Get the start of the day
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Get the end of the day

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).populate("user_id");;

    res.json({
      orders: orders,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//----------Get monthly completed orders for this year.
router.get("/monthly", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const startOfYear = new Date(currentYear, 0, 1); // Get the start of the year
    const endOfYear = new Date(currentYear + 1, 0, 1); // Get the start of next year

    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear
          },
          status: "7"
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          _id: 1 // Sort by month in ascending order
        }
      }
    ];

    const count = await Order.aggregate(pipeline);

    res.json({
      count: count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ---------Get today's total price.
router.get("/today/price", async (req, res) => {
  try {
    const today = new Date(); // Get today's date
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Get the start of the day
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Get the end of the day

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: '7'
    });

    res.json({
      orders: orders,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --------- Get monthly price for a year
router.get("/monthly/price", async (req, res) => {
  try {
    const today = new Date(); // Get today's date
    const startOfYear = new Date(today.getFullYear(), 0, 1); // Get the start of the year
    const endOfYear = new Date(today.getFullYear(), 11, 31); // Get the end of the year

    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lte: endOfYear
          },
          status: '7'
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalPrice: { $sum: "$total_value" }
        }
      },
      {
        $sort: {
          "_id": 1
        }
      }
    ]);

    res.json({
      orders: orders,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//---------Get total price
router.get("/totalprice", async (req, res) => {
  try {

    const orders = await Order.find({
      status: '7'
    });

    res.json({
      orders: orders,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//---------Get total user's paid
router.get("/paid/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await Order.find({
      user_id: id,
      status: '7'
    });

    let totalPrice = 0;
    orders.forEach(order => {
      totalPrice += order.total_value;
    });

    res.json({
      totalPrice: totalPrice,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//---------Get weekly user's paid
router.get("weekly/paid/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get today's date
    const currentDate = new Date();

    // Calculate the start and end dates of the current week
    const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6);

    // Find orders within the current week for the given user
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek
          },
          status: '7'
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
        }
      },
      {
        count: { $sum: 1 }
      },
      {
        $sort: {
          "_id": 1
        }
      }

    ]);

    res.json({
      orders: orders,
    });


    res.json({
      totalPrice: totalPrice,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/send-invoice-email", async (req, res) => {
  try {
    const response = await Order.findById(req.query.order_id).populate(
      "user_id"
    );

    res.json({
      state: true,
      order: response,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// async function sendPayPalInvoice(email, subject, body, amount) {
//   const invoice = {
//     merchant_info: {
//       email: "YOUR_PAYPAL_EMAIL",
//       business_name: "YOUR_BUSINESS_NAME",
//     },
//     billing_info: [
//       {
//         email: email,
//       },
//     ],
//     items: [
//       {
//         name: "Invoice",
//         quantity: 1,
//         unit_price: {
//           currency: "USD",
//           value: amount,
//         },
//       },
//     ],
//     note: body,
//     amount: {
//       currency: "USD",
//       total: amount,
//     },
//   };

//   try {
//     const createdInvoice = await paypal.invoice.create(invoice);
//     const invoiceId = createdInvoice.id;

//     // Create a nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: "YOUR_EMAIL_SERVICE",
//       auth: {
//         user: "YOUR_EMAIL",
//         pass: "YOUR_EMAIL_PASSWORD",
//       },
//     });

//     // Send the email
//     const mailOptions = {
//       from: "YOUR_EMAIL",
//       to: email,
//       subject: subject,
//       text: body,
//       attachments: [
//         {
//           filename: "invoice.pdf",
//           path: `https://www.paypal.com/invoice/p/#${invoiceId}`,
//         },
//       ],
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }
module.exports = router;
