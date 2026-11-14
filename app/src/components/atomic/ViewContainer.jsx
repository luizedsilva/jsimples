import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${props => props.backgroundColor || 'transparent'}
`;

export const ViewContainer = ({ children, backgroundColor}) => {
  return <Container $backgroundColor={backgroundColor}>{children}</Container>;
};
