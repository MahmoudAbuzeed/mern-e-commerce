const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const {
  getToken,
  isAuth,
  signUpValidation,
} = require("../middlewares/userMiddleware");

const userController = {};

userController.register = async (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const newUser = await user.save();
    if (newUser) {
      res.send({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: getToken(newUser),
      });
    } else {
      res.status(401).send({ message: "Invalid User Data." });
    }
  } catch (e) {
    next(e);
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //Retrieve user information
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error(`The email ${email} was not found on our system`);
      err.status = 401;
      return next(err);
    }

    //Check the password
    user.isPasswordMatch(password, user.password, (err, matched) => {
      if (matched) {
        //Generate JWT
        const secret = process.env.JWT_SECRET;
        const expire = process.env.JWT_EXPIRATION;

        const token = jwt.sign({ _id: user._id }, secret, {
          expiresIn: expire,
        });
        return res.send({
          _id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: getToken(user),
        });
      }

      res.status(401).send({
        error: "Invalid username/password combination",
      });
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

userController.update = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: "User Not Found" });
  }
};

userController.get = async (req, res) => {
  try {
    const user = new User({
      name: "Koko",
      email: "koko@gmail.com",
      password: "07775000",
      isAdmin: true,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ message: error.message });
  }
};

module.exports = { userController };
