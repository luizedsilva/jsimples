import { useRef, useState } from "react";
import { Terminal } from "./tools/Terminal";
import { useAppData } from "@/contexts/AppContext";
import { ViewsTab } from "@/components/ViewsTab";
import { SyntaxTree } from "./tools/SyntaxTree";
import { CodeEditor } from "./tools/CodeEditor";
import styled from "styled-components";
import { MVSViewer } from "./tools/MVSViewer";
import { MachineStateViewer } from "./tools/MachineStateViewer";
import { SymbolTable } from "./SymbolTable";
import { LexicalSymbols } from "./tools/LexicalSymbols";

const WorkspaceRoot = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const SplitLayout = styled.div`
  display: grid;
  flex: 0 0 680px;
  height: 680px;
  min-height: 0;
  grid-template-columns: minmax(0, ${({ $split }) => $split}fr) 12px minmax(0, ${({ $split }) => 100 - $split}fr);

  @media (max-width: 768px) {
    flex: none;
    height: 1120px;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) 12px minmax(0, 1fr);
  }
`;

const StyledCard = styled.div`
  padding: 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: #fff;
  height: 100%;
  min-height: 0;
  min-width: 0;
  width: 100%;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const SplitHandle = styled.div`
  position: relative;
  z-index: 2;
  cursor: col-resize;
  touch-action: none;
  outline: none;

  &::after {
    content: "";
    position: absolute;
    width: 4px;
    top: 24px;
    bottom: 24px;
    left: 4px;
    border-radius: 4px;
    background: #c6cbd3;
    transition: background 0.15s ease, width 0.15s ease;
  }

  &:hover::after,
  &:focus-visible::after {
    width: 6px;
    left: 3px;
    background: #1677ff;
  }

  @media (max-width: 768px) {
    cursor: row-resize;

    &::after {
      width: auto;
      height: 4px;
      top: 4px;
      bottom: auto;
      left: 24px;
      right: 24px;
    }

    &:hover::after,
    &:focus-visible::after {
      width: auto;
      height: 6px;
      left: 24px;
      top: 3px;
    }
  }
`;

export const Workspace = () => {
  const { tab } = useAppData();
  const [split, setSplit] = useState(50);
  const layoutRef = useRef(null);

  const resizeSplit = (event) => {
    const bounds = layoutRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const vertical = window.matchMedia("(max-width: 768px)").matches;
    const extent = vertical ? bounds.height : bounds.width;
    const origin = vertical ? bounds.top : bounds.left;
    const position = vertical ? event.clientY : event.clientX;
    const usableExtent = extent - 12;
    if (!Number.isFinite(usableExtent) || usableExtent <= 0) return;

    const handleOffset = vertical ? event.currentTarget.getBoundingClientRect().height / 2 : event.currentTarget.getBoundingClientRect().width / 2;
    const nextSplit = ((position - origin - handleOffset) / usableExtent) * 100;
    if (!Number.isFinite(nextSplit)) return;
    setSplit(Math.max(25, Math.min(75, nextSplit)));
  };

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeSplit(event);
  };

  const handleKeyDown = (event) => {
    const vertical = window.matchMedia("(max-width: 768px)").matches;
    const decrease = vertical ? event.key === "ArrowUp" : event.key === "ArrowLeft";
    const increase = vertical ? event.key === "ArrowDown" : event.key === "ArrowRight";
    if (!decrease && !increase) return;
    event.preventDefault();
    setSplit((value) => Math.max(25, Math.min(75, value + (increase ? 2 : -2))));
  };

  return (
    <WorkspaceRoot>
      <SplitLayout ref={layoutRef} $split={split}>
        <StyledCard>
          {(tab === "terminal" || tab === "lexicalSymbols" || tab === "syntaxTree" || tab === "derivationTree" || tab === "symbols") && <CodeEditor />}
          {tab === "mvs" && <MVSViewer />}
        </StyledCard>

        <SplitHandle
          role="separator"
          aria-label="Redimensionar painel do programa fonte"
          aria-orientation={window.matchMedia("(max-width: 768px)").matches ? "horizontal" : "vertical"}
          aria-valuemin={25}
          aria-valuemax={75}
          aria-valuenow={Math.round(split)}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) resizeSplit(event);
          }}
          onKeyDown={handleKeyDown}
        />

        <StyledCard>
          <ViewsTab />
          <ContentWrapper>
            {(tab === "syntaxTree" || tab === "derivationTree") && <SyntaxTree />}
            {tab === "lexicalSymbols" && <LexicalSymbols />}
            {tab === "terminal" && <Terminal />}
            {tab === "mvs" && <MachineStateViewer />}
            {tab === "symbols" && <SymbolTable />}
          </ContentWrapper>
        </StyledCard>
      </SplitLayout>
    </WorkspaceRoot>
  );
};
