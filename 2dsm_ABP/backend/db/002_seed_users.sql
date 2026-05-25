-- Seed: usuários iniciais para desenvolvimento
-- Senhas geradas com bcrypt (salt rounds = 10)
-- Para regenerar: npx ts-node src/utils/hashPassword.ts <senha>

INSERT INTO users (username, password_hash, role, name) VALUES
(
  'admin',
  '$2b$10$obhZ42jNZeqtoknHKxznd.Q34BlfTkstgWA.TldxC40cPc7jmOOOm',
  'admin',
  'Administrador'
),
(
  'secretaria',
  '$2b$10$9/VqMoYJkrug8kox6vNsYeZF0ByG/QCucky0DMQTMTysS/L/X35La',
  'secretaria',
  'Secretaria'
)
ON CONFLICT (username) DO NOTHING;
