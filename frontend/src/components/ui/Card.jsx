function Card({ className = "", children }) {
  return <section className={`ui-card ${className}`}>{children}</section>;
}

export default Card;
