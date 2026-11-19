import styled from "styled-components";
import { COLORS } from "@/constants/theme";

const StackFrame = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 150px;
  min-width: 100px;
  min-height: ${({ $compact }) => ($compact ? "410px" : "280px")};
  max-height: ${({ $compact }) => ($compact ? "410px" : "280px")};
  @media (max-width: 768px) {
    max-width: 120px;
    min-width: 80px;
    min-height: ${({ $compact }) => ($compact ? "310px" : "220px")};
    max-height: ${({ $compact }) => ($compact ? "310px" : "220px")};
  }
  @media (max-width: 480px) {
    max-width: 100px;
    min-width: 70px;
    min-height: ${({ $compact }) => ($compact ? "260px" : "180px")};
    max-height: ${({ $compact }) => ($compact ? "260px" : "180px")};
  }
`;

const StackScroll = styled.div`
  display: block;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const StackContents = styled.div`
  display: flex;
  flex-direction: column-reverse;
  min-height: 100%;
  box-sizing: border-box;
  padding-left: 24px;
  border-left: 2px solid #333;
  border-right: 2px solid #333;
  border-bottom: 2px solid #333;
`;

const StackItem = styled.div`
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  margin: 0 2px;
  padding: 2px 4px;
  text-align: center;
  background-color: ${COLORS.stack.item};
  color: white;
  border-radius: 4px;
  font-weight: bold;
  position: relative;
  font-size: 14px;
  word-break: break-word;

  @media (max-width: 768px) {
    padding: 2px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 1px 2px;
    font-size: 10px;
  }
`;

const StackRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex: 0 0 auto;
  position: relative;
  padding: 1px 0;

  margin-bottom: 1px;

  @media (max-width: 768px) {
    min-height: 0;
  }

  @media (max-width: 480px) {
    min-height: 0;
  }
`;

const StackIndex = styled.span`
  position: absolute;
  right: 100%;
  width: 24px;
  padding-right: 4px;
  color: #555;
  font-size: 11px;
  text-align: right;
`;

/**
 * Formata o valor para exibição na pilha
 */
const formatStackValue = (value) => {
  if (typeof value === "number") {
    return value;
  }
  return value ? "V" : "F";
};

/**
 * Componente de visualização da pilha
 */
export const Stack = ({ data, compact = false }) => {
  return (
    <StackFrame $compact={compact}>
      <StackScroll>
        <StackContents>
          {data.map((value, index) => (
            <StackRow key={index}>
              <StackIndex>{index}</StackIndex>
              <StackItem>{formatStackValue(value)}</StackItem>
            </StackRow>
          ))}
        </StackContents>
      </StackScroll>
    </StackFrame>
  );
};
