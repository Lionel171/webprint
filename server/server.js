const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const uploadFile = require("./middleware/upload");
const auth = require("./middleware/auth");
const mg = require("mailgun-js");
require("dotenv").config();

const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

const app = express();

global.__baseurl = __dirname;
// Connect to MongoDB
connectDB();

// Initialize middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// app.use(express.json({ extended: false }));
// app.use(express.urlencoded({ extended: true }))
app.use(uploadFile);
app.use(cors());

// Routes

app.use("/api/domains", require("./routes/api/old/domains"));
app.use("/api/petTypes", require("./routes/api/old/petTypes"));
app.use("/api/petDescriptions", require("./routes/api/old/petDescriptions"));
app.use("/api/breeders", require("./routes/api/old/breeders"));
app.use("/api/liters", require("./routes/api/old/liters"));
app.use("/api/babies", require("./routes/api/old/babies"));
app.use("/api/reservations", require("./routes/api/old/reservations"));
app.use("/api/file", require("./routes/api/old/file.controller"));
//new
app.use("/api/users", require("./routes/api/users"));
app.use("/api/orders", auth, require("./routes/api/orders"));
app.use("/api/order-details", require("./routes/api/orderDetails"));
app.use("/api/customers", require("./routes/api/customers"));
app.use("/api/department", require("./routes/api/department"));
//chat and message
app.use("/api/chat", require("./routes/api/chat"));
app.use("/api/message", require("./routes/api/messages"));

//stripe for credit card
app.use("/api/stripe-route", require("./routes/api/stripe-route"));
//paypal
app.use("/api/paypal", require("./routes/api/paypal"));
//quickbooks
// app.use("/api/quickbooks", require("./routes/api/quickbooks"));


app.use(express.static("resources/assets"));
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("resource/assets"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`Server up and running on port ${port} !`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://185.148.129.206:5174',
  },
});
io.on('connection', (socket) => {
  socket.on('setup', (userData) => {
    socket.join(userData.id);
    socket.emit('connected');
  });
  socket.on('join room', (room) => {
    socket.join(room);
  });
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieve) => {
    var chat = newMessageRecieve.chatId;
    if (!chat.users) console.log('chats.users is not defined');
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieve.sender._id) return;
      socket.in(user._id).emit('message recieved', newMessageRecieve);
    });
  });
});