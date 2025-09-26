import swaggerJSDoc from 'swagger-jsdoc';
import 'dotenv/config';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Versus Api',
      version: '1.0.0',
      description: 'Documentação do sistema de torneios',
    },
    servers: [
      {
        url: process.env.BACKEND_URL || 'http://localhost:8080',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'Acesso para usuários logados com qualquer papel.'
        },
        organizerAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'Acesso restrito para usuários com o papel de Organizador (O) ou Administrador (A)'
        },
        adminAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'Acesso restrito apenas para usuários com o papel de Administrador (A)'
        }
      },
      schemas: {
                User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            id: { type: 'integer', example: 1 },
            username: { 
              type: 'string', 
              example: "joaosilva",
              minLength: 3,
              maxLength: 100 
            },
            email: { 
              type: 'string', 
              format: 'email',
              example: "joao@email.com",
              maxLength: 100 
            },
            password: { 
              type: 'string',
              example: "senhaSegura123",
              minLength: 6,
              maxLength: 255,
              writeOnly: true
            },
            role: { 
              type: 'string', 
              enum: ['P', 'O', 'A'],
              description: "P = Player, O = Organizer, A = Admin",
              example: "P"
            },
            registeredDate: { 
              type: 'string', 
              format: 'date-time',
              readOnly: true 
            },
            status: { 
              type: 'string', 
              enum: ['A', 'D'],
              description: "A = Ativo, D = Desativado",
              example: "A",
              readOnly: true
            }
          }
        },
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: "joaosilva" },
            email: { type: 'string', format: 'email', example: "joao@email.com" },
            role: { type: 'string', enum: ['P', 'O', 'A'] },
            registeredDate: { type: 'string', format: 'date-time' }
          }
        },
        Event: {
          type: 'object',
          required: ['name', 'startDate', 'maxPlayers'],
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: "Torneio de Verão" },
            description: { type: 'string', example: "Torneio anual de verão" },
            maxPlayers: { 
              type: 'integer', 
              example: 8,
              description: "Deve ser um número par e potência de 2 (2, 4, 8, 16...)" 
            },
            startDate: { 
              type: 'string', 
              format: 'date-time',
              example: "2025-07-01T10:00:00Z" 
            },
            endDate: { 
              type: 'string', 
              format: 'date-time',
              example: "2025-07-02T18:00:00Z" 
            },
            model: { 
              type: 'string', 
              enum: ['P', 'O'],
              description: "P = Presencial, O = Online" 
            },
            status: { 
              type: 'string', 
              enum: ['E', 'O', 'P'],
              description: "E = Encerrado, O = Em andamento, P = Pendente" 
            },
            matchsQuantity: { type: 'integer', example: 4 },
            keysQuantity: { type: 'integer', example: 3 },
            multiplayer: { 
              type: 'boolean',
              description: "Se o evento é para times (true) ou individuais (false)" 
            }
          }
        },
        EventInscription: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer', nullable: true },
            teamId: { type: 'integer', nullable: true },
            eventId: { type: 'integer' },
            status: { 
              type: 'string',
              enum: ['O', 'L', 'W', 'R'],
              description: "O = OK, L = Perdeu, W = Vencedor, R = Removido" 
            },
            role: { 
              type: 'string',
              enum: ['O', 'P'],
              description: "O = Dono do evento, P = Participante" 
            }
          }
        },
        Match: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            eventId: { type: 'integer' },
            keyNumber: { type: 'integer' },
            firstUserId: { type: 'integer', nullable: true },
            secondUserId: { type: 'integer', nullable: true },
            firstTeamId: { type: 'integer', nullable: true },
            secondTeamId: { type: 'integer', nullable: true },
            time: { type: 'string', format: 'date-time' },
            winnerId: { type: 'integer', nullable: true },
            loserId: { type: 'integer', nullable: true }
          }
        }
      }
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;