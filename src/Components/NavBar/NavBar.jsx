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

  const [guardianMoadl, setGuardianModal] = useState(false);

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
  const guardianModalOpen = () => {
    setGuardianModal(true);
  };
  const guardianModalClose = () => {
    setGuardianModal(false);
  };
  return (
    <div className="relative">
      {/* Modal  */}
      {guardianMoadl && (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center">
          <div className="w-[90%] h-[90%] dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white relative">
            <FaTimes
              onClick={guardianModalClose}
              className="text-xl absolute top-5 right-5 cursor-pointer"
            />
          </div>
        </div>
      )}
      {/*//! For Desktop  */}
      <div
        className={`${
          deviceWidth <= 500 ? "hidden" : "flex"
        } dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white text-black dark:text-white flex-col md:flex-row gap-5 md:gap-0 items-center justify-between px-10`}
      >
        <Image
          src="/images/logo.png"
          width={"80"}
          height={"80"}
          alt="Logo"
          className="h-20 w-20 p-1 rounded-full"
        />
        <div className="flex items-center justify-center gap-10">
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
          {/* <Link className="pointer-events-none text-stone-400" href="/help">
            Support
          </Link> */}
          {/* <Link className="pointer-events-none text-stone-400" href="/help">
            Contact Us
          </Link> */}
          <Link className="" href="/about-us">
            About Us
          </Link>
          {/* <Link className="pointer-events-none text-stone-400" href="/help">
            Our Gallery
          </Link> */}
          {/* </p> */}

          {loading ? (
            <CgSpinner className="text-2xl text-sky-500 animate-spin" />
          ) : (
            (user && user.success) || (
              <p
                onClick={() => {
                  guardianModalOpen();
                }}
                className="bg-sky-500 hover:bg-sky-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90 w-max cursor-pointer"
              >
                Guardian&apos;s query
              </p>
            )
          )}

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
        <div className="flex dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white text-black dark:text-white py-1 gap-5 md:gap-0 items-center justify-between px-10">
          <Image
            src="/images/logo.png"
            width={"60"}
            height={"60"}
            alt="Logo"
            className="p-1 rounded-full"
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
          className={`duration-300 ease-linear transition-all ffflex flex-col items-center justify-center gap-5 md:gap-10 dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white text-black dark:text-white py-5 absolute w-full z-50 border-b border-blue-500 ${
            isSideBarOpen ? "flex" : "hidden"
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
          {/* <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            Support
          </Link> */}
          {/* <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            Contact Us
          </Link> */}
          <Link
            onClick={() => setIsSideBarOpen(false)}
            className=""
            href="/about-us"
          >
            About Us
          </Link>
          {/* <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            Our Gallery
          </Link> */}
          {/* </p> */}
          {loading ? (
            <CgSpinner className="text-2xl text-sky-500 animate-spin" />
          ) : (
            (user && user.success) || (
              <p
                onClick={() => {
                  setIsSideBarOpen(false);
                  guardianModalOpen();
                }}
                className="bg-sky-500 hover:bg-sky-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90 w-max cursor-pointer"
              >
                Guardian&apos;s query
              </p>
            )
          )}
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
