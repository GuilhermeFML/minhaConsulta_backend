const db = require('../db/database');

// Obter consultas com verificação direta de role e userId
const getAllConsultations = (req, res) => {
  const { userId, role } = req.headers; // Pegando do header da requisição

  if (!userId || !role) {
    return res.status(401).json({ error: 'Informações de autenticação ausentes.' });
  }

  let sql;
  let params = [];

  if (role === 'admin') {
    // Admin pode ver todas as consultas
    sql = `SELECT consultations.*, users.username 
           FROM consultations 
           JOIN users ON consultations.userId = users.id`;
  } else if (role === 'user') {
    // Usuário comum só pode ver suas próprias consultas
    sql = `SELECT consultations.*, users.username 
           FROM consultations 
           JOIN users ON consultations.userId = users.id 
           WHERE consultations.userId = ?`;
    params = [userId];
  } else {
    return res.status(403).json({ error: 'Permissão negada.' });
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ consultations: rows });
  });
};

// Criar nova consulta
const createConsultation = (req, res) => {
  const { userId, date, doctor, specialty, status } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
  }

  const sql = `INSERT INTO consultations (userId, date, doctor, specialty, status) 
               VALUES (?, ?, ?, ?, ?)`;
  const params = [userId, date, doctor, specialty, status];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'Consulta criada com sucesso!',
      consultationId: this.lastID,
    });
  });
};

// Atualizar uma consulta
const updateConsultation = (req, res) => {
  const { id } = req.params;
  const { date, doctor, specialty, status, userId } = req.body;

  const sql = `UPDATE consultations 
               SET date = ?, doctor = ?, specialty = ?, status = ?, userId = ? 
               WHERE id = ?`;
  const params = [date, doctor, specialty, status, userId, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Consulta atualizada com sucesso.' });
  });
};

module.exports = { getAllConsultations, createConsultation, updateConsultation };
