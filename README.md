<a id="readme-top"></a>
<br />
<div align="center">
  <img src="/client/src/assets/logo.svg" align="center" height="160"/>
  <h1 align="center">Desafio UC: Versus</h1>
  <p align="center">
    Plataforma completa para gerenciamento de torneios e eventos de games
    <br />
    <a href="https://github.com/VersusSenai/Versus"><strong>Explore a documentação »</strong></a>
    <br />
    <br />
    <a href="https://github.com/VersusSenai/Versus/issues">Reportar Bug</a>
    ·
    <a href="https://github.com/VersusSenai/Versus/issues">Solicitar Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>📑 Índice</summary>
  <ol>
    <li><a href="#-sobre-o-projeto">Sobre o Projeto</a></li>
    <li><a href="#️-construído-com">Construído Com</a></li>
    <li><a href="#-funcionalidades">Funcionalidades</a></li>
    <li><a href="#-começando">Começando</a></li>
    <li><a href="#-estrutura-do-projeto">Estrutura do Projeto</a></li>
    <li><a href="#-colaboradores">Colaboradores</a></li>
    <li><a href="#-licença">Licença</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## 📌 Sobre o projeto

O **Versus** é uma plataforma web desenvolvida para o gerenciamento completo de torneios e eventos de games. Ele permite a criação de torneios, gerenciamento de usuários e times, visualização de resultados e acompanhamento de estatísticas em tempo real.

O projeto é dividido entre:
- **Frontend**: Interface moderna e responsiva para os usuários, desenvolvida com React e TailwindCSS
- **Backend**: API REST robusta responsável pela lógica de negócio e persistência de dados, construída com Node.js e Express

Com foco em escalabilidade, segurança e usabilidade, o Versus oferece uma experiência completa tanto para organizadores quanto para participantes de torneios.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

### 🛠️ Construído com

#### Frontend
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
* ![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

#### Backend
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
* ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
* ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

#### Ferramentas
* ![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)
* ![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
* ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## ✨ Funcionalidades

- ✅ Criação e gerenciamento de torneios
- ✅ Sistema de autenticação e autorização com JWT
- ✅ Gerenciamento de usuários e times
- ✅ Visualização de resultados e rankings
- ✅ Interface responsiva e intuitiva
- ✅ API REST documentada
- ✅ Persistência de dados com MySQL
- ✅ ORM com Prisma para maior segurança e produtividade

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- GETTING STARTED -->
## 🚀 Começando

### 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

* **Node.js** (versão 16 ou superior)
* **Yarn** (gerenciador de pacotes)
* **MySQL** (banco de dados)
* **Git** (controle de versão)

Para verificar se o Node.js e Yarn estão instalados:
```sh
node --version
yarn --version
```

### 🔧 Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1. **Clone o repositório**
   ```sh
   git clone https://github.com/VersusSenai/Versus.git
   cd Versus
   ```

2. **Configure o Frontend**
   ```sh
   cd client
   yarn install
   ```

3. **Configure o Backend**
   ```sh
   cd ../server
   yarn install
   ```

4. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` no diretório `./server` com as seguintes variáveis:
   ```env
   # Configurações do Servidor
   PORT=8080
   
   # Configurações de Segurança
   JWT_SECRET=sua_chave_secreta_aqui
   SALT_ROUNDS=10
   
   # Configurações do Banco de Dados
   DATABASE_URL="mysql://usuario:senha@localhost:3306/versus"
   ```
   
   > ⚠️ **Importante**: Substitua `usuario` e `senha` pelas credenciais do seu MySQL

5. **Execute as migrations do Prisma**
   ```sh
   yarn prisma migrate dev
   ```

6. **Inicie o Backend**
   ```sh
   yarn run dev
   ```
   O servidor estará rodando em `http://localhost:8080`

7. **Inicie o Frontend** (em outro terminal)
   ```sh
   cd client
   yarn run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## 📁 Estrutura do Projeto

```
Versus/
├── client/                 # Frontend da aplicação
│   ├── src/
│   │   ├── assets/        # Imagens, ícones e recursos estáticos
│   │   ├── components/    # Componentes React reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   └── ...
│   └── package.json
│
├── server/                 # Backend da aplicação
│   ├── prisma/            # Schema e migrations do Prisma
│   ├── src/
│   │   ├── controllers/   # Controladores da API
│   │   ├── routes/        # Rotas da API
│   │   ├── middlewares/   # Middlewares de autenticação e validação
│   │   └── ...
│   └── package.json
│
└── README.md
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## 💬 Colaboradores

Agradecimentos especiais a todos que contribuíram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/guiqsassi">
        <img src="https://avatars.githubusercontent.com/u/106497090?v=4" width="100px;" alt="Guilherme Queiroz Sassi"/><br />
        <sub><b>Guilherme Queiroz Sassi</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Eduardo-Virissimo">
        <img src="https://avatars.githubusercontent.com/u/44625373?v=4" width="100px;" alt="Eduardo Teixeira Virissimo"/><br />
        <sub><b>Eduardo Teixeira Virissimo</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Ximbeh">
        <img src="https://avatars.githubusercontent.com/u/100860445?v=4" width="100px;" alt="Enrik Paulo Lemes da Silva"/><br />
        <sub><b>Cairé de Marco Maia</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Victorhumbert">
        <img src="https://avatars.githubusercontent.com/u/107077339?v=4" width="100px;" alt="Victor Humbert"/><br />
        <sub><b>Victor Humbert</b></sub>
      </a>
    </td>
  </tr>
</table>

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## 📄 Licença

Este projeto foi desenvolvido como parte do Desafio UC do SENAI.

---

<div align="center">
  <p>Desenvolvido com ❤️ pela equipe Versus</p>
  <p>
    <a href="https://github.com/VersusSenai/Versus">GitHub</a>
  </p>
</div>

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>
