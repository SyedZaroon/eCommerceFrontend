import React from "react";
import styles from "../collectionPage.module.css";

const CollectionStatus = ({
  title,
  message,
  actionLabel,
  onAction,
  status = "status",
}) => {
  if (status === "loading") {
    return <p role="status">{message}</p>;
  }

  return (
    <div className={styles.emptyState}>
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className={styles.resetButton}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default CollectionStatus;
