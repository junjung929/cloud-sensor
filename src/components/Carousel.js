import React from "react";
import styled from "styled-components";
import { Header } from "semantic-ui-react";

const CarouselDiv = styled.div`
  font-size: large;
`;
const Img = styled.img`
  width: 100%;
`;

function Carousel() {
  const carouselImgSrc =
    "http://www.espoo.fi/download/noname/%7B8669A8BE-5F54-4E4A-944A-7F9FBB37D740%7D/84053";
    const styleDiv ={position: "absolute",
        top: "30px",
        color: "white",
        fontWeight: "bold",
        padding: "20px",
        textAlign: "left"}
  return (
    <CarouselDiv>
      <Img src={carouselImgSrc} alt="abd" />
      <Header
      size="huge"
      style={styleDiv}
      >
        Welcom to<br />Monitoring page
      </Header>
    </CarouselDiv>
  );
}
export default Carousel;
