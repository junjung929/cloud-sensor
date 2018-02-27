import React from "react";
import { Link } from "react-router-dom";
import { Content as ContentStyle } from "./styles";
import { Card, Icon, Button, Dimmer, Loader } from "semantic-ui-react";
import { Err } from "../../components";

export const Content = ({
  id,
  icon,
  header,
  cards,
  url,
  page,
  pages,
  onLeftClick,
  onRightClick
}) => {
  return (
    <ContentStyle id={id}>
      <h3 className="text-center">
        <Icon name={icon} />
        {header}
      </h3>
      <Card.Group style={{ justifyContent: "center" }}>{cards()}</Card.Group>
      {Math.ceil(pages) > 1 ? (
        <Button.Group
          as={Link}
          to={url}
          className="pull-right"
          style={{ margin: "10px" }}
        >
          <Button
            icon="angle left"
            disabled={page > 0 ? false : true}
            onClick={onLeftClick}
          />
          <Button
            icon="angle right"
            disabled={page + 1 < Math.ceil(pages) ? false : true}
            onClick={onRightClick}
          />
        </Button.Group>
      ) : null}
    </ContentStyle>
  );
};
export const ContentErr = ({ id, message }) => {
  return (
    <ContentStyle id={id} className="text-center">
      <Err header={message} />
    </ContentStyle>
  );
};
export const Loading = () => {
  return (
    <Dimmer active>
      <Loader>Loading</Loader>
    </Dimmer>
  );
};
