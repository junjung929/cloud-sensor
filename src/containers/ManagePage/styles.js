import styled from "styled-components";

export const A = styled.a`
  float: right;
  color: white;
  padding: 0px 10px 0px 0;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;
export const Content = styled.div`
  width: 100%;
  flex: 7;
`;
export const H3 = styled.h3`
  width: 100%;
  color: white;
  padding: 10px 0 10px 0;
  margin: 0;
  font-size: 2em;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;
export const SideSearch = styled.div`
  width: 100%;
  padding: 10px 0 10px 0;
  font-size: 1em;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;
export const SideInner = styled.div`
  height: 100%;
  width: 100%;
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
export const LinkStyle = styled.li`
  &:hover {
    background-color: #00a4a4;
    margin: 0 -14px 0 -14px;
  }
  &:hover span {
  }
`;