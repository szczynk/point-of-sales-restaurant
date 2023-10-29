import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function Default() {
  const { pathname } = useLocation();
  const hideOnPages = ["/login", "/register"];
  const showDefault = !hideOnPages.includes(pathname);

  return (
    <>
      <div className="flex">
        {showDefault && <Sidebar></Sidebar>}

        <main className="mx-auto w-[calc(100vw_-_160px)] p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Default;
