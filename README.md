
# Versus - Sistema de Gerenciamento de Torneios e Eventos de Games

Bem-vindo ao repositório do **Versus**, um sistema desenvolvido como parte da Unidade Curricular Projeto Aplicado II do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas do Centro Universitário SENAI Santa Catarina. Este projeto tem como objetivo criar uma plataforma centralizada e intuitiva para gerenciamento de torneios e competições de jogos, oferecendo funcionalidades para organizadores, jogadores, espectadores e administradores.

---

## 📖 Sobre o Projeto

O **Versus** é uma plataforma web que facilita a organização, gerenciamento e acompanhamento de torneios de jogos. A solução permite a criação e personalização de torneios, gestão automatizada de inscrições, acompanhamento em tempo real dos resultados, geração de tabelas, rankings e relatórios detalhados. O sistema foi projetado para ser intuitivo, seguro e escalável, atendendo às necessidades de diferentes partes interessadas, como organizadores de torneios, jogadores, espectadores e administradores.

### Objetivo
O objetivo principal do Versus é oferecer uma experiência profissional e estruturada para a comunidade gamer, simplificando a gestão de torneios e fornecendo uma interface amigável para todos os envolvidos. O projeto abrange desde o cadastro de usuários até a geração de estatísticas detalhadas, com suporte a múltiplos torneios simultâneos e compatibilidade com diferentes dispositivos e navegadores.

### Partes Interessadas
- **Coordenação do Curso**: Aline Antoneli
- **Professor da UC Projeto Aplicado II**: Janice Ines Deters
- **Cliente**: Senai Paraíso do Tocantins
- **Equipe de Desenvolvimento**: 
  - Carlos Alexandre Araujo de Lima
  - Eduardo Teixeira Virissimo
  - Enrik Paulo Lemes da Silva
  - Guilherme Queiroz Sassi

### Atores do Sistema
- Jogadores de torneio
- Organizadores de torneio
- Espectadores de torneios
- Administradores do sistema

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (versão 18 ou superior)
- **npm** (gerenciador de pacotes do Node.js)
- **Git** (para clonar o repositório)
- Um editor de código, como **VS Code**
- **Backend** configurado e em execução (consulte a seção sobre o backend, se aplicável)

### 1. Clone o Repositório
Clone o repositório do projeto para sua máquina local:

```bash
git clone https://github.com/Grupo10Senai/ProjetoAplicado-II.git
```

### 2. Acesse a Pasta do Frontend
Navegue até a pasta do frontend do projeto:

```bash
cd ProjetoAplicado-II/client
```

### 3. Instale as Dependências
Instale as bibliotecas necessárias para o frontend:

```bash
npm install
```

### 4. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na pasta `client` com as configurações necessárias, como a URL do backend. Um exemplo de arquivo `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

> 💡 **Nota**: Certifique-se de que o backend esteja configurado e acessível pela URL especificada no `.env`. Consulte a documentação do backend para mais detalhes.

### 5. Execute o Projeto
Inicie o servidor de desenvolvimento do frontend:

```bash
npm run dev
```

A aplicação será aberta automaticamente no navegador, geralmente no endereço:

```
http://localhost:5173
```

### 6. Configuração do Backend (Opcional)
Se o projeto incluir um backend, siga as instruções específicas no repositório do backend para configurá-lo. Certifique-se de que ele esteja rodando antes de iniciar o frontend, pois algumas funcionalidades dependem da comunicação com a API.

---

## 🛠 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

### Frontend
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite**: Ferramenta de build e desenvolvimento para projetos frontend modernos.
- **Tailwind CSS**: Framework CSS para estilização rápida e responsiva.
- **Axios**: Biblioteca para realizar requisições HTTP à API do backend.
- **React Router**: Biblioteca para gerenciamento de rotas no frontend.

### Backend (se aplicável)
- **Node.js** com **Express**: Framework para construção da API REST.
- **PostgreSQL**: Banco de dados relacional para armazenamento de dados.
- **Prisma**: ORM para interação com o banco de dados.
- **JWT**: Autenticação segura baseada em tokens.

### Ferramentas de Desenvolvimento
- **Git**: Controle de versão.
- **GitHub**: Hospedagem do repositório.
- **VS Code**: Editor de código.
- **Figma**: Ferramenta utilizada para prototipagem do layout.

---

## 🎨 Layout

O layout do Versus foi projetado com foco em **usabilidade** e **responsividade**, garantindo uma experiência fluida em diferentes dispositivos (desktop, tablets e smartphones). A interface é intuitiva, com cores vibrantes e elementos visuais que refletem a temática gamer, mantendo a acessibilidade e facilidade de uso para todos os atores do sistema.

### Telas Principais
- **Tela de Login/Cadastro**: Permite que jogadores e organizadores se cadastrem ou façam login com email e senha.
- **Dashboard do Jogador**: Exibe torneios disponíveis, times inscritos e informações do perfil.
- **Dashboard do Organizador**: Interface para criar, gerenciar e modificar torneios, além de acompanhar resultados.
- **Tela de Torneios**: Exibe chaveamentos, rankings e resultados em tempo real para espectadores e participantes.
- **Relatórios**: Interface para exportação de relatórios detalhados de desempenho.

Os protótipos do layout foram criados no **Figma** e estão disponíveis no repositório ou sob demanda para consulta.

---

## 📋 Requisitos do Sistema

### Requisitos Funcionais
- **RF01**: Cadastro de jogadores com nome de usuário, email e senha.
- **RF02**: Cadastro de organizadores com nome de usuário, email e senha.
- **RF03**: Inscrição de jogadores em torneios.
- **RF04**: Criação de times com nome, descrição e ícone.
- **RF05**: Inscrição de times em torneios.
- **RF06**: Gerenciamento de cargos e permissões dentro de times.
- **RF07**: Alteração de informações de usuário (nome, senha).
- **RF08**: Alteração de email com token de confirmação.
- **RF09/RF16**: Criação e modificação de torneios por organizadores.
- **RF10**: Visualização de informações de torneios por espectadores.
- **RF11**: Adição de outros organizadores a torneios.
- **RF14**: Exportação de relatórios.
- **RF15**: Sistema de login com autenticação por email e senha.

### Requisitos Não Funcionais
- **RNF01**: Compatibilidade com as últimas versões (maio de 2023) dos navegadores Chrome, Edge, Safari e Opera.
- **RNF02**: Disponibilidade 20/6, com manutenção das 03:00 às 06:00.
- **RNF03**: Suporte a 10 torneios simultâneos sem perda de desempenho.
- **RNF04**: Interface intuitiva e fácil de usar.
- **RNF05**: Autenticação segura e proteção contra acessos não autorizados.
- **RNF06**: Atualizações de resultados em tempo real.
- **RNF07**: Backup periódico toda sexta-feira.

---


## 📈 Estrutura do Projeto

A estrutura de pastas do projeto reflete a separação clara entre frontend e backend, com organização otimizada para desenvolvimento e manutenção. Abaixo está a estrutura detalhada:

```
ProjetoAplicado-II/
├── client/                    # Pasta do frontend
│   ├── public/                # Arquivos estáticos (imagens, ícones, etc.)
│   ├── src/                   # Código-fonte do frontend
│   │   ├── assets/            # Recursos como imagens e fontes
│   │   ├── components/        # Componentes reutilizáveis do React
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── redux/             # Gerenciamento de estado com Redux
│   │   ├── services/          # Configurações de API e requisições
│   │   ├── App.jsx            # Componente principal
│   │   ├── main.jsx           # Ponto de entrada do React
│   ├── .env                   # Variáveis de ambiente
│   ├── .env.example           # Exemplo de configuração de variáveis de ambiente (recomendado adicionar)
│   ├── package.json           # Dependências e scripts
│   ├── vite.config.js         # Configurações do Vite
│   ├── vite.svg               # Ícone ou logo do projeto
├── server/                    # Pasta do backend
│   ├── middlewares/           # Middleware para autenticação e validação
│   ├── node_modules/          # Dependências instaladas
│   ├── prisma/                # Configurações e migrações do Prisma para o banco de dados
│   ├── routes/                # Definições de rotas da API
│   ├── services/              # Lógica de negócios e serviços
│   ├── .env                   # Arquivo de variáveis de ambiente (ex.: configurações de banco de dados)
│   ├── .env.example           # Exemplo de configuração de variáveis de ambiente (recomendado adicionar)
│   ├── package.json           # Dependências e scripts do backend
│   ├── package-lock.json      # Controle de versões das dependências
│   ├── tsconfig.json          # Configurações do TypeScript (se aplicável)
├── .gitignore                 # Define arquivos e pastas a serem ignorados pelo Git (verifique se .env está incluído)
├── .prettierrc.json           # Configurações do Prettier para formatação de código
├── eslintrc.js                # Configurações do ESLint para análise de código
├── LICENSE                    # Licença do projeto
└── README.md                  # Documentação do projeto
```

> 💡 **Nota**: Certifique-se de que o `.gitignore` exclua arquivos sensíveis como `.env` e que `.env.example` seja criado para facilitar a configuração por outros desenvolvedores.


---

## 🛠 Scripts Disponíveis

No diretório `client`, você pode executar os seguintes comandos:

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera uma versão otimizada para produção.
- `npm run preview`: Visualiza a versão de produção localmente.

---

## 📚 Documentação Adicional

- **Diagrama de Entidade e Relacionamento**: Disponível no documento do sistema, detalhando a estrutura do banco de dados.
- **Diagrama de Casos de Uso**: Descreve as interações dos atores com o sistema.
- **Protótipos no Figma**: Disponíveis sob demanda para visualização do layout.

---

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:
1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para o repositório remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

---

## 📞 Contato

Para dúvidas ou sugestões, entre em contato com a equipe:
- **Guilherme Queiroz Sassi**: guilherme.sassi@example.com
- **Eduardo Teixeira Virissimo**: eduardo.virissimo@example.com
- **Carlos Alexandre Araujo de Lima**: carlos.lima@example.com
- **Enrik Paulo Lemes da Silva**: enrik.silva@example.com

---

**Versus** - Transformando a gestão de torneios de games em uma experiência profissional e acessível! 🎮
