import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import LoadingPage from "../components/LoadingPage";

function DefaultProtected() {
  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);

  const { pathname } = useLocation();

  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }

  if (!isLoggedIn) {
    return <Navigate to={"/login"} state={{ from: pathname }} replace />;
  }

  return <Outlet />;
}

export default DefaultProtected;
