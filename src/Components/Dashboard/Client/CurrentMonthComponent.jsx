"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

const CurrentMonthComponent = ({ user }) => {
  const [breakfastCount, setBreakfastCount] = useState(0);
  const [lunchCount, setLunchCount] = useState(0);
  const [dinnerCount, setDinnerCount] = useState(0);
  const currentMonth = new Date().toLocaleDateString("en-BD", {
    month: "long",
    timeZone: "Asia/Dhaka",
  });
  const currentYear = new Date().toLocaleDateString("en-BD", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
  const { data: calanderData } = useQuery({
    queryKey: ["calanderData", "user", user?._id],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.post("/api/orders/getorders", {
          userId: queryKey[2],
          month: currentMonth,
          year: currentYear,
        });
        return data.orders;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: user?._id && user?.role == "client" ? true : false,
  });
  useEffect(() => {
    if (calanderData) {
      const breakfast = calanderData.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.breakfast ? 1 : 0),
        0
      );
      const extraBreakfast = calanderData
        .filter((d) => d.isGuestMeal && d.guestBreakfastCount > 0)
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestBreakfastCount),
          0
        );
      setBreakfastCount(breakfast + extraBreakfast);
      const lunch = calanderData.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.lunch ? 1 : 0),
        0
      );
      const extraLunch = calanderData
        .filter((d) => d.isGuestMeal && d.guestLunchCount > 0)
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestLunchCount),
          0
        );
      setLunchCount(lunch + extraLunch);
      const dinner = calanderData.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.dinner ? 1 : 0),
        0
      );
      const extraDinner = calanderData
        .filter((d) => d.isGuestMeal && d.guestDinnerCount > 0)
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestDinnerCount),
          0
        );
      setDinnerCount(dinner + extraDinner);
    }
  }, [calanderData]);
  const { data: depositeAmount } = useQuery({
    queryKey: ["depositeAmount", "user", user?._id],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.get(
          `/api/bills/getbills?userId=${queryKey[2]}&month=${currentMonth}&year=${currentYear}`
        );
        if (data.success) return data.bills[0].paidBillInBDT;
        else return 0;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: user?._id && user?.role == "client" ? true : false,
  });
  return (
    <div className="min-h-full bg-dashboard text-slate-100">
      <div className="p-6 px-10 flex flex-col-reverse gap-3 items-center md:flex-row-reverse md:gap-0 justify-between">
        {user.role === "client" && user.isVerified && user.isClientVerified && (
          <>
            <p className="text-lg border rounded-xl border-sky-500 px-8 py-1.5">
              Dinner: {dinnerCount}
            </p>
            <p className="text-lg border rounded-xl border-sky-500 px-8 py-1.5">
              Lunch: {lunchCount}
            </p>
            <p className="text-lg border rounded-xl border-sky-500 px-8 py-1.5">
              Breakfast: {breakfastCount}
            </p>
          </>
        )}
      </div>
      <div className="px-6 pb-8 mt-10">
        <p className="text-center text-xl font-semibold border border-sky-500 rounded-xl px-4 py-2 relative flex flex-col md:flex-row gap-3 md:gap-0+6 items-center justify-between">
          <span className="text-sm text-sky-500">
            Deposite Amount - {depositeAmount} BDT
          </span>
          <span> {currentMonth}</span>
          <span className="text-sm text-sky-500">
            Approx. Bill -{" "}
            {breakfastCount * 30 + lunchCount * 60 + dinnerCount * 60 + 500} BDT
          </span>
        </p>
        <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
          <Tooltip className="z-50" id="my-tooltip" />
          {calanderData?.map((order) => (
            <div
              data-tooltip-id="my-tooltip"
              data-tooltip-content={
                order.isGuestMeal
                  ? "Breakfast : " +
                    order.guestBreakfastCount +
                    " Lunch : " +
                    order.guestLunchCount +
                    " Dinner : " +
                    order.guestDinnerCount
                  : null
              }
              key={order._id}
              className={`${
                order.isGuestMeal && "shadow-lg shadow-white"
              } relative w-16 h-16 rounded-xl bg-sky-500 flex items-center justify-center z-0 text-white`}
            >
              {order.date.split("/")[1]}
              <span
                className={`absolute w-2 h-2 rounded-full top-2 right-2 ${
                  order.isGuestMeal ? "bg-blue-600" : "bg-transparent"
                }`}
              ></span>
              <span
                className={`absolute w-2 h-2 rounded-full left-2 bottom-1.5 ${
                  order.breakfast ? "bg-white" : "bg-red-600"
                }`}
              ></span>
              <span
                className={`absolute w-2 h-2 rounded-full left-1/2 -translate-x-1/2 bottom-1.5 ${
                  order.lunch ? "bg-white" : "bg-red-600"
                }`}
              ></span>
              <span
                className={`absolute w-2 h-2 rounded-full right-2 bottom-1.5 ${
                  order.dinner ? "bg-white" : "bg-red-600"
                }`}
              ></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentMonthComponent;
