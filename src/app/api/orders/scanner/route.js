import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const POST = async (req) => {
  try {
    const body = await req.json();
    const tagId = body.tagId;
    const meal = body.meal;
    const date = body.date;
    const month = body.month;
    const year = body.year;
    if (!tagId || !meal || !date || !month || !year) {
      return NextResponse.json({ code: 4001, success: false });
    }
    return NextResponse.json({
      success: true,
      E323AB15: true,
      "431A2317": false,
    });
  } catch (error) {
    return NextResponse.json({ code: 4002, success: false, error });
  }
};
