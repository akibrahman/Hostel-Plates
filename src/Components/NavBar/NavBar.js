"use client";

import { AuthContext } from "@/providers/ContextProvider";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaBars, FaTimes } from "react-icons/fa";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

const NavBar = () => {
  const { user, loading } = useContext(AuthContext);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = parseInt(window.innerWidth);
      setDeviceWidth(width);
      const handleResize = () => {
        setDeviceWidth(parseInt(window.innerWidth));
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
  return (
    <div className="">
      {/*//! For Desktop  */}
      <div
        className={`${
          deviceWidth <= 500 ? "hidden" : "flex"
        } dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white text-black dark:text-white py-3 flex-col md:flex-row gap-5 md:gap-0 items-center justify-between px-10`}
      >
        <Image
          src="/images/logo-white.png"
          width={"50"}
          height={"50"}
          alt="Logo"
          className=""
        />
        <div className="flex items-center justify-center gap-5 md:gap-10">
          <p className="">
            <Link href="/">Home</Link>
          </p>
          {loading
            ? null
            : user &&
              user.success &&
              user.isClient &&
              user.isClientVerified && (
                <p>
                  <Link href="/order">Order</Link>
                </p>
              )}
          {/* <p> */}
          <Link className="pointer-events-none text-stone-400" href="/help">
            Support
          </Link>
          <Link className="pointer-events-none text-stone-400" href="/help">
            Contact Us
          </Link>
          <Link className="pointer-events-none text-stone-400" href="/help">
            About Us
          </Link>
          <Link className="pointer-events-none text-stone-400" href="/help">
            Our Gallery
          </Link>
          {/* </p> */}
          {loading ? (
            <CgSpinner className="text-2xl text-sky-500 animate-spin" />
          ) : user && user.success ? (
            <p>
              <Link
                className="bg-sky-500 hover:bg-blue-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
                href="/profile"
              >
                Profile
              </Link>
            </p>
          ) : (
            <p>
              <Link
                className="bg-sky-500 hover:bg-sky-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90 w-max"
                href="/signin"
              >
                Log In
              </Link>
            </p>
          )}

          <ThemeSwitch />
        </div>
      </div>
      {/*//! For Modile  */}
      <div className={`relative ${deviceWidth <= 500 ? "" : "hidden"}`}>
        <div className="flex dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white text-black dark:text-white py-3 gap-5 md:gap-0 items-center justify-between px-10">
          <Image
            src="/images/logo-white.png"
            width={"45"}
            height={"45"}
            alt="Logo"
            className=""
          />
          {isSideBarOpen ? (
            <FaTimes
              className="text-2xl"
              onClick={() => setIsSideBarOpen(false)}
            />
          ) : (
            <FaBars
              className="text-2xl"
              onClick={() => setIsSideBarOpen(true)}
            />
          )}
        </div>
        <div
          className={`duration-300 ease-linear transition-all flex flex-col items-center justify-center gap-5 md:gap-10 dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white text-black dark:text-white py-5 fixed w-full ${
            isSideBarOpen ? "top-0" : "top-96"
          }`}
        >
          <p className="">
            <Link onClick={() => setIsSideBarOpen(false)} href="/">
              Home
            </Link>
          </p>
          {loading
            ? null
            : user &&
              user.success &&
              user.isClient &&
              user.isClientVerified && (
                <p>
                  <Link onClick={() => setIsSideBarOpen(false)} href="/order">
                    Order
                  </Link>
                </p>
              )}
          {/* <p> */}
          <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            Support
          </Link>
          <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            Contact Us
          </Link>
          <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            About Us
          </Link>
          <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            Our Gallery
          </Link>
          {/* </p> */}
          {loading ? (
            <CgSpinner className="text-2xl text-sky-500 animate-spin" />
          ) : user && user.success ? (
            <p>
              <Link
                onClick={() => setIsSideBarOpen(false)}
                className="bg-sky-500 hover:bg-blue-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
                href="/profile"
              >
                Profile
              </Link>
            </p>
          ) : (
            <p>
              <Link
                onClick={() => setIsSideBarOpen(false)}
                className="bg-sky-500 hover:bg-sky-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90 w-max"
                href="/signin"
              >
                Log In
              </Link>
            </p>
          )}

          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
