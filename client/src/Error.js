import React from "react";
import styles from "./Error.module.css";
import errorImage from "../404-2.avif";

function Error() {
  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorHeading}>404 Error - Page Not Found</h1>
      <p className={styles.errorText}>
        The page you are looking for does not exist.
      </p>
      <img src={errorImage} alt="Error" className={styles.errorImage} />
    </div>
  );
}

export default Error;
