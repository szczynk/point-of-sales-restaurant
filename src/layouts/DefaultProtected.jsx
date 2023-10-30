import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingPage from "../components/LoadingPage";
import Sidebar from "../components/Sidebar";

function DefaultProtected() {
  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);

  const { pathname } = useLocation();

  const [slim, setSlim] = useState(true);
  const toggleSidebar = () => setSlim((prevState) => !prevState);

  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }

  if (!isLoggedIn) {
    return <Navigate to={"/login"} state={{ from: pathname }} replace />;
  }

  return (
    <>
      <div className="flex">
        <Sidebar slim={slim} toggleSidebar={toggleSidebar}></Sidebar>

        <main
          className={`mx-auto p-4 transition-all ${
            slim ? "w-[calc(100vw_-_64px)]" : "w-[calc(100vw_-_160px)]"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default DefaultProtected;
