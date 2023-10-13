const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");


// Create Schema
const OrderSchema = new Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    title: {
      type: String,
      default: "pending payment",
    },
    service_type: {
      type: Number,
    },
    payment_type: {
      type: Number,
      default:0,
    },
    size:  { type : Array , "default" : [""] },

    quantity: { type : Array, "default" : [""]},
    
    price: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: '1',
    },
    hold: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
    },
    customer_comment: {
      type: String,
    },
    customer_comment_is_viewd: {
      type: Boolean,
    },
    store_at_up: {
      type: String,
    },
    original_art_up: {
      type : Array , "default" : [""],
    },
    client_art_up: {
      type : Array , "default" : [""],
    },
    design_img: {
      type : Array , "default" : [""],
    },
    approve_design: {
      type: Number,
    },
  
    hold: {
      type: Number,
      default: 0,
    },
    internal_comment: {
      type: String
    },
    staff_logon_state: {
      type: Boolean,
      default:false,
    },

    due_date: {
      type: Date,
    },
    // sales_staff_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Users",
    // },
    // art_staff_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Users",
    // },
    // prod_staff_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Users",
    // },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
OrderSchema.plugin(mongoosePaginate);

module.exports = OrderDetail = mongoose.model("OrderDetails", OrderSchema);
