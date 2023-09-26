const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
// const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
// import formData from 'form-data';
const formData = require("form-data");

const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);

// Load input validation
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../validation/auth");

// Load User model
const User = require("../../models/User");
const Message = require("../../models/Message");
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  //const { name, email, password } = req.body;

  const {
    name,
    email,
    password,
    company_name,
    contact_person,
    phone,
    address,
    reseller_id,
  } = req.body.data.attributes;

  console.log(name, email, password);
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ email: "User already exists" });
    }
    let state = "In-Active";
    user = new User({
      name,
      email,
      password,
      company_name,
      contact_person,
      phone,
      address,
      reseller_id,
    });

    //if (email === 'superadmin@playestates.com') user.user_status = 'Active';

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const payload = {
      user: {
        _id: user._id,
        name: user.name,
        state: user.state,
        email: user.email,
        password: user.password,
        company_name: user.company_name,
        contact_person: user.contact_person,
        phone: user.phone,
        address: user.address,
        reseller_id: user.reseller_id,
        user_status: user.user_status,
        user_type: user.user_type,
        role: user.role,
      },
    };
    console.log(config.get("secretOrKey"));
    jwt.sign(
      payload,
      config.get("secretOrKey"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({
          success: true,
          access_token: "Bearer " + token,
          refresh_token: "Bearer " + token,
          user: {
            _id: user._id,
            name: user.name,
            state: user.state,
            email: user.email,
            password: user.password,
            company_name: user.company_name,
            contact_person: user.contact_person,
            phone: user.phone,
            address: user.address,
            reseller_id: user.reseller_id,
            user_status: user.user_status,
            user_type: user.user_type,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
//staff register

router.post("/staff/register", async (req, res) => {
  //const { name, email, password } = req.body;

  const {
    name,
    email,
    password,
    company_name,
    contact_person,
    phone,
    address,
    role,
    department,
    reseller_id,
  } = req.body;
  const user_status = "permit";

  console.log(contact_person, email, password);
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ email: "User already exists" });
    }
    let state = "In-Active";
    user = new User({
      name,
      email,
      password,
      company_name,
      contact_person,
      phone,
      address,
      role,
      department,
      user_status,
      reseller_id,
    });

    //if (email === 'superadmin@playestates.com') user.user_status = 'Active';

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const payload = {
      user: {
        _id: user._id,
        name: user.name,
        state: user.state,
        email: user.email,
        password: user.password,
        company_name: user.company_name,
        contact_person: user.contact_person,
        phone: user.phone,
        address: user.address,
        reseller_id: user.reseller_id,
        user_status: user.user_status,
        user_type: user.user_type,
        role: user.role,

      },
    };
    console.log(config.get("secretOrKey"));
    jwt.sign(
      payload,
      config.get("secretOrKey"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({
          success: true,
          access_token: "Bearer " + token,
          refresh_token: "Bearer " + token,
          user: {
            _id: user._id,
            name: user.name,
            state: user.state,
            email: user.email,
            password: user.password,
            company_name: user.company_name,
            contact_person: user.contact_person,
            phone: user.phone,
            address: user.address,
            reseller_id: user.reseller_id,
            user_status: user.user_status,
            user_type: user.user_type,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", validateLoginInput(), async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ auth: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ auth: "Invalid Credentials" });
    }

    const payload = {
      user: {
        _id: user._id,
        name: user.name,
        state: user.state,
        email: user.email,
        password: user.password,
        company_name: user.company_name,
        contact_person: user.contact_person,
        phone: user.phone,
        address: user.address,
        reseller_id: user.reseller_id,
        user_status: user.user_status,
        user_type: user.user_type,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      config.secretOrKey,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          accessToken: "Bearer " + token,
          user: {
            _id: user._id,
            name: user.name,
            state: user.state,
            email: user.email,
            password: user.password,
            company_name: user.company_name,
            contact_person: user.contact_person,
            phone: user.phone,
            address: user.address,
            reseller_id: user.reseller_id,
            user_status: user.user_status,
            user_type: user.user_type,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// @route    GET api/users/current
// @desc     Get user by token
// @access   Private
router.get("/current", auth, async (req, res) => {
  try {
    console.log(req.user._id);
    const user = await User.findById(req.user._id);
    console.log(user);
    res.json({
      user: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get('/valid', auth, async (req, res) => {
  try {
    console.log(req.user._id, ">>>>>")
    const validuser = await User
      .findOne({ _id: req.user._id })
      .select('-password');
    if (!validuser) res.json({ message: 'user is not valid' });
    res.status(201).json({
      user: validuser,
      token: req.token,
    });
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
});
router.get('/?', auth, async (req, res) => {
  // const { search } = req.query;
  const search = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ],
    }
    : {};

  const users = await User.find(search).find({ _id: { $ne: req.rootUserId } });
  res.status(200).send(users);
});

router.patch('/update/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { bio, contact_person } = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, { contact_person, bio });
  return updatedUser;
});



// @route    GET api/users/pending
// @desc     Get user by request
// @access   Public
router.get('/pending', auth, async (req, res) => {
  try {
    const newUsers = await User.find({ user_status: "request" });

    res.json({
      totalCount: newUsers.length,
      entities: newUsers,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/list", auth, async (req, res) => {
  try {
    const users = await User.find({});

    res.json({
      totalCount: users.length,
      entities: users,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id });
    res.json({
      state: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id/user", auth, async (req, res) => {
  try {
    const response = await User.findById(req.params.id);
    res.json({
      state: true,
      user: response,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/", async (req, res) => {
  const {
    _id,
    name,
    email,
    company_name,
    contact_person,
    user_type,
    role,
    user_status,
    phone,
    address,
    reseller_id,
    department,
  } = req.body.user;
  console.log(req.body.user)
  try {
    let user = await User.findById(_id);
    if (user) {
      user.name = name;
      user.email = email;
      user.company_name = company_name;
      user.contact_person = contact_person;
      user.phone = phone;
      user.address = address;
      user.role = role;
      user.reseller_id = reseller_id;
      user.user_type = user_type;
      user.user_status = user_status;
      user.department = department;
      if (req.files[0]) user.profile_image = req.files[0].filename;
      await user.save();
    }
    return res.json({
      success: true,
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.post("/permitUser", auth, async (req, res) => {
  const { type, to_user_id, message } = req.body;

  console.log(req.body);
  try {
    let message = new Message({
      type: type,
      from_user_id: req.user._id,
      to_user_id: to_user_id,
      message: message,
    });
    await message.save();

    let user = await User.findById(req.user._id);

    if (user) {
      user.user_status = type;
      await user.save();
    }

    return res.json({
      success: true,
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/customerList", auth, async (req, res) => {
  try {
    const users = await User.find({ user_type: "normal" });
    res.json({
      totalCount: users.length,
      entities: users,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//----Home
//Today's customers
router.get("/today", async (req, res) => {
  try {
    const today = new Date(); // Get today's date
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Get the start of the day
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Get the end of the day
    const users = await User.find({
      created_at: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      role: 'normal'
    });

    res.json({
      users: users,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//Week's customers
router.get("/last-week", async (req, res) => {
  try {
    const today = new Date(); // Get today's date
    const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7); // Get the date a week ago
    const users = await User.aggregate([
      {
        $match: {
          created_at: {
            $gte: weekAgo,
            $lt: today
          },
          role: 'normal'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            month: { $month: "$created_at" },
            date: { $dayOfMonth: "$created_at" },
            day: { $dayOfWeek: "$created_at" },
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.day": 1 }
      }
    ]);

    res.json({
      users: users,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//delete user

router.delete('/:id', auth, async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id });
    res.json({
      state: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//fetch users

router.get('/fetchUsers', auth, async (req, res) => {
  const keyword = req.query.search
    ? {
      $or: [
        { contact_person: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
})

// get staff by service

router.get('/staff-service', async (req, res) => {
  try {
    const { department } = req.query;
    console.log(department, "departmetn staff")
    const staff = await User.find({
      department: { $in: department },
      // role: { $in: ["Production Staff"] }
    });
    const staffTypeList = staff.map((st, index) => ({
      name: st.contact_person,
      id: st._id,
      department: st.department
    }));   
    res.json({
      staff: staffTypeList
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//send email using mailgun
// router.post("/sendEmail", async (req, res) => {
//   const client = mailgun.client({ username: "api", key: 'fe60c869863bad18f2b35332b101f08a-c30053db-91dce0e4' });
//   const messageData = {
//     from: req.body.from,
//     to: req.body.to,
//     // from: 'showstopperurbanwear@gmail.com',
//     // to: 'showstopperurbanwear@gmail.com',
//     subject: req.body.subject,
//     text: req.body.text
//   };
//   client.messages
//     .create('sandboxbabb1dd9978a40eba89c92c1c9e53c63.mailgun.org', messageData)
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });
// -------------------------------------------------
//using nodemailer
router.post("/sendEmail", async (req, res) => {
  try {
    // Create a transporter object using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'orochisugai@gmail.com',
        pass: 'frsgnqfxbxmdurne',
      },
    });

    // Create the email message
    const messageData = {
      from: req.body.from,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
    };

    // Send the email
    const info = await transporter.sendMail(messageData);
    console.log('Email sent:', info.response);

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.log('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});



module.exports = router;
