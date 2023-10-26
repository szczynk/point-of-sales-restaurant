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
import store from "./redux/store";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<Default />}>
        <Route path="login" element={<Login />} />

        <Route element={<DefaultProtected />}>
          <Route index element={<Home />} />
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
