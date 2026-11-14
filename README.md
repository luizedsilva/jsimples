# JSimples

O JSimples é uma ferramenta web didática para o ensino de teoria de linguagens e compiladores. Permite escrever programas na linguagem Simples, compilá-los e acompanhar sua execução passo a passo na máquina virtual MVS.

**Aplicação:** [luizedsilva.github.io/jsimples](https://luizedsilva.github.io/jsimples/)

## O que oferece

- Editor de código com realce da sintaxe e da instrução em execução.
- Compilação da linguagem Simples, visualização da árvore sintática e tabela de símbolos.
- Simulador MVS com execução passo a passo, estado da máquina, memória e pilha.
- Terminal interativo para entrada e saída do programa.
- Painéis redimensionáveis e interface adaptável a telas menores.

## Tecnologias e documentação

- [React](https://react.dev/learn) e [React DOM](https://react.dev/reference/react-dom): interface da aplicação.
- [Vite](https://vite.dev/guide/): desenvolvimento e build de produção.
- [CodeMirror 6](https://codemirror.net/docs/) e [@uiw/react-codemirror](https://uiwjs.github.io/react-codemirror/): editor.
- [Ant Design](https://ant.design/components/overview/): componentes de interface.
- [styled-components](https://styled-components.com/docs): estilos dos componentes.
- [Viz.js](https://viz-js.com/api/): visualização da árvore sintática.
- [React Icons](https://react-icons.github.io/react-icons/): ícones.
- [ESLint](https://eslint.org/docs/latest/): análise estática do código.

## Organização do repositório

| Caminho | Conteúdo |
| --- | --- |
| `app/` | Aplicação web React e sua configuração Vite. Consulte [`app/README.md`](app/README.md) para detalhes. |
| `app/src/components/` | Componentes reutilizáveis da interface. |
| `app/src/contexts/` | Estado compartilhado da aplicação. |
| `app/src/core/compiler/` | Compilador da linguagem Simples. |
| `app/src/core/mvs/` | Máquina virtual MVS. |
| `app/src/view/` | Telas, editor, terminal e visualizações. |
| `compiler/` | Fontes, script de build e casos de teste do compilador em Jison. |
| `jsimples_scorm/` | Distribuição SCORM existente. |
| `.github/workflows/pages.yml` | Build e publicação da aplicação no GitHub Pages. |

O artigo sobre a ferramenta está em [`app/src/assets/`](app/src/assets/), em PDF.

## Executar localmente

Requer Node.js 18 ou superior e npm. A partir da raiz do repositório:

```bash
cd app
npm install
npm run dev
```

Abra o endereço local informado pelo Vite, geralmente <http://localhost:5173/>.

## Construir e conferir a distribuição

Dentro de `app/`, execute:

```bash
npm run lint
npm run build
npm run preview
```

O build estático é criado em `app/dist/`. O `preview` serve essa versão localmente para conferência. A configuração Vite usa o caminho-base `/jsimples/`, correspondente à publicação atual.

## Publicação

Um push para `main` que altere `app/**` ou `.github/workflows/pages.yml` inicia o workflow do GitHub Actions. Ele instala as dependências, constrói a aplicação e publica `app/dist/` no GitHub Pages. O workflow também pode ser iniciado manualmente pela aba **Actions**.

O README exibido na página inicial do GitHub é este arquivo na raiz (`README.md`). `app/README.md` documenta a aplicação dentro da pasta `app/`. Alterações em qualquer README aparecem no GitHub após o commit e o push; elas não alteram o site publicado, pois o Pages recebe somente `app/dist/`.

A distribuição em `jsimples_scorm/` é separada e não é gerada pelo workflow do GitHub Pages.
