import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

dbConfig();

export async function POST(req) {
  try {
    const body = await req.json();
    //! Check User
    const isExist = await User.findOne({ email: body.email });
    if (isExist) {
      return NextResponse.json(
        {
          msg: "User Already Exist",
          code: 1212,
          success: false,
        },
        {
          status: 201,
        }
      );
    }
    //! Hashing
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(body.password, salt);
    const newUser = new User({
      username: body.username,
      email: body.email,
      password: hashPassword,
      messAddress: body.messAddress,
      contactNumber: body.contactNumber,
      bkashNumber: body.bkashNumber,
      institution: body.institution,
      profilePicture: body.profilePicture,
      floor: body.floor ? parseInt(body.floor) : 0,
      manager: body.manager ? body.manager : "",
      role: body.role,
      isManager: body.role === "manager" ? true : false,
      isClient: body.role === "client" ? true : false,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    return NextResponse.json(
      {
        msg: "Successfully User Craeted",
        success: true,
        user: savedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("--------------->", error.message);
    console.log("--------------->", error.code);
    return NextResponse.json(
      {
        msg: "Error in Backend when creating an user",
        code: 1010,
        success: false,
      },
      {
        status: 201,
      }
    );
  }
}
