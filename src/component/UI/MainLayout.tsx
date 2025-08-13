import { Outlet } from "react-router-dom";
import Sidebar from "../UI/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex bg-white">
      <div>
        <Sidebar />
      </div>
      <div className="flex-1 p-2">
        <Outlet />
      </div>
    </div>
  );
}
