import React from "react";
import { Card } from "react-bootstrap";

const CustomCard = (props) => {
  let { data } = props;
  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>{data.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {data.description}
          </Card.Subtitle>
          <Card.Text>View Certficate</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CustomCard;
