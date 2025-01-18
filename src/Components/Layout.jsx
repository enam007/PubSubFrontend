import { Outlet } from "react-router-dom";
import UpperHeader from "./UpperHeader.jsx";
import Header from "./header";

const Layout = () => {
  return (
    <div>
      <UpperHeader />
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
