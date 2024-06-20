import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";
import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import toast from "react-hot-toast";

const ManagerAllUsers = ({ user }) => {
  const [clientName, setClientName] = useState("");
  const [clientDetailsIsLoading, setClientDetailsIsLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [clientDetailsModalIsOpen, setClientDetailsModalIsOpen] =
    useState(false);
    const [givingAuthorization, setGivingAuthorization] = useState(false);
    const [declining, setDeclining] = useState(false);

  const { data: clients, refetch: clientRefetch } = useQuery({
    queryKey: ["clients", "manager", user?._id, clientName],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}&onlyApproved=0&clientName=${clientName}`
      );
      const array = data.clients;
      array.sort((b, a) => {
        if (a.isClientVerified === b.isClientVerified) {
          return 0;
        } else if (a.isClientVerified) {
          return -1;
        } else {
          return 1;
        }
      });
      return array;
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  const customStylesForclientDetailsModal = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      // backgroundColor: "#000",
      // border: "1px solid #EAB308",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };

  const openModalForClientDetails = () => {
    setClientDetailsModalIsOpen(true);
  };

  const closeModalForClientDetails = () => {
    setClientDetailsModalIsOpen(false);
  };

  const getDetailsOfClientForApproval = async (id) => {
    setClientDetailsIsLoading(true);
    setClientDetails(null);
    try {
      const { data } = await axios.get(`/api/clients/getclient?id=${id}`);
      if (data.success) {
        console.log(data.client);
        setClientDetails(data.client);
        openModalForClientDetails();
      }
    } catch (error) {
      closeModalForClientDetails();
      setClientDetails(null);
      console.log(error);
      toast.error("Something went wrong, Try again");
    } finally {
      setClientDetailsIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        // appElement={el}
        isOpen={clientDetailsModalIsOpen}
        onRequestClose={closeModalForClientDetails}
        style={customStylesForclientDetailsModal}
      >
        {clientDetails && (
          <div className="dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white dark:text-white font-semibold p-10 h-[90vh] overflow-y-scroll w-full">
            <div className="flex items-center gap-10">
              <div className="mb-4">
                <Image
                  width={150}
                  height={150}
                  src={clientDetails.profilePicture}
                  alt="Profile Picture"
                  className="object-cover aspect-square rounded-full"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {clientDetails.username}
                </h1>
                <p className="mb-2">Email: {clientDetails.email}</p>
                <p>
                  Floor: {clientDetails.floor}
                  <sup>th</sup> Floor - {clientDetails.floor + 1} Tala
                </p>
                <p>
                  Room Number:{" "}
                  {clientDetails.roomNumber.split("")[0].toUpperCase() +
                    "-" +
                    clientDetails.roomNumber.split("")[1]}
                </p>
                <p className="mb-1">
                  Contact Number: {clientDetails.contactNumber}
                </p>
                <p className="mb-1">
                  Father&apos;s Number: {clientDetails.fathersNumber}
                </p>
                <p className="mb-1">
                  Mother&apos;s Number: {clientDetails.mothersNumber}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 my-6">
              {clientDetails.nidFrontPicture && (
                <div className="">
                  <Image
                    width={400}
                    height={170}
                    src={clientDetails.nidFrontPicture}
                    alt="NID Photo Front"
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              {clientDetails.nidBackPicture && (
                <div>
                  <Image
                    width={400}
                    height={170}
                    src={clientDetails.nidBackPicture}
                    alt="NID Photo Back"
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            {clientDetails.birthCertificatePicture && (
              <div className="mb-4 flex justify-center">
                <Image
                  width={300}
                  height={700}
                  src={clientDetails.birthCertificatePicture}
                  alt="Birth Certificate"
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex items-center justify-center gap-4 my-10">
              <button
                onClick={async () => {
                  const confirmation = confirm(
                    "Are you sure to decline your client?"
                  );
                  if (confirmation) {
                    //! Here
                    setDeclining(true);
                    try {
                      const { data } = await axios.post(
                        "api/clients/declineclient",
                        { id: clientDetails._id }
                      );
                      if (data.success) {
                        await clientRefetch();
                        toast.success("Client Declined");
                      }
                    } catch (error) {
                      console.log("Frontend problem when declining a client");
                      console.log(error);
                      toast.error("Authorization Error!");
                    } finally {
                      setDeclining(false);
                      closeModalForClientDetails();
                    }
                  } else {
                    toast.success("Cancelled!");
                  }
                }}
                className="bg-red-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
              >
                Decline
                {declining && <CgSpinner className="animate-spin text-2xl" />}
              </button>
              <button
                onClick={async () => {
                  const confirmation = confirm(
                    "Are you sure to make your client?"
                  );
                  if (confirmation) {
                    //! Here
                    setGivingAuthorization(true);
                    try {
                      await axios.post("/api/orders/makeorders", {
                        userId: clientDetails._id,
                        managerId: user._id,
                        days: parseInt(currentDays[currentDays.length - 1]),
                        currentMonthName: new Date().toLocaleDateString(
                          "en-BD",
                          {
                            month: "long",
                            timeZone: "Asia/Dhaka",
                          }
                        ),
                        currentDateNumber: parseInt(
                          new Date().toLocaleDateString("en-BD", {
                            day: "numeric",
                            timeZone: "Asia/Dhaka",
                          })
                        ),
                        currentMonth: new Date(
                          new Date().toLocaleString("en-US", {
                            timeZone: "Asia/Dhaka",
                          })
                        ).getMonth(),
                        currentYear: new Date(
                          new Date().toLocaleString("en-US", {
                            timeZone: "Asia/Dhaka",
                          })
                        ).getFullYear(),
                      });

                      const { data } = await axios.post(
                        "api/clients/approveclient",
                        { id: clientDetails._id }
                      );
                      if (data.success) {
                        await clientRefetch();
                        toast.success("Authorization Provided");
                      }
                    } catch (error) {
                      console.log(
                        "Frontend problem when authorizing as a client"
                      );
                      console.log(error);
                      toast.error("Authorization Error!");
                    } finally {
                      setGivingAuthorization(false);
                      closeModalForClientDetails();
                    }
                  } else {
                    toast.success("Cancelled!");
                  }
                }}
                className="bg-green-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
              >
                Approve
                {givingAuthorization && (
                  <CgSpinner className="animate-spin text-2xl" />
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
      <div className="px-3 flex flex-col items-center gap-4 mt-10 relative">
        <div className="pb-2 bg-transparent flex justify-center sticky top-0">
          <div className="relative">
            <input
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Search by name"
              type="text"
              className="w-80 px-4 pl-12 py-3 rounded-full text-white font-semibold bg-dashboard focus:outline-none placeholder:text-white"
            />
            <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-lg text-white" />
          </div>
        </div>

        {clientName && !clients ? (
          <p className="mt-4 flex items-center gap-1 font-semibold">
            <CgSpinner className="animate-spin text-lg" />
            Loading...
          </p>
        ) : (
          clients?.map((client, i) => (
            <div
              key={client._id}
              className="border px-6 py-5 rounded-lg flex flex-col md:flex-row items-center w-[95%] justify-between gap-4"
            >
              <p>{i + 1}</p>
              <Image
                alt={`Profile picture of ${client.username} who is a manager`}
                src={client.profilePicture}
                height={60}
                width={60}
                className="rounded-full aspect-square"
              />
              <div className="md:w-[900px] md:overflow-x-hidden text-center md:text-left">
                <p>{client.username}</p>
                <p className="text-sm">{client.email}</p>
              </div>
              {client.isVerified === true ? (
                <>
                  {client.isClientVerified === true ? (
                    <>
                      <p className="text-green-500 font-semibold flex items-center gap-1">
                        <TiTick className="text-3xl font-normal" />
                        Approved
                      </p>
                      <Link href={`/userDetails/${client._id}`}>
                        <button className="font-semibold flex items-center gap-2 bg-blue-500 text-white px-3 py-1 duration-300 active:scale-90">
                          Details <FaArrowRight />
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          getDetailsOfClientForApproval(client._id)
                        }
                        className="bg-green-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
                      >
                        Details{" "}
                        {clientDetailsIsLoading && (
                          <CgSpinner className="animate-spin text-2xl" />
                        )}
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-red-500 font-semibold flex items-center gap-1">
                    <FaTimes className="text-xl font-normal" />
                    Unverified
                  </p>
                  <Link href={`/userDetails/${client._id}`}>
                    <button className="font-semibold flex items-center gap-2 bg-blue-500 px-3 py-1 duration-300 active:scale-90">
                      Details <FaArrowRight />
                    </button>
                  </Link>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ManagerAllUsers;
