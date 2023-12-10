import { Link, Outlet, ScrollRestoration } from "react-router-dom";
import logo from "../assets/Logo.svg";
import bgImage from "../assets/hero-image-wr.jpg";

const Layout = () => {
  return (
    <div className="relative min-h-[100vh] bg-[#1B1D1F] font-semibold text-[#D2D5DA]">
      <div
        className="flex h-[250px] items-center justify-center bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Link to="/">
          <img src={logo} alt="" />
        </Link>
      </div>

      <div>
        <Outlet />
      </div>

      <ScrollRestoration />
    </div>
  );
};

export default Layout;
