# figma-make-app

Projeto React + Vite + Tailwind CSS rodando dentro do Figma Make.

##ServidorDeDesenvolvimento

Um servidor de desenvolvimento Vite está **sempre em execução** na `$PORT` (padrão 8443). Você não precisa iniciá-lo manualmente.

- URL de pré-visualização: O usuário pode acessar o aplicativo em execução através do painel de pré-visualização.
- Recarregamento instantâneo: As alterações nos arquivos de origem são refletidas imediatamente.

## Arquivos Principais

- `src/App.tsx` - Componente principal do aplicativo
- `src/main.tsx` - Ponto de entrada do React
- `src/index.css` - Estilos globais e importação do Tailwind CSS
- `package.json` - Dependências e scripts
- `vite.config.ts` - Configuração do Vite
- `.mise.toml` - Versões das ferramentas (Node.js, pnpm)

## Rodar
- npm install
- npm run dev      # dev server em localhost:3000
- npm run build    # build de produção em /dist
- npm run preview  # serve o /dist localmente

## Credenciais de teste:

- Administrador: admin@nobre.com/admin123
- Exemplos de clientes: ana@email.com/ 123456, etc.

## Estilização

Este projeto utiliza o **Tailwind CSS v4** para estilização. Utilize as classes utilitárias do Tailwind diretamente no JSX. O Tailwind é carregado através do plugin Vite — nenhuma configuração do PostCSS é necessária.

