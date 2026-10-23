import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import { NavLink } from "react-router-dom";
import logo from "@/assets/images/PriceFirst.png";
import blacklogo from "@/assets/images/blacklogo.png";
import { HamburgerMenu } from "iconsax-reactjs";
import clsx from "clsx";
import Sidebar from "../sideBar/Sidebar";
import Inputfield from "../inputFields/InputFields.jsx";
import SearchIcon from "../../assets/icons/SearchIcon.jsx";
import { getAllCollections } from "../../services/productCollection.js";
import { formatString } from "../../utils/formatString.js";

const Header = ({ variant = "header1" }) => {
  const [sideBar, setSideBar] = useState(false);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const collectionlist = async () => {
      const data = await getAllCollections();
      setMenu(data);
    };
    collectionlist();
  }, []);

  return (
    <>
      <Sidebar menu={menu} view={sideBar} onClose={() => setSideBar(false)} />
      <div className={clsx(styles["header"], styles[`${variant}`])}>
        <div className={styles["header-left"]}>
          {variant !== "header3" ? (
            <NavLink to="/">
              <img src={logo} alt="logo" width="" height="" />
            </NavLink>
          ) : (
            <NavLink to="/">
              <img src={blacklogo} alt="logo" width="" height="" />
            </NavLink>
          )}

          <div
            className={clsx(styles["header-menu"], styles[`${variant}-menu`])}
          >
            {menu.map((value) => {
              return (
                <NavLink
                  to={`/collection/${value.slug}`}
                  key={value._id}
                  className={styles["iphone"]}
                >
                  {formatString(value.slug)}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className={styles[`${variant}-hamburger`]}>
          <HamburgerMenu
            size="32"
            className={styles["hambruger-icon"]}
            onClick={() => {
              setSideBar((pre) => !pre);
            }}
          />
        </div>
        <div className={styles[`${variant}-input`]}>
          <Inputfield
            className={styles[`${variant}-field`]}
            variant="border"
            placeholder="Search devices"
            prefixIcon={<SearchIcon />}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
