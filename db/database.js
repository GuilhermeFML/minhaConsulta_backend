const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./consultas.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Ativar as chaves estrangeiras no SQLite
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
      console.error('Erro ao ativar chaves estrangeiras:', err.message);
    }
  });

  // Criar a tabela de usuários
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )`);

  // Criar a tabela de consultas com chave estrangeira para userId
  db.run(`CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    date TEXT NOT NULL,
    doctor TEXT NOT NULL,
    specialty TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Inserir dados iniciais (opcional para testes)
  db.run(
    `INSERT INTO users (username, password, role) VALUES 
    ('admin', '1234', 'admin'),
    ('user1', '1234', 'user'),
    ('user2', '1234', 'user')
    `,
    (err) => {
      if (err) {
        console.log('Dados de usuários já inseridos.');
      } else {
        console.log('Usuários inseridos com sucesso.');
      }
    }
  );

  db.run(
    `INSERT INTO consultations (userId, date, doctor, specialty, status) VALUES 
    (1, '2024-10-10', 'Dra. Maria Oliveira', 'Cardiologia', 'Agendada'),
    (2, '2024-10-12', 'Dr. Pedro Martins', 'Dermatologia', 'Confirmada'),
    (1, '2024-10-18', 'Dr. Rafael Costa', 'Ginecologia', 'Cancelada')
    `,
    (err) => {
      if (err) {
        console.log('Dados de consultas já inseridos.');
      } else {
        console.log('Consultas inseridas com sucesso.');
      }
    }
  );
});

module.exports = db;
