import React, { useEffect, useReducer, useState } from "react";
import styles from "./sideBar.module.css";
import clsx from "clsx";
import logo from "../../assets/images/PriceFirst.png";
import { NavLink } from "react-router-dom";
import ArrowDown from "../../assets/icons/ArrowDown";
import SubMenu from "../subMenu/SubMenu";
import { CloseCircle } from "iconsax-reactjs";


const Sidebar = ({ view = false, onClose }) => {
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
    
    const initialState = {
      iphone: false,
      samsung: false,
      pixel: false,
    };
  
  const reducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE":
        return {
          ...state,
          [action.payload]: !state[action.payload],
        };
      case "OPEN_ONLY":
        return {
          iphone: false,
          samsung: false,
          pixel: false,
          [action.payload]: !state[action.payload],
        };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };

  const [subMenu, dispatch] = useReducer(reducer, initialState);


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
          <p
            className={clsx(
              styles["menu-item"],
              subMenu.iphone ? styles["menuopen"] : styles["menuclose"]
            )}
            onClick={() => dispatch({ type: "OPEN_ONLY", payload: "iphone" })}
          >
            <span className={styles["iphone"]}>iPhone</span>
            <span className={styles.arrow}>
              <ArrowDown pathClass={styles["arrow-path"]} />
            </span>
          </p>
          <div
            className={clsx(
              styles["submenu"],
              subMenu.iphone ? styles["submenu-open"] : styles["submenu-close"],
              styles["scrollbar"]
            )}
          >
          </div>
          <p
            className={clsx(
              styles["menu-item"],
              subMenu.samsung ? styles["menuopen"] : styles["menuclose"]
            )}
            onClick={() => dispatch({ type: "OPEN_ONLY", payload: "samsung" })}
          >
            <span>Samsung Phones</span>
            <span className={styles.arrow}>
              <ArrowDown pathClass={styles["arrow-path"]} />
            </span>
          </p>
          <div
            className={clsx(
              styles["submenu"],
              subMenu.samsung
                ? styles["submenu-open"]
                : styles["submenu-close"],
              styles["scrollbar"]
            )}
          >
          </div>
          <p
            className={clsx(
              styles["menu-item"],
              subMenu.pixel ? styles["menuopen"] : styles["menuclose"]
            )}
            onClick={() => dispatch({ type: "OPEN_ONLY", payload: "pixel" })}
          >
            <span>Google Pixels</span>
            <span className={styles.arrow}>
              <ArrowDown pathClass={styles["arrow-path"]} />
            </span>
          </p>
          <div
            className={clsx(
              styles["submenu"],
              subMenu.pixel ? styles["submenu-open"] : styles["submenu-close"],
              styles["scrollbar"]
            )}
          >
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
