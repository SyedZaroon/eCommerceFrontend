import React from "react";
import Header from "./header/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./footer/Footer";
import CartDrawer from "./cartDrawer/cartDrawer";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  let headerVariant = "header2";

  if (path === "/") {
    headerVariant = "header1";
  } else if (
    path.startsWith("/checkout") ||
    path.startsWith("/thankyou")
  ) {
    headerVariant = "header3";
  }

  return (
    <div className="border">
      <Header variant={headerVariant} />
      <Outlet />
      <CartDrawer />
      <Footer />
    </div>
  );
};

export default Layout;
