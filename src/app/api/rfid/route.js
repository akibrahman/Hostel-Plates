import { dbConfig } from "@/dbConfig/dbConfig";
import RFID from "@/models/rfid";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const body = await req.json();
    const newRFID = new RFID({
      cardId: body.cardId,
      createdAt: new Date().toISOString("en-US", {
        timeZone: "Asia/Dhaka",
      }),
    });
    await newRFID.save();
    return NextResponse.json({
      msg: "RFID created successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        msg: error.message,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = async () => {
  try {
    const rfids = await RFID.find();
    return NextResponse.json({
      rfids,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        msg: error.message,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("cardId");
    await RFID.deleteOne({ _id: cardId });
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        msg: error.message,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
};
