import styled from "styled-components";
import { CodeEditor } from "./CodeEditor";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

export const MVSViewer = () => {
  
  return (
    <Container>
      <CodeEditor stepByStep/>
    </Container>
  );
};
