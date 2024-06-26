import { dbConfig } from "@/dbConfig/dbConfig";
import MealRequest from "@/models/mealRequestModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

await dbConfig();

//! Creating meal request
export const POST = async (req) => {
  try {
    const { reqData, orderId, userId, reason } = await req.json();
    console.log(orderId);
    const request = new MealRequest({
      orderId,
      userId,
      breakfast: reqData?.breakfast,
      lunch: reqData?.lunch,
      dinner: reqData?.dinner,
      reason,
    });
    await request.save();
    const order = await Order.findById(orderId);
    order.isRequested = true;
    await order.save();
    return NextResponse.json({ msg: "OK", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Backend Error", error }, { status: 500 });
  }
};

//! Getting Meal Request(s)
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    let pipeline = [
      {
        $addFields: {
          orderIdObj: { $toObjectId: "$orderId" },
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderIdObj",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: "$order",
      },
      {
        $addFields: {
          userIdObj: { $toObjectId: "$order.userId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdObj",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          userId: "$order.userId",
        },
      },
      {
        $sort: {
          isResponded: 1,
          _id: -1,
        },
      },
    ];
    if (id) {
      pipeline.push({ $match: { userId: id } });
    }

    const requestes = await MealRequest.aggregate(pipeline);
    return NextResponse.json(requestes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Bakend error!" },
      { status: 500 }
    );
  }
};
