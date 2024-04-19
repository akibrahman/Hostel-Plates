import Image from "next/image";

const Footer = () => {
  return (
    <footer className="dark:bg-stone-900 dark:text-white p-4 md:p-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        <div>
          <p className="text-xl font-semibold">Hostel Meal Management System</p>
          <p className="mt-2">
            Manage your hostel meals efficiently with our platform.
          </p>
          <ul className="mt-4">
            {/* <li>
              <Link href="/" className="text-gray-400 hover:underline">
                Home
              </Link>
            </li> */}
          </ul>
        </div>
        <div>
          {/* <div className="mt-4 flex items-center">
            <input
              type="text"
              placeholder="Subscribe to our newsletter"
              className="dark:bg-[#282828] bg-stone-300 text-white px-4 py-2 rounded-l-md focus:outline-none w-[200px] md:w-[250px] lg:w-[320px]"
            />
            <button className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-red-700 focus:outline-none">
              Subscribe
            </button>
          </div> */}
          <div className="flex items-center justify-center mt-10">
            <Image
              className="w-44"
              height={100}
              width={140}
              src="/images/logo-white.png"
              alt="Logo"
            />
          </div>
        </div>
      </div>
      <p className="text-sm dark:text-gray-400 text-center pt-6 md:py-2">
        &copy; 2024 Hostel Meal Management System - All rights reserved by{" "}
        <span className="font-bold text-blue-500">Akib Rahman</span>
      </p>
    </footer>
  );
};

export default Footer;
