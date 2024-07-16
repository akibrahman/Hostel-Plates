"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import ManagerEditRoomComponent from "./ManagerEditRoomComponent";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteObject, listAll, ref } from "firebase/storage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../dashboard.css";
import { storage } from "../../../../firebase.config";

const ManagerAllRoomsComponent = ({ user }) => {
  const route = useRouter();
  const { data: rooms, refetch } = useQuery({
    queryKey: ["All Rooms", "Manager Only", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/room`);
      if (data.success) {
        return data.rooms;
      } else {
        return null;
      }
    },
    enabled: user?._id ? true : false,
  });

  const [editRoomId, setEditRoomId] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditRoomId("");
  };

  const [deleting, setDeleting] = useState(false);

  const deleteFolderContents = async (folderRef) => {
    const listResponse = await listAll(folderRef);
    const deletePromises = listResponse.items.map((itemRef) =>
      deleteObject(itemRef)
    );
    const folderDeletePromises = listResponse.prefixes.map((subFolderRef) =>
      deleteFolderContents(subFolderRef)
    );
    await Promise.all([...deletePromises, ...folderDeletePromises]);
  };

  const deleteRoom = async (id, name) => {
    const confirmed = confirm("Are you sure to delete the room?");
    if (!confirmed) return;
    setDeleting(true);
    try {
      const { data } = await axios.delete(`/api/room?id=${id}&name=${name}`);
      if (data.success) {
        if (data.count == 0) {
          const deleteRef = ref(storage, `rooms/${name}`);
          await deleteFolderContents(deleteRef);
        }
        await refetch();
        toast.success("Room deleted successfully");
      } else {
        toast.error("Server error, Try Again");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error, Try Again");
    } finally {
      setDeleting(false);
    }
  };

  if (!rooms) return <PreLoader />;

  return (
    <>
      <ManagerEditRoomComponent
        id={editRoomId}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        refetch={refetch}
      />
      <div className="min-h-full mx-auto p-6 bg-dashboard text-slate-100">
        <h1 className="text-2xl font-bold mb-4 text-center">Rooms</h1>
        <div className="flex flex-col gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="shadow-md shadow-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 md:gap-0"
            >
              <div className="flex items-center justify-center gap-5">
                <div className="flex flex-col items-start justify-center gap-1">
                  <label className="block text-slate-100 font-semibold">
                    Name: {convertCamelCaseToCapitalized(room.name)}
                  </label>
                  <label className="block text-slate-100 font-semibold">
                    Block: {convertCamelCaseToCapitalized(room.block)}
                  </label>
                  <label className="block text-slate-100 font-semibold">
                    Type: {convertCamelCaseToCapitalized(room.type)}
                  </label>
                  <label className="block text-slate-100 font-semibold">
                    Floor: {room.floor}
                    {room.floor == 1 ? (
                      <sup>st</sup>
                    ) : room.floor == 2 ? (
                      <sup>nd</sup>
                    ) : room.floor == 3 ? (
                      <sup>rd</sup>
                    ) : (
                      <sup>th</sup>
                    )}{" "}
                    Floor
                  </label>
                </div>
                <div className="flex flex-col items-start justify-center gap-1">
                  <label className="block text-slate-100 font-semibold">
                    Seats: {room.seats}
                  </label>
                  <label className="block text-slate-100 font-semibold">
                    Balcony:{" "}
                    {room.balcony.balconyState ? "Available" : "Not Available"}
                  </label>
                  <label className="block text-slate-100 font-semibold">
                    Toilet:{" "}
                    {convertCamelCaseToCapitalized(room.toilet.toiletType)}
                  </label>
                </div>
              </div>

              <div className="">
                <video
                  src={room.video.src}
                  title={`Room ${room.name} Video`}
                  className="aspect-auto"
                  height={50}
                  width={100}
                  controls
                ></video>
              </div>

              <div className="flex flex-col items-center gap-6 bg-gray-500 p-5 rounded-md">
                <h3 className="text-lg font-medium">Pictures</h3>
                <div className="flex items-center justify-center gap-3">
                  <Image
                    unoptimized={true}
                    src={room.image.src}
                    alt={`Room ${room.name}`}
                    className="aspect-square rounded-full"
                    width={60}
                    height={60}
                  />
                  <Image
                    unoptimized={true}
                    src={room.sketch.src}
                    alt={`Room ${room.name} Sketch`}
                    className="aspect-square rounded-full"
                    width={60}
                    height={60}
                  />
                  <Image
                    unoptimized={true}
                    src={room.toilet.image.src}
                    alt={`Room ${room.name} Toilet`}
                    className="aspect-square rounded-full"
                    width={60}
                    height={60}
                  />
                  <Image
                    unoptimized={true}
                    src={
                      room.balcony.balconyState
                        ? room.balcony.image.src || "/images/no-balcony.png"
                        : "/images/no-balcony.png"
                    }
                    alt={`Room ${room.name} Balcony`}
                    className="aspect-square rounded-full"
                    width={60}
                    height={60}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 rounded-md">
                <h3 className="text-lg font-medium">Beds</h3>
                <Swiper
                  modules={[Autoplay, Pagination]}
                  autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  className="w-[200px] rounded-md p-0 m-0 pagination-little-lower"
                >
                  {room.beds.map((bed) => (
                    <SwiperSlide className="rounded-md" key={bed._id}>
                      <div className="bg-gray-500 p-4 shadow-sm mb-4 flex items-center justify-center gap-2 rounded-md">
                        <label className="block text-slate-100 font-semibold">
                          Bed No: {convertCamelCaseToCapitalized(bed.bedNo)}
                        </label>
                        <Image
                          unoptimized={true}
                          src={bed.image.src}
                          alt={`Bed ${bed.bedNo}`}
                          className="aspect-square rounded-full"
                          width={60}
                          height={60}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="flex flex-row md:flex-col items-center justify-center gap-5 md:gap-10 mt-5 md:mt-0">
                <FaDeleteLeft
                  onClick={() => deleteRoom(room._id, room.name)}
                  className="font-semibold text-2xl text-red-500 cursor-pointer duration-300 active:scale-90"
                />
                <FaEdit
                  onClick={() => {
                    setEditRoomId(room._id);
                    openModal();
                  }}
                  className="font-semibold text-2xl text-orange-500 cursor-pointer duration-300 active:scale-90"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ManagerAllRoomsComponent;
