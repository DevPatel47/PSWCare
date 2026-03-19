import Button from "./Button";

function ClayButton({ variant = "primary", ...props }) {
  const map = {
    primary: "primary",
    secondary: "secondary",
    accent: "success",
  };

  return <Button variant={map[variant] || "primary"} {...props} />;
}

export default ClayButton;
