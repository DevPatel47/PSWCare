function Button({
  variant = "primary",
  type = "button",
  className = "",
  children,
  ...props
}) {
  const classes = {
    primary: "ui-btn-primary",
    secondary: "ui-btn-secondary",
    danger: "ui-btn-danger",
    success: "ui-btn-success",
  };

  return (
    <button
      type={type}
      className={`${classes[variant] || classes.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
