import Input from "./Input";

function ClayInput({ label, id, className = "", ...props }) {
  return <Input label={label} id={id} className={className} {...props} />;
}

export default ClayInput;
