import styled from "styled-components";
export const Container = styled.div`
  text-align: center;
`;
export const windowHeight = window.innerHeight;
export const Side = styled.div`
  position: fixed;
  float: left;
  min-height: ${windowHeight}px;
  width: 25%;
  background-color: #333f50;
  color: white;
  box-shadow: 3px 0px 8px 3px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const Search = styled.div`
  padding: 20px 0 20px 0;
`;
export const HomeContainer = styled.div`
  float: right;
  width: 75%;
`;
export const HomeContent = styled.div`
  padding: 0 0 20px 0;
`;
export const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`;