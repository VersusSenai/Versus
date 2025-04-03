const connection = require("../config/connection.js");

const eventService = {
  getAll: (callback) => {
    const query = 'SELECT * FROM events';
    connection.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM events WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  create: (eventData, callback) => {
    const { name, description, start_date, end_date, model, status } =
      eventData;
    const query =
      'INSERT INTO events (name, description, start_date, end_date, model, status) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(
      query,
      [name, description, start_date, end_date, model, status],
      (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.insertId);
      }
    );
  },

  update: (id, eventData, callback) => {
    const { name, description, start_date, end_date, model, status } =
      eventData;
    const query =
      'UPDATE events SET name = ?, description = ?, start_date = ?, end_date = ?, model = ?, status = ? WHERE id = ?';
    connection.query(
      query,
      [name, description, start_date, end_date, model, status, id],
      (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0)
          return callback("Evento não encontrado", null);
        callback(null, results);
      }
    );
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM events WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      if (results.affectedRows === 0)
        return callback("Evento não encontrado", null);
      callback(null, results);
    });
  },
};

export default eventService;
