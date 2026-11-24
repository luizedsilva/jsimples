import { Button, Col, Row, Table, message } from "antd";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { Stack } from "@/components/Stack";
import "@/styles/Table.css";
import { useEffect, useRef, useState } from "react";
import { IoWarning } from "react-icons/io5";
import { AiFillCaretRight } from "react-icons/ai";
import { VscDebugRestart } from "react-icons/vsc";
import { MdContentCopy } from "react-icons/md";
import { Pointer } from "@/components/Pointer";

const Container = styled.div`
  min-height: 70px;
  padding: 0 10px;

  @media (max-width: 768px) {
    padding: 0 5px;
  }
`;

const SectionCard = styled.div`
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PointersCard = styled(SectionCard)`
  padding: 8px 0px;
  height: max-content;
  width: 100%;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const PointersTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  margin-right: 25px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
    font-size: 14px;
  }
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #262626;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SecondarySection = styled.div`
  background: #fff;
  margin-top: 16px;
  border-radius: 8px;
  display: flex;
  height: auto;
  min-height: 0;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  @media (max-width: 768px) {
    margin-top: 10px;
    padding: 5px;
  }
`;

const ControlBar = styled.div`
  margin: 34px 0px 12px;
  display: flex;
  gap: 15px;
  flex-direction: column;
  width: 100%;

  @media (max-width: 768px) {
    margin: 22px 0 10px;
    gap: 10px;
  }
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 100%;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 1200px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;

const StackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 120px;

  @media (max-width: 768px) {
    min-width: 100px;
  }
`;

const Warning = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 5px;
  }
`;

const WarningWrapper = styled.div`
  padding: 15px;
  background-color: oklch(95.4% 0.038 75.164);
  color: oklch(55.3% 0.195 38.402);
  border-radius: 10px;
  border: 1px solid oklch(55.3% 0.195 38.402);

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const PointersContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const ResponsiveTable = styled(Table)`
  .mvs-next-row > td {
    background: #ffe2e2 !important;
  }

  .mvs-executed-row > td {
    background: #e1efff !important;
  }

  .ant-table-thead > tr > th {
    @media (max-width: 768px) {
      font-size: 12px;
      padding: 8px 4px;
    }
  }

  .ant-table-tbody > tr > td {
    @media (max-width: 768px) {
      font-size: 12px;
      padding: 6px 4px;
    }
  }

  @media (max-width: 768px) {
    .ant-table-container {
      font-size: 12px;
    }
  }
`;

const InstructionTableViewport = styled.div`
  min-width: 0;
  width: min(100%, 560px);

  .ant-table-body {
    scrollbar-gutter: stable;
  }
`;

const ResponsiveRow = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

/**
 * Configuração das colunas da tabela de instruções
 */
const getInstructionColumns = () => [
  {
    title: "#",
    dataIndex: "address",
    width: 10,
    render: (_, __, index) => index,
  },
  {
    title: "Rótulo",
    dataIndex: "label",
    width: 40,
  },
  {
    title: "Instrução",
    dataIndex: "instruction",
    width: 50,
  },
  {
    title: "Operando",
    dataIndex: "parameter",
    width: 60,
  },
];

/**
 * Converte o código MVS em texto (rótulo, instrução e operando separados por tabulação)
 */
const formatMvsCode = (mvs = []) =>
  mvs
    .map(({ label, instruction, parameter }) =>
      `${label ?? ""}\t${instruction}\t${parameter ?? ""}`.trimEnd()
    )
    .join("\n");

/**
 * Copia um texto para a área de transferência (com alternativa para contextos não seguros)
 */
const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("Falha ao copiar");
};

/**
 * Componente para visualização do estado da máquina MVS
 */
export const MachineStateViewer = () => {
  const instructionTableRef = useRef(null);
  const [executionMarkers, setExecutionMarkers] = useState({ last: -1, current: 0 });
  const { mvsState, parserResponse, vmRef, resetVm, setMvsState } = useAppData();

  // Atualiza os ponteiros de execução
  useEffect(() => {
    setExecutionMarkers((markers) => {
      const current = mvsState.instructionPointer;
      if (markers.current === current) return markers;
      return { last: markers.current, current };
    });
  }, [mvsState.instructionPointer]);

  // Mantém a próxima instrução visível quando a execução avança.
  useEffect(() => {
    const body = instructionTableRef.current?.querySelector(".ant-table-body");
    const row = body?.querySelector(`tr[data-row-key="${mvsState.instructionPointer}"]`);
    if (!body || !row) return;

    const rowTop = row.offsetTop - body.offsetTop;
    const rowBottom = rowTop + row.offsetHeight;
    const visibleTop = body.scrollTop;
    const visibleBottom = visibleTop + body.clientHeight;
    if (rowTop < visibleTop || rowBottom > visibleBottom) {
      body.scrollTo({
        top: Math.max(0, rowTop - (body.clientHeight - row.offsetHeight) / 2),
        behavior: "smooth",
      });
    }
  }, [mvsState.instructionPointer, parserResponse.mvs]);

  const columnsInstructions = getInstructionColumns();
  const hasMvsCode = parserResponse?.mvs?.length > 0;

  /**
   * Executa a próxima instrução
   */
  const handleExecuteNext = () => {
    setMvsState(vmRef.current?.next());
  };

  /**
   * Copia o código MVS gerado para a área de transferência
   */
  const handleCopyCode = async () => {
    try {
      await copyToClipboard(formatMvsCode(parserResponse.mvs));
      message.success("Código MVS copiado para a área de transferência.");
    } catch {
      message.error("Não foi possível copiar o código MVS.");
    }
  };

  return (
    <Container>
      <ResponsiveRow>
        <PointersCard>
          <PointersTitle>Registradores:</PointersTitle>
          <PointersContainer>
            <Pointer value={mvsState?.instructionPointer} label={"I"} />
            <Pointer
              value={mvsState?.stack.length + (mvsState?.memory?.length || 0)}
              label={"S"}
            />
            <Pointer value={mvsState?.dPointer || -1} label={"D"} />
          </PointersContainer>
        </PointersCard>
      </ResponsiveRow>

      <ResponsiveRow>
        <SecondarySection>
          {hasMvsCode && (
            <TableWrapper>
              <InstructionTableViewport ref={instructionTableRef}>
                <ResponsiveTable
                  columns={columnsInstructions}
                  dataSource={parserResponse.mvs}
                  pagination={false}
                  size="small"
                  rowKey={(_, index) => index}
                  rowClassName={(_, index) => {
                    if (index === executionMarkers.current) return "mvs-next-row";
                    if (index === executionMarkers.last) return "mvs-executed-row";
                    return "";
                  }}
                  scroll={{ y: 410, x: "max-content" }}
                />
              </InstructionTableViewport>

              <StackWrapper>
                <SectionTitle>Pilha M</SectionTitle>
                <Stack variables={mvsState?.memory || []} data={mvsState?.stack} compact />
              </StackWrapper>
            </TableWrapper>
          )}

          <ControlBar>
            {!hasMvsCode && (
              <WarningWrapper>
                <Warning>
                  <IoWarning size={30} />
                  <strong>Atenção: </strong>Não existe nenhum código MVS para ser executado. É
                  necessário compilar o algoritmo primeiro.
                </Warning>
              </WarningWrapper>
            )}
            <ResponsiveRow gutter={[16, 16]} align={"center"} justify="center">
              <ResponsiveCol>
                <Button onClick={resetVm} disabled={!hasMvsCode}>
                  <VscDebugRestart />
                  Reiniciar
                </Button>
              </ResponsiveCol>
              <ResponsiveCol>
                <Button onClick={handleExecuteNext} disabled={!hasMvsCode}>
                  Executar Instrução
                  <AiFillCaretRight />
                </Button>
              </ResponsiveCol>
              <ResponsiveCol>
                <Button
                  onClick={handleCopyCode}
                  disabled={!hasMvsCode}
                  title="Copiar o código MVS gerado pelo compilador"
                >
                  <MdContentCopy />
                  Copiar código MVS
                </Button>
              </ResponsiveCol>
            </ResponsiveRow>
          </ControlBar>
        </SecondarySection>
      </ResponsiveRow>
    </Container>
  );
};
