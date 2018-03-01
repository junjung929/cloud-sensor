import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { Content } from "./styles";
const Err = ({ header }) => {
  return (
    <div>
      <h3 className="text-center">{header}</h3>
    </div>
  );
};
export const ContentErr = ({ id, message }) => {
  return (
    <Content id={id} className="text-center">
      <Err header={message} />
    </Content>
  );
};

export const Loading = () => {
  return (
    <Dimmer active>
      <Loader>Loading</Loader>
    </Dimmer>
  );
};
