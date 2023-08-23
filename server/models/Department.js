const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const DepartmentSchema = new Schema(
  {
    name: {
        type: String,
    },
  }
   
);

DepartmentSchema.plugin(mongoosePaginate);
module.exports = Department = mongoose.model("Department", DepartmentSchema);
