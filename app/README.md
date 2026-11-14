# JSimples

JSimples é uma aplicação web didática para apoiar o ensino e a aprendizagem de conceitos de teoria de linguagens e compiladores. A pessoa usuária escreve programas na linguagem Simples e acompanha a análise do código e sua execução em uma máquina virtual MVS.

## Recursos

- Editor de código com realce da instrução em execução.
- Compilador da linguagem Simples, com árvore sintática e tabela de símbolos.
- Simulador MVS com execução passo a passo, estado da máquina, memória e pilha.
- Terminal interativo para entrada e saída do programa.
- Painéis redimensionáveis e interface adaptável a telas menores.

## Tecnologias e documentação

- [React](https://react.dev/learn) e [React DOM](https://react.dev/reference/react-dom): interface e renderização.
- [Vite](https://vite.dev/guide/): servidor de desenvolvimento e build de produção.
- [CodeMirror 6](https://codemirror.net/docs/) e [@uiw/react-codemirror](https://uiwjs.github.io/react-codemirror/): editor de código.
- [Ant Design](https://ant.design/components/overview/): componentes de interface.
- [styled-components](https://styled-components.com/docs): estilos associados aos componentes.
- [Viz.js](https://viz-js.com/api/): renderização da árvore sintática.
- [React Icons](https://react-icons.github.io/react-icons/): ícones.
- [ESLint](https://eslint.org/docs/latest/): análise estática do código.

## Organização

O aplicativo está na pasta `app/`. Os arquivos principais ficam em `app/src/`:

| Caminho | Conteúdo |
| --- | --- |
| `App.jsx`, `main.jsx`, `index.css` | Inicialização da aplicação, tema global e estilos base. |
| `components/` | Componentes reutilizáveis da interface, como cabeçalho, editor e controles. |
| `contexts/AppContext.jsx` | Estado compartilhado do código, compilação e execução da MVS. |
| `core/compiler/simples.js` | Analisador/compilador da linguagem Simples e geração de instruções MVS. |
| `core/mvs/mvs.js` | Máquina virtual e execução das instruções MVS. |
| `view/` | Telas principais, espaço de trabalho, tabela de símbolos e ferramentas visuais. |
| `view/tools/` | Editor, terminal, árvore sintática, visualização da MVS e estado da máquina. |
| `config/`, `constants/` | Configurações do editor, constantes e temas. |
| `utils/` | Funções auxiliares para datas e representação da árvore sintática. |
| `styles/`, `assets/` | Folhas de estilo e imagens/logotipos usados pela interface. |

`app/vite.config.js` define o alias `@` para `app/src/` e o caminho-base `/jsimples/`, usado na publicação no GitHub Pages. A pasta `jsimples_scorm/` contém uma distribuição SCORM separada.

## Requisitos

- Node.js compatível com a versão instalada do Vite 6 (Node.js 18 ou superior).
- npm.

## Desenvolvimento local

No terminal, a partir da raiz do repositório:

```bash
cd app
npm install
npm run dev
```

Abra o endereço local informado pelo Vite, normalmente <http://localhost:5173/>.

## Comandos disponíveis

Execute-os dentro de `app/`:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor local com atualização durante o desenvolvimento. |
| `npm run lint` | Verifica o código com ESLint. |
| `npm run build` | Gera a versão de produção em `app/dist/`. |
| `npm run preview` | Serve localmente o conteúdo já construído para conferência. Rode depois de `npm run build`. |

## Construir e distribuir

1. Instale as dependências e gere o build:

   ```bash
   cd app
   npm install
   npm run build
   ```

2. O conteúdo estático pronto para hospedagem será criado em `app/dist/`. Publique **o conteúdo dessa pasta** em um servidor de arquivos estáticos. Como o caminho-base está configurado como `/jsimples/`, a aplicação espera ser publicada nesse caminho; para hospedá-la na raiz de outro domínio, ajuste `base` em `app/vite.config.js` antes do build.

3. Para conferir o resultado localmente:

   ```bash
   npm run preview
   ```

O repositório também inclui `jsimples_scorm/`, uma distribuição para uso em ambientes compatíveis com SCORM. O processo acima constrói a aplicação web em `app/dist/`; ele não gera nem atualiza automaticamente o pacote SCORM.

## Publicação

A aplicação web está publicada em <https://luizedsilva.github.io/jsimples/>. O workflow [Deploy to GitHub Pages](../.github/workflows/pages.yml) constrói `app/` e publica `app/dist/` automaticamente quando há um push para `main` com alterações em `app/**` ou no próprio workflow. Também pode ser iniciado manualmente pela aba **Actions** do GitHub (`workflow_dispatch`). Consulte a execução mais recente nessa aba se a aplicação ainda não refletir um commit; o deploy precisa terminar com sucesso.

O README é documentação do repositório e não faz parte do site publicado: o workflow envia apenas `app/dist/` ao GitHub Pages. Assim, uma alteração neste arquivo aparece no GitHub após o push do commit, mas não altera a página da aplicação. Para atualizar o site, altere o código da aplicação e deixe o workflow gerar e publicar um novo build.

## Material relacionado

O artigo sobre a ferramenta está disponível no arquivo [`JSimples___Uma_ferramenta_web_didática_para_o_ensino_de_conceitos_de_teoria_de_linguagens_e_compiladores.pdf`](src/assets/JSimples___Uma_ferramenta_web_didática_para_o_ensino_de_conceitos_de_teoria_de_linguagens_e_compiladores.pdf).
