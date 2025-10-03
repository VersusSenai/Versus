# Versus Server - Guia de Testes

## Configuração

### Instalação das dependências de teste
```bash
npm install
```

### Estrutura de testes criada:
```
server/
├── tests/
│   ├── __mocks__/           # Mocks das dependências
│   │   ├── @prisma/client.js
│   │   ├── ImageService.js
│   │   └── util.js
│   ├── models/              # Testes dos modelos
│   │   └── TeamModel.test.js
│   └── setup.js             # Configuração global dos testes
├── jest.config.js           # Configuração do Jest
└── package.json             # Scripts de teste adicionados
```

## Scripts de teste disponíveis:

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes com saída verbosa
npm run test:verbose
```

## Recursos dos testes:

### Mocks configurados:
- **PrismaClient**: Mock completo do banco de dados
- **ImageService**: Mock do serviço de upload de imagens
- **serviceUtils**: Mock das funções utilitárias

### Testes implementados para TeamModel:
- ✅ **getAll**: Paginação, filtros, permissões de admin
- ✅ **getById**: Busca por ID, permissões, times privados
- ✅ **create**: Criação com/sem imagem, validações, conflitos
- ✅ **update**: Atualização com validações de proprietário
- ✅ **delete**: Exclusão lógica com validações
- ✅ **inscribe**: Inscrição em times públicos
- ✅ **unsubscribe**: Desinscriçã com validações de papel
- ✅ **isTeamOwner**: Verificação de proprietário/admin
- ✅ **approveTeam**: Aprovação de times

### Utilitários globais:
- `createMockRequest()`: Cria objetos de request mockados
- `createMockResponse()`: Cria objetos de response mockados
- Console logs são mockados para reduzir ruído nos testes

## Executando os testes:

```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências (se ainda não instalou)
npm install

# Executar os testes
npm test
```

### Exemplo de saída esperada:
```
 PASS  tests/models/TeamModel.test.js
  TeamModel
    getAll
      ✓ should return paginated teams successfully
      ✓ should use default values when query params are missing
      ✓ should limit maximum results to 30
      ✓ should throw NotAllowedException when non-admin tries to see deleted teams
      ✓ should allow admin to see deleted teams
    getById
      ✓ should return team for regular user when team exists and is not banned
      ✓ should throw NotFoundException when team is not found
      ✓ should handle private team access for admin
    ... (mais testes)

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
```

## Adicionando novos testes:

Para adicionar testes para outros modelos, crie arquivos similares em `tests/models/` seguindo o padrão:

```javascript
import ModelName from '../../models/ModelName.js';
import { mockPrisma } from '../__mocks__/@prisma/client.js';

describe('ModelName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('methodName', () => {
    it('should do something', async () => {
      // Arrange
      const mockRequest = createMockRequest({});
      
      // Act
      const result = await ModelName.methodName(mockRequest);
      
      // Assert
      expect(result).toEqual(expectedResult);
    });
  });
});
```