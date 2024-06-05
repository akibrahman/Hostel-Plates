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
      //   "4131A2317": false,
      //   "4321A2317": false,
      //   "4313A2317": false,
      //   "431A42317": false,
      //   "431A25317": false,
      //   "431A23617": false,
      //   "431A2317": false,
      //   "4431A2317": false,
      //   "43q1A2317": false,
      //   "431wA2317": false,
      //   "431Ae2317": false,
      //   "431A2r317": false,
      //   "431A23t17": false,
      //   "431A231y7": false,
      //   "431A2317u": false,
      //   u431A2317: false,
      //   "4i31A2317": false,
      //   "43o1A2317": false,
      //   "431pA2317": false,
      //   "431Al2317": false,
      //   "431A2k317": false,
      //   "431A23j17": false,
      //   "431A231h7": false,
      //   a431A2317: false,
      //   "4s31A2317": false,
      //   "43d1A2317": false,
      //   "431fA2317": false,
      //   "431Ag2317": false,
      //   "431A2h317": false,
      //   "431A23jh17": false,
      //   "431A2317k": false,
      //   z431A2317: false,
      //   "4x31A2317": false,
      //   "43c1A2317": false,
      //   "431vA2317": false,
      //   "431Ab2317": false,
      //   "431A2n317": false,
      //   "431A23m17": false,
      //   "431A231mm7": false,
      //   s431A2317: false,
      //   "4d31A2317": false,
      //   "43f1A2317": false,
      //   "431gA2317": false,
      //   "431Ah2317": false,
      //   "431A2j317": false,
      //   "431A23k17": false,
      //   "431A231l7": false,
      //   "431A2317o": false,
      //   m431A2317: false,
      //   "4n31A2317": false,
      //   "43b1A2317": false,
      //   "431vA2317": false,
      //   "431Ac2317": false,
      //   "431A2x317": false,
      //   "431A23z17": false,
      //   "431A231a7": false,
      //   "431A2317r": false,
      //   "4f31A2317": false,
      //   "43h1A2317": false,
      //   "431jA2317": false,
      //   "431Al2317": false,
      //   "431A2p317": false,
      //   "431A23f17": false,
      //   "431A231s7": false,
      //   "431A2317x": false,
      //   "431A2317s": false,
      //   l431A2317: false,
      //   "4k31A2317": false,
      //   "43j1A2317": false,
      //   "431hA2317": false,
      //   "431Ag2317": false,
      //   "431A2f317": false,
      //   "431A23d17": false,
      //   "431A231s7": false,
      //   "431A2317a": false,
      //   p431A2317: false,
      //   "4o31A2317": false,
      //   "43i1A2317": false,
      //   "431uA2317": false,
      //   "431Ay2317": false,
      //   "431A2t317": false,
      //   "431A23r17": false,
      //   "431A231e7": false,
      //   "431A2317w": false,
      //   "0431A2317": false,
      //   "4h31A2317": false,
      //   "43g1A2317": false,
      //   "431fA2317": false,
      //   "431Ar2317": false,
      //   "431A2u317": false,
      //   "431A23o17": false,
      //   "431A231h7": false,
      //   "431A2317d": false,
      //   "4s31A2317": false,
      //   "43g1A2317": false,
      //   "431jA2317": false,
      //   "431Ar2317": false,
      //   "431A2h317": false,
      "431A2317": false,
      E323AB15: true,
    });
  } catch (error) {
    return NextResponse.json({ code: 4002, success: false, error });
  }
};