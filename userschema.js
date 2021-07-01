const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userDetailsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxlength: 30,
    },
    useremail: {
      type: String,
      required: true,
      unique: [true, "Email ALready Exits!! please use some other email id"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email provided is Invalid");
        }
      },
    },
    userpasswd: {
      type: String,
      minlength: 8,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userDetailsSchema.pre("save", async function (next) {
  if (this.isModified("userpasswd")) {
    this.userpasswd = await bycrpt.hash(this.userpasswd, 10);
    next();
  } else {
    console.log(this.password);
  }
});

const userData = new mongoose.model("userDetails", userDetailsSchema);

module.exports = userData;
