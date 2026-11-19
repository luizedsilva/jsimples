import { useMemo } from "react";
import { Empty, Table } from "antd";
import styled from "styled-components";
import simples from "@/core/compiler/simples.js";
import { useAppData } from "@/contexts/AppContext";

const TableContainer = styled.div`
  height: 100%;
  min-height: 0;
  overflow: auto;
`;

const reservedWords = new Set([
  "T_PROGRAM", "T_START", "T_END", "T_READ", "T_PRINT", "T_IF", "T_THEN",
  "T_ELSE", "T_ENDIF", "T_WHILE", "T_DO", "T_ENDWHILE", "T_INTEGER",
  "T_LOGIC", "T_T", "T_F", "T_PROC", "T_ENDPROC", "T_REF", "T_FUNC",
  "T_ENDFUNC",
]);

const operators = new Set([
  "T_PLUS", "T_MINUS", "T_TIMES", "T_DIV", "T_ATRIB", "T_GREATER",
  "T_LESS", "T_EQUAL", "T_AND", "T_OR", "T_NOT",
]);

const tokenNames = {
  T_PROGRAM: "Programa",
  T_START: "Início",
  T_END: "Fim do programa",
  T_READ: "Leitura",
  T_PRINT: "Escrita",
  T_IF: "Se",
  T_THEN: "Então",
  T_ELSE: "Senão",
  T_ENDIF: "Fim se",
  T_WHILE: "Enquanto",
  T_DO: "Faça",
  T_ENDWHILE: "Fim enquanto",
  T_PLUS: "Adição",
  T_MINUS: "Subtração",
  T_TIMES: "Multiplicação",
  T_DIV: "Divisão",
  T_ATRIB: "Atribuição",
  T_GREATER: "Maior que",
  T_LESS: "Menor que",
  T_EQUAL: "Igualdade",
  T_AND: "Conjunção lógica",
  T_OR: "Disjunção lógica",
  T_NOT: "Negação lógica",
  T_OPEN: "Abre parêntese",
  T_CLOSE: "Fecha parêntese",
  T_INTEGER: "Tipo inteiro",
  T_LOGIC: "Tipo lógico",
  T_T: "Valor lógico verdadeiro",
  T_F: "Valor lógico falso",
  T_PROC: "Procedimento",
  T_ENDPROC: "Fim do procedimento",
  T_REF: "Passagem por referência",
  T_FUNC: "Função",
  T_ENDFUNC: "Fim da função",
  T_ROUTINE_START: "Identificador de rotina",
  T_IDENTIFIER: "Identificador",
  T_NUMBER: "Número inteiro",
};

const getCategory = (token) => {
  if (token === "T_IDENTIFIER" || token === "T_ROUTINE_START") return "Identificador";
  if (token === "T_NUMBER") return "Constante numérica";
  if (token === "T_T" || token === "T_F") return "Constante lógica";
  if (operators.has(token)) return "Operador";
  if (token === "T_OPEN" || token === "T_CLOSE") return "Delimitador";
  if (reservedWords.has(token)) return "Palavra reservada";
  return "Símbolo léxico";
};

const tokenize = (source) => {
  if (!source) return [];

  const lexer = Object.create(simples.lexer);
  lexer.setInput(source);
  const rows = [];

  for (;;) {
    try {
      const rawToken = lexer.lex();
      if (rawToken === lexer.EOF || rawToken === 83 || rawToken === 1) break;

      const token = typeof rawToken === "number"
        ? simples.terminals_[rawToken] || String(rawToken)
        : rawToken;
      rows.push({
        key: rows.length,
        token,
        symbol: tokenNames[token] || token,
        category: getCategory(token),
        lexeme: lexer.yytext,
        line: lexer.yylloc?.first_line ?? "-",
        column: (lexer.yylloc?.first_column ?? -1) + 1,
      });
    } catch {
      const lexeme = lexer._input?.[0] || lexer.yytext || lexer.match || "caractere inválido";
      rows.push({
        key: rows.length,
        token: "ERRO",
        symbol: "Símbolo não reconhecido",
        category: "Erro léxico",
        lexeme,
        line: lexer.yylloc?.first_line ?? "-",
        column: (lexer.yylloc?.first_column ?? -1) + 1,
      });
      break;
    }
  }

  return rows;
};

const columns = [
  { title: "#", dataIndex: "key", width: 56, render: (index) => index + 1 },
  { title: "Lexema", dataIndex: "lexeme", render: (lexeme) => <code>{lexeme}</code> },
  { title: "Token", dataIndex: "token" },
  { title: "Classificação", dataIndex: "category" },
  { title: "Símbolo", dataIndex: "symbol" },
  { title: "Linha", dataIndex: "line", width: 72 },
  { title: "Coluna", dataIndex: "column", width: 72 },
];

export const LexicalSymbols = () => {
  const { code } = useAppData();
  const rows = useMemo(() => tokenize(code), [code]);

  return (
    <TableContainer>
      <Table
        size="small"
        columns={columns}
        dataSource={rows}
        pagination={false}
        locale={{ emptyText: <Empty description="Nenhum símbolo léxico encontrado" /> }}
        scroll={{ x: "max-content", y: 410 }}
      />
    </TableContainer>
  );
};
