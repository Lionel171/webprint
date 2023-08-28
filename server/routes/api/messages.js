const express = require("express");
const auth = require("../../middleware/auth");
const Message = require("../../models/Message");
const Chat = require("../../models/Chat");
const User = require("../../models/User");

const router = express.Router();

// router.post("/", auth, async (req, res) => {
//   const { chatId, message } = req.body;
//   console.log(">???????????", message);
//   try {
//     let msg = await Message.create({ sender: req.user._id, message, chatId });
//     msg = await (
//       await msg.populate('sender', 'contact_person email profile_image')
//     ).populate({
//       path: 'chatId',
//       select: 'chatName isGroup users',
//       model: 'Chat',
//       populate: {
//         path: 'users',
//         select: 'contact_person email profile_image',
//         model: 'Users',
//       },
//     });
//     await Chat.findByIdAndUpdate(chatId, {
//       latestMessage: msg,
//     });
//     res.status(200).send(msg);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error });
//   }
// });

router.post("/", auth, async (req, res) => {
  const { chatId, message } = req.body;
  try {
    let sender = await User.findById(req.user._id, 'contact_person email profile_image');
    let chat = await Chat.findById(chatId, 'chatName isGroup users').populate({
      path: 'users',
      select: 'contact_person email profile_image',
      model: 'Users',
    });
    let msg = new Message({sender: sender._id, message, chatId});
    msg.sender = sender;
    msg.chatId = chat;
    await msg.save();
    await Chat.findByIdAndUpdate(chatId, { latestMessage: msg });
    res.status(200).send(msg);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});


router.get("/:chatId", auth, async (req, res) => {
  const { chatId } = req.params;
  try {
    let messages = await Message.find({ chatId })
      .populate({
        path: 'sender',
        model: 'Users',
        select: 'contact_person email profile_image',
      })
      .populate({
        path: 'chatId',
        model: 'Chat',
      });
      console.log(">> messages", messages);
    res.status(200).json(messages);
  } catch (error) {
    res.sendStatus(500).json({ error: error });
    console.log(error);
  }
});

module.exports = router;
