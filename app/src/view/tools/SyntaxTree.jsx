import { useEffect, useRef, useState } from "react";
import { instance } from "@viz-js/viz";
import { Button, Switch, Tree as DirectoryTree } from "antd";
import { useAppData } from "@/contexts/AppContext";
import styled from "styled-components";
import { ViewContainer } from "@/components/atomic/ViewContainer";
import { IoWarning } from "react-icons/io5";
import { FaGear } from "react-icons/fa6";
import { convertToAntdTree, syntaxTreeToDot } from "@/utils/syntaxTreeUtils.jsx";

const TreeContainer = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  position: relative;
  overflow: auto;
  background: #fff;
  box-shadow: inset 0 -10px 10px -10px rgba(0, 0, 0, 0.1),
    inset 0 10px 10px -10px rgba(0, 0, 0, 0.1);
  display: ${({ $hidden }) => ($hidden ? "none" : "block")};

  svg {
    display: block;
    width: ${({ $zoom }) => `${$zoom * 100}%`};
    height: ${({ $zoom }) => `${$zoom * 100}%`};
  }
`;

const TreeViewSettings = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  color: #595959;
  margin-bottom: 16px;
  justify-content: center;
  flex: 0 0 auto;
`;

const ViewLabel = styled.span`
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  color: ${(props) => (props.$active ? "#1890ff" : "#595959")};
`;

const DirectoryView = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  border: 1px solid #d9d9d9;
  padding: 10px;
  border-radius: 8px;
`;

const NothingCompiledWarning = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`;

const WarningText = styled.div`
  max-width: 300px;
  text-align: center;
`;

const CompileInstructionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

let vizPromise;
const getViz = () => {
  vizPromise ??= instance();
  return vizPromise;
};

export const SyntaxTree = () => {
  const { completeSyntaxTree, simplifiedSyntaxTree, tab } = useAppData();
  const [treeVisualization, setTreeVisualization] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [renderError, setRenderError] = useState("");
  const treeRef = useRef(null);

  const nothingCompiled = Object.keys(completeSyntaxTree).length === 0;
  const currentTree = tab === "syntaxTree" ? simplifiedSyntaxTree : completeSyntaxTree;

  useEffect(() => {
    if (!treeVisualization || nothingCompiled || !treeRef.current) return undefined;

    let cancelled = false;
    setRenderError("");
    treeRef.current.replaceChildren();

    getViz()
      .then((viz) => viz.renderSVGElement(syntaxTreeToDot(currentTree)))
      .then((svg) => {
        if (cancelled || !treeRef.current) return;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("preserveAspectRatio", "xMidYMin meet");
        treeRef.current.replaceChildren(svg);
      })
      .catch((error) => {
        if (!cancelled) setRenderError(`Não foi possível gerar a árvore: ${error.message}`);
      });

    return () => {
      cancelled = true;
    };
  }, [currentTree, nothingCompiled, treeVisualization]);

  return (
    <ViewContainer id="viewContainer">
      <TreeViewSettings>
        <ViewLabel $active={treeVisualization}>Visualização em árvore</ViewLabel>
        <Switch
          disabled={nothingCompiled}
          onChange={() => setTreeVisualization((visible) => !visible)}
          checked={!treeVisualization}
          aria-label="Alternar visualização em diretório"
        />
        <ViewLabel $active={!treeVisualization}>Visualização em diretório</ViewLabel>
        {treeVisualization && (
          <>
            <Button size="small" disabled={zoom <= 0.2} onClick={() => setZoom((value) => Math.max(0.2, value / 1.2))}>
              −
            </Button>
            <Button size="small" onClick={() => setZoom(1)}>Ajustar</Button>
            <Button size="small" disabled={zoom >= 5} onClick={() => setZoom((value) => Math.min(5, value * 1.2))}>
              +
            </Button>
          </>
        )}
      </TreeViewSettings>

      {!treeVisualization && (
        <DirectoryView>
          <DirectoryTree treeData={convertToAntdTree(currentTree)} showLine />
        </DirectoryView>
      )}

      {treeVisualization && (
        <TreeContainer ref={treeRef} $hidden={nothingCompiled} $zoom={zoom}>
          {renderError && <p role="alert">{renderError}</p>}
        </TreeContainer>
      )}

      {nothingCompiled && (
        <NothingCompiledWarning>
          <IoWarning size={32} />
          <WarningText>
            Não existe nada compilado no momento! <br />
            <CompileInstructionContainer>
              Clique em <FaGear style={{ marginLeft: "7px", marginRight: "2px" }} /> Compilar
            </CompileInstructionContainer>
          </WarningText>
        </NothingCompiledWarning>
      )}
    </ViewContainer>
  );
};
