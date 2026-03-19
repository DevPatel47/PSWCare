function Input({ id, label, className = "", ...props }) {
  return (
    <label htmlFor={id}>
      {label ? <span className="ui-label">{label}</span> : null}
      <input id={id} className={`ui-input ${className}`} {...props} />
    </label>
  );
}

export default Input;
