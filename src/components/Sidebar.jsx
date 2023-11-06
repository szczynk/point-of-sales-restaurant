import { bool, func } from "prop-types";
import {
  FaCartShopping,
  FaChartBar,
  FaMoneyBill,
  FaRightFromBracket,
} from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

function Sidebar(props) {
  const { slim, toggleSidebar } = props;

  const { pathname } = useLocation();

  return (
    <>
      <aside className="overflow-y-auto">
        <div
          className={`flex h-full flex-col items-center transition-all ${
            slim ? "w-16" : "w-40"
          }`}
        >
          <button
            className="mt-3 flex w-full items-center px-4"
            onClick={toggleSidebar}
          >
            <div>
              <svg
                className="h-8 w-8 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
            </div>
            <span
              className={`ml-1.5 text-base font-bold ${
                slim ? "hidden" : "inline"
              }`}
            >
              Bangsa
            </span>
          </button>
          <div className="w-full px-2">
            <div className="mt-3 flex w-full flex-col items-center border-t border-gray-300">
              <Link
                to={"/"}
                className={`mt-2 flex h-12 w-full items-center rounded px-3 ${
                  pathname === "/" ? "bg-gray-300" : "hover:bg-gray-300"
                }`}
              >
                <div className="h-6 w-6">
                  <FaChartBar className="h-6 w-6"></FaChartBar>
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    slim ? "hidden" : "inline"
                  }`}
                >
                  POS
                </span>
              </Link>
              <Link
                to={"/products"}
                className={`mt-2 flex h-12 w-full items-center rounded px-3 ${
                  pathname === "/products" ? "bg-gray-300" : "hover:bg-gray-300"
                }`}
              >
                <div className="h-6 w-6">
                  <FaCartShopping className="h-6 w-6"></FaCartShopping>
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    slim ? "hidden" : "inline"
                  }`}
                >
                  Products
                </span>
              </Link>
              <Link
                to={"/transactions"}
                className={`mt-2 flex h-12 w-full items-center rounded px-3 ${
                  pathname === "/transactions"
                    ? "bg-gray-300"
                    : "hover:bg-gray-300"
                }`}
              >
                <div className="h-6 w-6">
                  <FaMoneyBill className="h-6 w-6"></FaMoneyBill>
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    slim ? "hidden" : "inline"
                  }`}
                >
                  Transactions
                </span>
              </Link>
            </div>
            <div className="mt-2 flex w-full flex-col items-center border-t border-gray-300">
              <button
                type="button"
                className="mt-2 flex h-12 w-full items-center rounded px-3 hover:bg-gray-300"
              >
                <div className="h-6 w-6">
                  <FaRightFromBracket className="h-6 w-6"></FaRightFromBracket>
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    slim ? "hidden" : "inline"
                  }`}
                >
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  slim: bool,
  toggleSidebar: func,
};

export default Sidebar;
