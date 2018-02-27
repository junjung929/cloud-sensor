import React from "react";
import { Card, Image } from "semantic-ui-react";

const WhiteImg = require("../assets/white-image.png");
export const Profile = ({
  src,
  alt,
  header,
  meta,
  description,
  extra,
  color,
  size
}) => {
  return (
    <Card color={color} className="fadeIn">
      {src ? (
        <Image src={src} size={size} centered alt={`${alt}-profile-image`} />
      ) : (
        <Image
          src={String(WhiteImg)}
          centered
          size="small"
          alt={`${alt}-profile-image`}
        />
      )}
      <Card.Content>
        <Card.Header>{header}</Card.Header>
        <Card.Meta>{meta}</Card.Meta>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>{extra}</Card.Content>
    </Card>
  );
};
export const SubProfile = ({
  src,
  alt,
  header,
  meta,
  description,
  extra,
  color,
  size,
  floated
}) => {
  return (
    <Card color={color} className="fadeIn">
      <Card.Content>
        {src ? (
          <Image
            src={src}
            size={size}
            floated={floated}
            alt={`${alt}-profile-image`}
          />
        ) : (
          <Image
            src={String(WhiteImg)}
            size={size}
            floated={floated}
            alt={`${alt}-profile-image`}
          />
        )}
        <Card.Header>{header}</Card.Header>
        <Card.Meta>{meta}</Card.Meta>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>{extra}</Card.Content>
    </Card>
  );
};
