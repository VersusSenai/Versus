<a id="readme-top"></a>
  <img src="/client/src/assets/logo.svg" height="80"/>
 <br /> <div align="center"> <h1 align="center">Desafio UC: Versus</h1><br /> </p> </div> <!-- ABOUT THE PROJECT -->
## 📌 Sobre o projeto

O sistema Versus é uma plataforma web desenvolvida para o gerenciamento de torneios e eventos de games. Ele permite a criação de torneios, gerenciamento de usuários e times, visualização de rankings, chaveamentos e muito mais. Foi desenvolvido como parte da UC Projeto Aplicado II do curso de Análise e Desenvolvimento de Sistemas do Centro Universitário SENAI Santa Catarina.

O projeto é dividido entre frontend (interface para os usuários) e backend (API REST responsável pela lógica de negócio e persistência de dados), com foco em escalabilidade, segurança e usabilidade.

###  🛠️ Construído com


* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
* ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
* ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
* ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
* ![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)
* ![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## 🚀 Começando

### 📋 Pré-requisitos

  É necessário ter yarn e node instalados no computador

### 🔧 Instalação

_Para instalar este projeto você precisa:_

1. Clonar o repositório
   ```sh
   git clone https://github.com/Grupo10Senai/Versus.git
   ```
2. Instalar os pacotes do FrontEnd
   ```sh
   cd ./Client 
   ```
   ```sh
   yarn install
   ```
3. Iniciar o FrontEnd
   ```sh
   yarn run dev 
   ```
4. Instalar os pacotes do BackEnd
   ```sh
   cd ../server 
   ```
   ```sh
   yarn install
   ```
5. Inserir os dados no .env no diretório ./server
   ```sh
    ##exemplo
    JWT_SECRET=key
    PORT=8080
    SALT_ROUNDS=10
    JWT_SECRET=PAVERSUS
    DATABASE_URL="mysql://root:123@localhost:3306/versus"
   ```
6. Realizar a migration do prisma
   ```sh
   yarn prisma migrate dev
   ```
7. Iniciar o BackEnd
   ```sh
   yarn run dev 
   ```
## 💬 Colaboradores


* Guilherme Queiroz Sassi
* Eduardo Teixeira Virissimo
* Enrik Paulo Lemes da Silva



<p align="right">(<a href="#readme-top">back to top</a>)</p>

