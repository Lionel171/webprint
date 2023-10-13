const express = require("express");
const router = express.Router();
const config = require('config');



const Department = require("../../models/Department");

router.post("/add", async (req, res) => {
  const { name } = req.body

  try {

    const department = new Department({
      name
    })
    await department.save();
    return res.json({
      success: true,
      department: department
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {

  try {
    const department = await Department.find();
    return res.json({
      success: true,
      department: department
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Department.findOneAndDelete({ _id: req.params.id });
    res.json({
      state: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put('/', async (req, res) => {
 
  try {
    const { name, _id } = req.body;
    let department = await Department.findById({ _id });
    if(department) {
      department.name = name;
      await department.save();
    }

    res.json({
      state: true,
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})


module.exports = router;
