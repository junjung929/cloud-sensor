import _ from "lodash";
import React from "react";
import { Content as ContentStyle } from "./styles";
import {
  Icon,
  Button,
  Header,
  Image,
  Modal as ModalContent
} from "semantic-ui-react";
import { Table } from "../../components";

export const Content = ({ tHead, tBody, pages, onPageChange }) => {
  return (
    <ContentStyle>
      <Table
        onPageChange={onPageChange}
        tableHeadRow={tHead}
        tableBody={tBody}
        pages={pages}
      />
    </ContentStyle>
  );
};

export const Modal = ({ trigger, src, content, action }) => {
  return (
    <ModalContent trigger={<Button>Scrolling Content Modal</Button>}>
      <ModalContent.Header>Profile Picture</ModalContent.Header>
      <ModalContent.Content image scrolling>
        <Image size="medium" src="https://i.imgur.com/h3clXMR.jpg" wrapped />

        <ModalContent.Description>
          <Header>Modal Header</Header>
          <p>
            This is an example of expanded content that will cause the modal's
            dimmer to scroll
          </p>
          {_.times(8, i => (
            <Image
              key={i}
              src="https://i.imgur.com/h3clXMR.jpg"
              style={{ paddingBottom: 5 }}
            />
          ))}
        </ModalContent.Description>
      </ModalContent.Content>
      <ModalContent.Actions>
        <Button primary>
          Proceed <Icon name="right chevron" />
        </Button>
      </ModalContent.Actions>
    </ModalContent>
  );
};
