import { useState } from "react";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { PiBankFill } from "react-icons/pi";
import {
  MdSpaceDashboard,
  MdNoEncryptionGmailerrorred,
  MdOutlineLogout,
} from "react-icons/md";
import { HiMiniClipboardDocument } from "react-icons/hi2";

const LISTITEMS = [
  { id: "l1", theName: "Home", icon: <HiHome /> },
  { id: "l2", theName: "Profile", icon: <MdSpaceDashboard /> },
];

export default function Sidebar() {
  const [showEncryptprt, setShowEncryptprt] = useState(false);
  return (
    <main className="flex flex-col justify-between w-[15rem] h-screen bg-[#0C1E35] pb-2">
      <div className="space-y-8 mt-4 pl-2">
        <div>
          <h1>Logo</h1>
        </div>
        <div>
          <ul className="cursor-pointer text-[#d0efff]">
            {LISTITEMS.map((item) => (
              <li key={item.id} className="py-1 flex items-center gap-2">
                {item.icon}
                {item.theName}
              </li>
            ))}
            <li>
              <span className="cursor-pointer">
                <button
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowEncryptprt((prev) => !prev)}
                >
                  <MdNoEncryptionGmailerrorred /> Encrypt File
                </button>
              </span>
              {showEncryptprt && (
                <span>
                  <ul className="ml-4">
                    <li className="py-0.5">
                      <Link
                        to="/bank-app"
                        className=" flex items-center gap-2 !text-[#d0efff]"
                      >
                        <PiBankFill /> Bank App Logins
                      </Link>
                    </li>
                    <li className="py-0.5 flex items-center gap-2">
                      {" "}
                      <HiMiniClipboardDocument /> Document
                    </li>
                  </ul>
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className=" w-full">
        <button className="mx-auto w-1/2 bg-red-500 rounded-[32px] py-2 flex items-center justify-center gap-2 cursor-pointer">
          <MdOutlineLogout />
          Logout
        </button>
      </div>
    </main>
  );
}
