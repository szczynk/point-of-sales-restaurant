import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Default from "./layouts/Default";
import DefaultProtected from "./layouts/DefaultProtected";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import Transactions from "./pages/Transactions";
import store from "./redux/store";
import OrdersDetail from "./pages/OrdersDetail";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<Default />}>
        <Route path="login" element={<Login />} />

        <Route element={<DefaultProtected />}>
          <Route index element={<Home />} />

          <Route path="payment" element={<Payment />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:id" element={<OrdersDetail />} />
        </Route>
      </Route>
    </Route>,
  ),
);

function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
