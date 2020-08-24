const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    dropDups: true,
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

userSchema.pre("save", async function (next) {
  //Check if password is not modified
  if (!this.isModified("password")) {
    return next;
  }

  //Encrypt the password
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (e) {
    return next(e);
  }
});

userSchema.methods.isPasswordMatch = function (password, hashed, callback) {
  bcrypt.compare(password, hashed, (err, success) => {
    if (err) {
      return callback(err);
    }
    callback(null, success);
  });
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
