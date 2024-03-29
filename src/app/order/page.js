"use client";

import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import { useContext, useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { LuCalendarPlus } from "react-icons/lu";
import "../globals.css";
const Order = () => {
  const { user } = useContext(AuthContext);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [order, setOrder] = useState(null);

  const getNextMonthBangladesh = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    if (currentDate.getMonth() === 0) {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
    const nextMonth = currentDate.toLocaleString("en-US", {
      month: "long",
    });
    return nextMonth;
  };
  const currentMonthNumber =
    parseInt(
      new Date().toLocaleDateString("en-BD", {
        month: "numeric",
        timeZone: "Asia/Dhaka",
      })
    ) - 1;
  const currentMonth = new Date().toLocaleDateString("en-BD", {
    month: "long",
    timeZone: "Asia/Dhaka",
  });
  const nextMonth = getNextMonthBangladesh();
  const currentDate = parseInt(
    new Date().toLocaleDateString("en-BD", {
      day: "numeric",
      timeZone: "Asia/Dhaka",
    })
  );
  const currentYear = parseInt(
    new Date().toLocaleDateString("en-BD", {
      year: "numeric",
      timeZone: "Asia/Dhaka",
    })
  );
  const lastDateOfCurrentMonth = parseInt(
    new Date(
      new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        })
      ).getFullYear(),
      new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        })
      ).getMonth() + 1,
      0
    ).getDate()
  );

  const dateSelected = async (date) => {
    // if (
    //   moment(new Date(date).toISOString()).isSameOrBefore(
    //     moment(new Date(currentYear, currentMonthNumber, currentDate)),
    //     "day"
    //   )
    // ) {
    //   setDate(null);
    //   setOrder(null);
    //   toast.error("Past!");
    //   return;
    // } else
    if (
      new Date(date).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) === nextMonth &&
      parseInt(
        new Date(date).toLocaleDateString("en-BD", {
          day: "numeric",
          timeZone: "Asia/Dhaka",
        })
      ) !== lastDateOfCurrentMonth
    ) {
      setDate(null);
      setOrder(null);
      toast.error("Wait till last day of this month!");
      return;
    } else if (
      new Date(date).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) === currentMonth
    ) {
      setLoading(true);
      try {
        setDate(date);
        const { data } = await axios.post("/api/orders/getorder", {
          date: new Date(date).toLocaleDateString(),
          userId: user._id,
        });
        if (data.success) {
          setOrder(data.order);
          setBreakfast(data.order.breakfast);
          setLunch(data.order.lunch);
          setDinner(data.order.dinner);
        }
        toast.success("Day selected");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
        setDate(null);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    } else {
      setDate(null);
      toast.error("Can't go so far!");
    }
  };
  if (!user) return <p>Loading user ...</p>;

  return (
    <div className="relative">
      {loading && (
        <div className="fixed h-screen w-screen bg-[rgba(0,0,0,0.6)] z-50"></div>
      )}
      <p className="text-2xl text-white bg-yellow-500 px-8 py-3 rounded-xl font-bold text-center mb-5 relative">
        Order your meal here
        {loading && (
          <CgSpinner className="animate-spin absolute top-[10px] right-2 text-4xl" />
        )}
      </p>
      {user.role === "client" && user.isVerified && user.isClientVerified && (
        <>
          {/* Date Picker  */}
          <div className="my-20 flex flex-col md:flex-row justify-center items-center gap-10">
            <p className="text-xl font-semibold tracking-widest">
              Select Date:
            </p>
            <DatePicker
              className={""}
              format="dd - MM - y"
              value={date}
              calendarIcon={<LuCalendarPlus className="text-2xl" />}
              clearIcon={null}
              dayPlaceholder="--"
              monthPlaceholder="--"
              yearPlaceholder="----"
              onChange={(e) => dateSelected(e)}
            />
          </div>
          {/* Meal Switch  */}
          <div className="grid grid-cols-1 md:grid-cols-3 align-middle gap-10 md:gap-4">
            {order && (
              <>
                {/* Breakfast   */}
                <div
                  className={`duration-700 transition-all ease-in-out flex items-center justify-between gap-8 border border-red-500 py-5 px-12 md:px-20 rounded-xl ${
                    breakfast ? "shadow-2xl shadow-red-500" : ""
                  }`}
                >
                  <p className="text-2xl font-semibold">Breakfast:</p>
                  <label class="inline-flex items-center me-5 cursor-pointer">
                    <input
                      onClick={async () => {
                        setLoading(true);
                        const { data } = await axios.patch(
                          "/api/orders/updateorder",
                          {
                            meal: "breakfast",
                            state: !breakfast,
                            id: order._id,
                          }
                        );
                        if (data.success) {
                          setLoading(false);
                          console.log(!breakfast);
                          setBreakfast(!breakfast);
                          toast.success("Order placed");
                        } else {
                          toast.error("Something went wrong!");
                        }
                      }}
                      type="checkbox"
                      value=""
                      class={`sr-only ${breakfast ? "peer" : ""}`}
                      checked
                    />
                    <div class="duration-700 transition-all ease-in-out relative w-20 h-8 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[170%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                  </label>
                </div>
                {/* Lunch   */}
                <div
                  className={`duration-700 transition-all ease-in-out flex items-center justify-between gap-8 border border-green-500 py-5 px-12 md:px-20 rounded-xl ${
                    lunch ? "shadow-2xl shadow-green-500" : ""
                  }`}
                >
                  <p className="text-2xl font-semibold">Lunch:</p>
                  <label class="inline-flex items-center me-5 cursor-pointer">
                    <input
                      onClick={async () => {
                        setLoading(true);
                        const { data } = await axios.patch(
                          "/api/orders/updateorder",
                          { meal: "lunch", state: !lunch, id: order._id }
                        );
                        if (data.success) {
                          setLoading(false);
                          console.log(!lunch);
                          setLunch(!lunch);
                          toast.success("Order placed");
                        } else {
                          toast.error("Something went wrong!");
                        }
                      }}
                      type="checkbox"
                      value=""
                      class={`sr-only ${lunch ? "peer" : ""}`}
                      checked
                    />
                    <div class="duration-700 transition-all ease-in-out relative w-20 h-8 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[170%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                  </label>
                </div>
                {/* Dinner   */}
                <div
                  className={`duration-700 transition-all ease-in-out flex items-center justify-between gap-8 border border-blue-500 py-5 px-12 md:px-20 rounded-xl ${
                    dinner ? "shadow-2xl shadow-blue-500" : ""
                  }`}
                >
                  <p className="text-2xl font-semibold">Dinner:</p>
                  <label class="inline-flex items-center me-5 cursor-pointer">
                    <input
                      onClick={async () => {
                        setLoading(true);
                        const { data } = await axios.patch(
                          "/api/orders/updateorder",
                          { meal: "dinner", state: !dinner, id: order._id }
                        );
                        if (data.success) {
                          setLoading(false);
                          console.log(!dinner);
                          setDinner(!dinner);
                          toast.success("Order placed");
                        } else {
                          toast.error("Something went wrong!");
                        }
                      }}
                      type="checkbox"
                      value=""
                      class={`sr-only ${dinner ? "peer" : ""}`}
                      checked
                    />
                    <div class="duration-700 transition-all ease-in-out relative w-20 h-8 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[170%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Order;
