-- ====================================================================
-- Script de Seed para Versus Database
-- Cria 8 usuários jogadores + 1 evento + inscrições
-- ====================================================================

-- Limpar dados existentes (opcional - descomente se quiser limpar antes)
-- DELETE FROM EventInscriptions WHERE role = 'P';
-- DELETE FROM User WHERE role = 'P' AND username LIKE 'player%';
-- DELETE FROM Event WHERE name = 'Torneio de Testes';

-- ====================================================================
-- 1. CRIAR 8 USUÁRIOS JOGADORES
-- ====================================================================
-- Senha: 'senha123' (você deve usar bcrypt hash na prática)
-- Hash bcrypt de 'senha123' com salt 10: $2b$10$rZ7ZqK3qX5J1vW8xK4YvH.V4nQJ5LZ5K4YvH.V4nQJ5LZ5K4YvH.
-- IMPORTANTE: Gere hashes reais com bcrypt antes de usar em produção!

INSERT INTO User (username, email, password, role, status, registered_date) VALUES
('player1', 'player1@versus.com', '$2b$10$rZ7ZqK3qX5J1vW8xK4YvH.V4nQJ5LZ5K4YvH.V4nQJ5LZ5K4YvH.', 'P', 'A', NOW()),
('player2', 'player2@versus.com', '$2b$10$rZ7ZqK3qX5J1vW8xK4YvH.V4nQJ5LZ5K4YvH.V4nQJ5LZ5K4YvH.', 'P', 'A', NOW()),
('player3', 'player3@versus.com', '$2b$10$rZ7ZqK3qX5J1vW8xK4YvH.V4nQJ5LZ5K4YvH.V4nQJ5LZ5K4YvH.', 'P', 'A', NOW()),
('player4', 'player4@versus.com', '$2b$10$rZ7ZqK3qX5J1vW8xK4YvH.V4nQJ5LZ5K4YvH.V4nQJ5LZ5K4YvH.', 'P', 'A', NOW()),
('player5', 'player5@versus.com', '$2b$10$rZ7ZqK3qX5J1vW8xK4YvH.V4nQJ5LZ5K4YvH.V4nQJ5LZ5K4YvH.', 'P', 'A', NOW()),
('player6', 'player6@versus.com', '$2b$10$rZ7ZqK3qX5J1vW8xK4YvH.V4nQJ5LZ5K4YvH.V4nQJ5LZ5K4YvH.', 'P', 'A', NOW()),
('player7', 'player7@versus.com', '$2b$10$rZ7ZqK3qX5J1vW8xK4YvH.V4nQJ5LZ5K4YvH.V4nQJ5LZ5K4YvH.', 'P', 'A', NOW()),
('player8', 'player8@versus.com', '$2b$10$rZ7ZqK3qX5J1vW8xK4YvH.V4nQJ5LZ5K4YvH.V4nQJ5LZ5K4YvH.', 'P', 'A', NOW());

-- ====================================================================
-- 2. CRIAR UM EVENTO DE TESTE
-- ====================================================================
-- maxPlayers = 8 (potência de 2, par)
-- startDate e endDate ajustados para permitir inscrições e início
-- status = 'P' (Pendente)
-- multiplayer = false (individual)

INSERT INTO Event (
    name, 
    description, 
    maxPlayers, 
    start_date, 
    end_date, 
    model, 
    status, 
    multiplayer,
    private
) VALUES (
    'Torneio de Testes',
    'Evento criado para testes de funcionalidades do sistema Versus',
    8,
    DATE_ADD(NOW(), INTERVAL 1 DAY),     -- Começa amanhã
    DATE_ADD(NOW(), INTERVAL 2 DAY),     -- Termina em 2 dias
    'O',                                  -- Online
    'P',                                  -- Pendente
    false,                                -- Individual (não é multiplayer)
    false                                 -- Público
);

-- ====================================================================
-- 3. INSCREVER OS 8 JOGADORES NO EVENTO
-- ====================================================================
-- Assume que o evento criado tem ID = LAST_INSERT_ID()
-- role = 'P' (Participante/Player)
-- status = 'O' (OK - inscrito)

SET @event_id = LAST_INSERT_ID();

INSERT INTO EventInscriptions (userId, eventId, role, status, registered_date)
SELECT 
    id, 
    @event_id, 
    'P',        -- role: Player
    'O',        -- status: OK
    NOW()
FROM User 
WHERE username IN ('player1', 'player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8')
ORDER BY id
LIMIT 8;

-- ====================================================================
-- 4. INSCRIÇÃO DO DONO DO EVENTO (VOCÊ!)
-- ====================================================================
-- Descomente a linha abaixo e substitua <SEU_USER_ID> pelo ID do seu usuário
-- Isso fará você ser o organizador/dono do evento

-- INSERT INTO EventInscriptions (userId, eventId, role, status, registered_date)
-- VALUES (<SEU_USER_ID>, @event_id, 'O', 'O', NOW());

-- Exemplo: se seu user id for 1:
-- INSERT INTO EventInscriptions (userId, eventId, role, status, registered_date)
-- VALUES (1, @event_id, 'O', 'O', NOW());

-- ====================================================================
-- 5. VERIFICAR DADOS INSERIDOS
-- ====================================================================

-- Listar usuários criados
SELECT id, username, email, role, status FROM User WHERE username LIKE 'player%';

-- Listar evento criado
SELECT id, name, maxPlayers, start_date, end_date, status, multiplayer FROM Event WHERE name = 'Torneio de Testes';

-- Listar inscrições no evento
SELECT 
    ei.id,
    u.username,
    ei.role,
    ei.status,
    e.name as event_name
FROM EventInscriptions ei
JOIN User u ON ei.userId = u.id
JOIN Event e ON ei.eventId = e.id
WHERE e.name = 'Torneio de Testes'
ORDER BY ei.role DESC, u.username;

-- ====================================================================
-- NOTAS IMPORTANTES
-- ====================================================================
-- 1. SENHAS: O hash usado aqui é apenas exemplo! Em produção, gere hashes
--    bcrypt reais para cada senha. Use Node.js:
--    const bcrypt = require('bcrypt');
--    const hash = await bcrypt.hash('senha123', 10);
--
-- 2. IDs: Os IDs são auto-incrementados pelo MySQL. Se você já tem dados,
--    os IDs podem não começar em 1.
--
-- 3. DONO DO EVENTO: Não esqueça de descomentar e ajustar a linha do
--    INSERT do dono (role = 'O') com o ID do seu usuário!
--
-- 4. EXECUTAR O SCRIPT:
--    mysql -u root -p versus < server/prisma/seed.sql
--    OU via Docker:
--    docker compose exec mysql mysql -u root -p versus < server/prisma/seed.sql
--
-- 5. LIMPAR DADOS: Se quiser remover tudo e recomeçar, use:
--    DELETE FROM EventInscriptions WHERE eventId = @event_id;
--    DELETE FROM Event WHERE id = @event_id;
--    DELETE FROM User WHERE username LIKE 'player%';
--
-- ====================================================================
