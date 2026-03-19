import Card from "./Card";

function ClayCard({ className = "", children }) {
  return <Card className={className}>{children}</Card>;
}

export default ClayCard;
