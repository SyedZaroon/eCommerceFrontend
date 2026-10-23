import React, { useEffect, useReducer, useState } from "react";
import styles from "./sideBar.module.css";
import clsx from "clsx";
import logo from "../../assets/images/PriceFirst.png";
import { NavLink } from "react-router-dom";
import ArrowDown from "../../assets/icons/ArrowDown";
import SubMenu from "../subMenu/SubMenu";
import { CloseCircle } from "iconsax-reactjs";
import { formatString } from "../../utils/formatString";

const Sidebar = ({ view = false, onClose, menu }) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const mousePosition = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (view) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [view]);

  return (
    <>
      {view && (
        <div
          className={styles.overlay}
          onClick={() => {
            onClose();
            dispatch({ type: "RESET" });
          }}
          onMouseMove={mousePosition}
        >
          <div
            className={styles.closeFloating}
            style={{ left: cursorPos.x, top: cursorPos.y }}
          >
            <CloseCircle />
          </div>
        </div>
      )}

      <div className={clsx(styles.sidebar, view ? styles.open : styles.close)}>
        <div className={styles["sidebar-header"]}>
          <NavLink to="/">
            <img src={logo} alt="logo" width="" height="" />
          </NavLink>
          <span
            onClick={() => {
              onClose();
              dispatch({ type: "RESET" });
            }}
            className={styles["close-btn"]}
          >
            <CloseCircle />
          </span>
        </div>

        <div className={styles["sidebar-menu"]}>
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
    </>
  );
};

export default Sidebar;
