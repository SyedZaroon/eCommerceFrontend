import React, { useId } from "react";
import styles from "./inputfields.module.css";
import clsx from "clsx";

const InputFields = ({
  children,
  label = "",
  errormessage = "Error message",
  variant = "",
  className = "",
  placeholder = "Value",
  disabled = false,
  required = false,
  checked = false,
  error = false,
  success = false,
  prefixIcon = null,
  suffixIcon = null,
  type = "",
  name = "",
  value = "",
  onChange = () => {},
}) => {
  const inputClasses = [
    styles["input-field"],
    prefixIcon || suffixIcon ? styles["icon-input-field"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const iconWrapperClasses = [
    clsx(
      styles["input-field"],
      prefixIcon ? styles["prefixIcon-box"] : "",
      suffixIcon ? styles["suffixIcon-box"] : "",
      error ? styles["input-error"] : "",
      success ? styles["input-success"] : "",
      styles[`input-field-${variant}`],
      disabled ? styles[`disabled-${variant}`] : "",
      variant === "text" ? styles["text-field"] : "",
      className
    ),
  ];

  const id = useId();
  const inputId = `${id}-${name}`;

  return (
    <label className={styles["input-box"]}>
      {label && <span className={styles["input-label"]}>{label}</span>}

      <div className={iconWrapperClasses}>
        {prefixIcon && (
          <span className={styles["prefix-icon"]}>{prefixIcon}</span>
        )}

        {type === "radio" ? (
          <>
            <input
              className={styles["radio-box"]}
              variant={variant}
              error="error"
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              type="radio"
              name={name}
              value={value}
              checked={checked}
              id={inputId}
              onChange={onChange}
            />
            <span className={styles["radio"]}></span>
            {children}
          </>
        ) : (
          <input
            id={inputId}
            className={inputClasses}
            variant={variant}
            error="error"
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
          />
        )}

        {suffixIcon && (
          <span
            className={[
              styles["suffix-icon"],
              error && styles["error-icon"],
              success && styles["success-icon"],
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {React.isValidElement(suffixIcon)
              ? React.cloneElement(suffixIcon, { disabled })
              : suffixIcon}
          </span>
        )}
      </div>

      {error && <span className={styles["input-label"]}>{errormessage}</span>}
    </label>
  );
};

export default InputFields;
