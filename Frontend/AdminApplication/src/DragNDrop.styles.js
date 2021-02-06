import styled from "@emotion/styled";

export const DragContainer = styled.div`
  width: 80%;
  height: 30vh;
  color: red;
  padding: 30;
  border: ${(p) => (p.highlighted ? "4px solid green" : "2px dotted gray")};

  margin: auto;
  margintop: 50%;
`;
export const DragDrop = styled.div`
  text-align: center;
  margintop: 50%;
`;
