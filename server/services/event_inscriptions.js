const connection = require("../config/connection.js");

const eventInscriptionService = {
  getAll: (callback) => {
    const query = 'SELECT * FROM event_inscriptions';
    connection.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getByUserId: (userId, callback) => {
    const query = 'SELECT * FROM event_inscriptions WHERE userId = ?';
    connection.query(query, [userId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getByEventId: (eventId, callback) => {
    const query = 'SELECT * FROM event_inscriptions WHERE eventId = ?';
    connection.query(query, [eventId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  create: (inscriptionData, callback) => {
    const { userId, eventId } = inscriptionData;
    const query =
      'INSERT INTO event_inscriptions (userId, eventId) VALUES (?, ?)';
    connection.query(query, [userId, eventId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.insertId);
    });
  },

  update: (id, inscriptionData, callback) => {
    const { status } = inscriptionData;
    const query = 'UPDATE event_inscriptions SET status = ? WHERE id = ?';
    connection.query(query, [status, id], (err, results) => {
      if (err) return callback(err, null);
      if (results.affectedRows === 0)
        return callback("Inscrição não encontrada", null);
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM event_inscriptions WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      if (results.affectedRows === 0)
        return callback("Inscrição não encontrada", null);
      callback(null, results);
    });
  },
};

export default eventInscriptionService;