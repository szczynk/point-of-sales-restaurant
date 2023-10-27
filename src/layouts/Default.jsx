import { Outlet } from "react-router-dom";

function Default() {
  return (
    <>
      <main className="mx-auto max-w-7xl p-4">
        <Outlet />
      </main>
    </>
  );
}

export default Default;
