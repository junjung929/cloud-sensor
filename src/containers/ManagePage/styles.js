import styled from "styled-components";

export const Content = styled.div`
  margin: 0 5% 0 5%;
`;
export const ImgPreview = styled.div`
  text-align: center;
  margin: 5px 15px;
  height: 200px;
  max-width: 85vw;
  max-height: 90vh;
  width: 500px;
  background-color: black;
  border-left: 1px solid gray;
  border-right: 1px solid gray;
  border-top: 5px solid gray;
  border-bottom: 5px solid gray;
  color: white;
`;
export const PreviewImg = styled.img`
  width: auto;
  height: 100%;
`;

export const Info = styled.div`
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
padding: 5vw;
`;