import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import { NavLink } from "react-router-dom";
import logo from "@/assets/images/PriceFirst.png";
import blacklogo from "@/assets/images/blacklogo.png";
import { HamburgerMenu } from "iconsax-reactjs";
import clsx from "clsx";
import Sidebar from "../sideBar/Sidebar";
import SearchIcon from "../../assets/icons/SearchIcon.jsx";
import { getAllCollections } from "../../services/productCollection.js";
import { formatString } from "../../utils/formatString.js";
import { useCart } from "../../hook/useCart.jsx";


const Header = ({ variant = "header1" }) => {
  const [sideBar, setSideBar] = useState(false);
  const [menu, setMenu] = useState([]);
  const { openCart, totalQuantity } = useCart();

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
          {variant !== "header3" && (
            <button
              type="button"
              className={styles["hamburger-button"]}
              onClick={() => setSideBar(true)}
              aria-label="Open menu"
            >
              <HamburgerMenu size="28" aria-hidden="true" />
            </button>
          )}

          <NavLink
            to="/"
            className={styles["logo-link"]}
            aria-label="Price First home"
          >
            <img
              src={variant === "header3" ? blacklogo : logo}
              alt="Price First"
              className={styles.logo}
            />
          </NavLink>
        </div>

        {variant !== "header3" && (
          <nav className={styles["header-menu"]} aria-label="Collections">
            {menu.map((value) => (
              <NavLink
                to={`/collection/${value.slug}`}
                key={value._id}
                className={styles["menu-link"]}
              >
                {formatString(value.slug)}
              </NavLink>
            ))}
          </nav>
        )}

        {variant !== "header3" && (
          <div
            className={styles["header-actions"]}
            role="group"
            aria-label="Header actions"
          >
            <span
              className={styles["icon-button"]}
              role="img"
              aria-label="Search"
              title="Search"
            >
              <SearchIcon />
            </span>
            <button
              type="button"
              className={clsx(styles["icon-button"], styles["cart-button"])}
              onClick={openCart}
              aria-label={`Open cart${totalQuantity ? `, ${totalQuantity} items` : ""}`}
              title="Cart"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
                className={styles["action-icon"]}
              >
                <path
                  d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
                <circle cx="10" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="20" r="1" fill="currentColor" />
              </svg>
              {totalQuantity > 0 && (
                <span className={styles["cart-count"]} aria-hidden="true">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </button>
            <span
              className={styles["icon-button"]}
              role="img"
              aria-label="Account"
              title="Account"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
                className={styles["action-icon"]}
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M4.5 20a7.5 7.5 0 0 1 15 0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.7"
                />
              </svg>
              <span className={styles["visually-hidden"]}>Account</span>
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
