import React from "react";
import { Link } from "react-router-dom";
import { Content as ContentStyle } from "./styles";
import { Card, Icon, Button, Dimmer, Loader } from "semantic-ui-react";
import { Err } from "../../components";

export const Loading = () => {
    return (
      <Dimmer active>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  };
  