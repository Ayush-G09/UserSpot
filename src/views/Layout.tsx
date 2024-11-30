import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function Layout() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Header />
      <div style={{ width: "100%", height: "93%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;