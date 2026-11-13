/**
 * Funções utilitárias para manipulação de árvores sintáticas
 */

/**
 * Remove nós marcados como "IGNORE" da árvore
 * @param {Object} node - Nó da árvore a ser processado
 * @returns {Object|null} - Nó processado ou null se deve ser removido
 */
export const removeIgnoreNodes = (node) => {
  if (!node) {
    return null;
  }

  if (node.name === 'IGNORE') {
    return null;
  }

  if (!node.children || node.children.length === 0) {
    return node;
  }

  node.children = node.children
    .map((child) => removeIgnoreNodes(child))
    .filter((child) => child !== null);

  if (node.children.length === 0) {
    delete node.children;
  }

  return node;
};

/**
 * Comprime nós que possuem apenas um filho
 * @param {Object} node - Nó da árvore a ser processado
 * @returns {Object|null} - Nó processado ou null
 */
export const compressSingleChildNodes = (node) => {
  if (!node) {
    return null;
  }

  if (!node.children || node.children.length === 0) {
    return node;
  }

  node.children = node.children
    .map((child) => compressSingleChildNodes(child))
    .filter((child) => child !== null);

  if (node.children.length === 0) {
    delete node.children;
    return node;
  }

  if (node.children.length === 1) {
    return node.children[0];
  }

  return node;
};

/**
 * Converte a estrutura de árvore para o formato do Ant Design Tree
 * @param {Object} data - Dados da árvore
 * @returns {Array} - Array de nós no formato Ant Design
 */
export const convertToAntdTree = (data) => {
  const convertNode = (node, key) => {
    const isLeaf = !node.children || node.children.length === 0;
    const treeNode = {
      title: isLeaf ? <code>{node.name}</code> : node.name,
      key: key,
    };

    if (node.children && node.children.length > 0) {
      treeNode.children = node.children.map((child, index) =>
        convertNode(child, `${key}-${index}`)
      );
    }

    return treeNode;
  };

  return [convertNode(data, '0')];
};

const escapeDotLabel = (value) => String(value)
  .replace(/\\/g, '\\\\')
  .replace(/"/g, '\\"')
  .replace(/\n/g, '\\n');

/** Converte a árvore do parser para o formato DOT usado pelo Viz. */
export const syntaxTreeToDot = (root) => {
  if (!root) return "digraph SyntaxTree {}";

  const lines = [
    "digraph SyntaxTree {",
    '  graph [rankdir="TB", bgcolor="transparent", nodesep="0.28", ranksep="0.55", pad="0.25", splines="polyline"];',
    '  node [shape="box", style="rounded,filled", fontname="Arial", fontsize="11", margin="0.12,0.08", color="#b8c4d6", fontcolor="#263449"];',
    '  edge [color="#8795aa", penwidth="1.2", arrowsize="0.65"];',
  ];

  let nextId = 0;
  const visit = (node, parentId = null, isRoot = false) => {
    const id = `node${nextId++}`;
    const children = Array.isArray(node.children) ? node.children : [];
    const fill = isRoot ? "#2c3aff" : children.length ? "#e8edff" : "#f4f7fb";
    const font = isRoot ? "white" : "#263449";
    const border = isRoot ? "#2c3aff" : children.length ? "#647bff" : "#b8c4d6";
    lines.push(`  ${id} [label="${escapeDotLabel(node.name)}", fillcolor="${fill}", fontcolor="${font}", color="${border}"];`);
    if (parentId) lines.push(`  ${parentId} -> ${id};`);
    children.forEach((child) => visit(child, id));
  };

  visit(root, null, true);
  lines.push("}");
  return lines.join("\n");
};
