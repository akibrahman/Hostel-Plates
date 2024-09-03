import Order from "@/models/orderModel";
import User from "@/models/userModel";
import moment from "moment";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const PUT = async (req) => {
  try {
    const { blockDate, _id, fromDate, fromDay } = await req.json();
    const currentDateInBD = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    });
    const dateInBD = new Date(currentDateInBD);
    const year = dateInBD.getFullYear();
    const month = dateInBD.getMonth();
    const nextMonth = new Date(year, month + 1, 1);
    const lastDayOfCurrentMonth = new Date(nextMonth - 1);
    let toDay = lastDayOfCurrentMonth.getDate();

    const currentMonth = new Date().toLocaleDateString("en-BD", {
      month: "long",
      timeZone: "Asia/Dhaka",
    });

    const currentYear = parseInt(
      new Date().toLocaleDateString("en-BD", {
        year: "numeric",
        timeZone: "Asia/Dhaka",
      })
    );
    // console.log(fromDay, toDay, fromDate, blockDate);
    // return NextResponse.json({ success: true, msg: "User Updated" });
    if (blockDate) {
      if (
        moment(blockDate).isBefore(
          moment(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
            "M/D/YYYY, h:mm:ss A"
          ),
          "day"
        )
      )
        return NextResponse.json({
          success: false,
          msg: "Past date can not be Block date",
        });

      if (
        new Date(blockDate).toLocaleDateString("en-BD", {
          month: "long",
          timeZone: "Asia/Dhaka",
        }) !== currentMonth ||
        parseInt(
          new Date(blockDate).toLocaleDateString("en-BD", {
            year: "numeric",
            timeZone: "Asia/Dhaka",
          })
        ) !== currentYear
      )
        return NextResponse.json({
          success: false,
          msg: "Only current month can be selected",
        });

      for (let i = fromDay == toDay ? fromDay : fromDay + 1; i <= toDay; i++) {
        const order = await Order.findOne({
          userId: _id,
          date: fromDate.split("/")[0] + "/" + i + "/" + fromDate.split("/")[2],
        });
        console.log(
          "Order: ",
          order,
          fromDate.split("/")[0] + "/" + i + "/" + fromDate.split("/")[2]
        );
        if (!order) continue;
        order.breakfast = false;
        order.lunch = false;
        order.dinner = false;
        await order.save();
      }
    }
    await User.findByIdAndUpdate(_id, { blockDate });

    return NextResponse.json({ success: true, msg: "User Updated" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  try {
    const { id } = await req.json();
    const user = await User.findById(id);
    user.charges = [...user.charges, { wifi: 200 }];
    await user.save();
    return NextResponse.json({ success: true, msg: "Test success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};
