import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide a UserName"],
  },
  email: {
    type: String,
    required: [true, "Please Provide an Email"],
    unique: true,
  },
  contactNumber: {
    type: String,
    required: [true, "Please Provide a Contact Number"],
  },
  profilePicture: {
    type: String,
    required: [true, "Please Provide a Profile Picture"],
  },
  password: {
    type: String,
    required: [true, "Please Provide a Password"],
  },
  role: {
    type: String,
    required: [true, "Please Provide a role"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isManager: Boolean,
  isManagerVerified: {
    type: Boolean,
    default: false,
  },
  isClient: Boolean,
  isClientVerified: {
    type: Boolean,
    default: false,
  },
  balance: {
    type: Number,
    default: 0,
  },
  floor: Number,
  institution: String,
  messAddress: String,
  bkashNumber: String,
  manager: String,
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

delete mongoose.models.users;
const User = mongoose.model("users", userSchema);

export default User;
