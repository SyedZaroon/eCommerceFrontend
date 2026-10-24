import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import logo from "../../assets/images/PriceFirst.png";
import { formatString } from "../../utils/formatString";
import styles from "./sideBar.module.css";

const Sidebar = ({ view = false, onClose, menu = [] }) => {
  useEffect(() => {
    if (!view) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [view, onClose]);

  if (!view) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className={styles.sidebar}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <header className={styles.sidebarHeader}>
          <NavLink to="/" onClick={onClose} aria-label="Price First home">
            <img src={logo} alt="Price First" className={styles.logo} />
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close menu"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <nav className={styles.sidebarMenu} aria-label="Collections">
          <p className={styles.sectionTitle}>Shop by collection</p>
          {menu.map((value) => (
            <NavLink
              to={`/collection/${value.slug}`}
              key={value._id}
              className={({ isActive }) =>
                clsx(styles.menuLink, isActive && styles.menuLinkActive)
              }
              onClick={onClose}
            >
              <span>{formatString(value.slug)}</span>
              <span className={styles.menuArrow} aria-hidden="true">
                →
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
