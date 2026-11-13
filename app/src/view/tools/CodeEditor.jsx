import { Row, Col, Button } from "antd";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { JSButton } from "@/components/atomic/JSButton";
import { CodeInput } from "@/components/CodeInput";
import { useAppData } from "../../contexts/AppContext";
import styled from "styled-components";
import { FaGear } from "react-icons/fa6";
import { useRef } from "react";

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0;
  width: 100%;
`;

const ButtonRow = styled(Row)`
  flex-shrink: 0;
`;

const EditorToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
  color: #595959;
  font-size: 13px;
`;

const CodeInputWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

export const CodeEditor = ({stepByStep = false}) => {
  const {
    compile,
    runAlgorithm,
    isRunning,
    stopAlgorithm,
    parserResponse,
    editorFontSize,
    setEditorFontSize,
  } = useAppData();
  const codeCanvaRef = useRef(null);

  return (
    <InputSection>
      <EditorToolbar aria-label="Ajuste do tamanho da fonte">
        <span>Fonte</span>
        <Button
          size="small"
          aria-label="Diminuir fonte"
          title="Diminuir fonte"
          disabled={editorFontSize <= 10}
          onClick={() => setEditorFontSize((size) => Math.max(10, size - 1))}
        >
          A−
        </Button>
        <span aria-live="polite">{editorFontSize}px</span>
        <Button
          size="small"
          aria-label="Aumentar fonte"
          title="Aumentar fonte"
          disabled={editorFontSize >= 28}
          onClick={() => setEditorFontSize((size) => Math.min(28, size + 1))}
        >
          A+
        </Button>
        <Button size="small" onClick={() => setEditorFontSize(14)}>
          Padrão
        </Button>
      </EditorToolbar>
      <CodeInputWrapper ref={codeCanvaRef}>
        <CodeInput codeWrapperRef={codeCanvaRef} stepByStep={stepByStep}/>
      </CodeInputWrapper>
      <ButtonRow gutter={24}>
        <Col span={12}>
          <JSButton
            onClick={compile}
            icon={<FaGear />}
            type="primary"
          >
            Compilar
          </JSButton>
        </Col>
        <Col span={12}>
          <JSButton
            onClick={isRunning ? stopAlgorithm : runAlgorithm}
            icon={isRunning ? <StopOutlined /> : <PlayCircleOutlined />}
            danger={isRunning ? true : false}
            disabled={!parserResponse.finished}
          >
            {isRunning ? "Parar execução" : "Executar código"}
          </JSButton>
        </Col>
      </ButtonRow>
    </InputSection>
  );
};
