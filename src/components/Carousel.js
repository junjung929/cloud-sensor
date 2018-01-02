import React from'react';
import styled from 'styled-components'

const CarouselDiv = styled.div`font-size: large;`
const Img = styled.img`width: 100%;`
const ImgText = styled.p`
    position: absolute; 
    top: 0px;
    color: white;
    font-weight: bold;
    font-size: 2em;
    padding: 20px;
    text-align: left`

function Carousel(){
    const carouselImgSrc = "http://www.espoo.fi/download/noname/%7B8669A8BE-5F54-4E4A-944A-7F9FBB37D740%7D/84053";
    return (
        <CarouselDiv>
            <Img src={carouselImgSrc} alt="abd" />
            <ImgText>Welcom to<br/>Monitoring page</ImgText>
        </CarouselDiv>
    )
}
export default Carousel;
