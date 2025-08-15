import { Outlet } from "react-router-dom";
import Sidebar from "../UI/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex bg-white">
      <div>
        <Sidebar />
      </div>
      <div className="ml-[15rem] flex-1 px-2">
        <Outlet />
      </div>
    </div>
  );
}
