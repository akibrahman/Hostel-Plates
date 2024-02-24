import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const GET = async (req) => {
  try {
    if (
      req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return res.status(401).end("Unauthorized");
    }
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
    //!!!!!!!!!!!!!!!!!!!!
    function isSecondLastDayOfCurrentMonthInBangladesh() {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      const currentHour = today.getUTCHours();
      const currentMinute = today.getUTCMinutes();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
      const secondLastDayOfMonth = new Date(lastDayOfMonth);
      secondLastDayOfMonth.setUTCDate(lastDayOfMonth.getUTCDate() - 4);
      console.log(secondLastDayOfMonth);
      return {
        isSecondLastDay:
          today.getUTCDate() === secondLastDayOfMonth.getUTCDate() &&
          today.getUTCMonth() === secondLastDayOfMonth.getUTCMonth() &&
          today.getUTCFullYear() === secondLastDayOfMonth.getUTCFullYear(),
        secondLastDayOfMonth,
        lastDayOfMonth,
        currentHour,
        currentMinute,
        currentMonth,
      };
    }
    const testData = isSecondLastDayOfCurrentMonthInBangladesh();

    if (testData.isSecondLastDay) {
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      const prevMonth = new Date(currentDate).getMonth() + 1;
      const currentMonth = new Date(currentDate).getMonth();
      const currentYear = new Date(currentDate).getFullYear();
      const dayCountOfCurrentMonth = parseInt(
        new Date(currentYear, prevMonth, 0).getDate()
      );
      const nextMonth = new Date(
        currentYear,
        currentMonth + 1,
        1
      ).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      });

      // for (let i = 1; i <= dayCountOfCurrentMonth; i++) {
      //   const newOrder = new Order({
      //     userId: "Here the user ID",
      //     managerId: "Here the manager ID",
      //     month: nextMonth,
      //     year: currentYear,
      //     date: new Date(currentYear, currentMonth, i).toLocaleDateString(),
      //     breakfast: false,
      //     lunch: false,
      //     dinner: false,
      //   });
      //   await newOrder.save();
      // }
      const mailOptions = {
        from: "cron-job@hostelplates.com",
        to: "akibrahman5200@gmail.com",
        subject: "Cron Job",
        html: `<div>
          <p>Next Month :${nextMonth}</p>
          <p>Current Year :${currentYear}</p>
          <p>Date :${new Date(
            currentYear,
            currentMonth,
            i
          ).toLocaleDateString()}</p>
          <p>Day Count of Next Month :${dayCountOfCurrentMonth}</p>
          </div>`,
      };
      await transport.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
