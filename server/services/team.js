const connection = require("../config/connection.js");

const teamService = {
  getAll: (callback) => {
    const query = 'SELECT * FROM team';
    connection.query(query, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM team WHERE id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) return callback(err, null);
      if (result.lenght === 0)
        return callback({ message: "Team não encontrado" }, null);
      callback(null, result);
    });
  },

  create: (teamData, callback) => {
    const { name, ownerId, description } = teamData;
    const query =
      'INSERT INTO team (name, ownerId, description) VALUES (?, ?, ?)';
    connection.query(query, [name, ownerId, description], (err, result) => {
      if (err) return callback(err, null);
      callback(null, {
        message: "Time criado com sucesso",
        id: result.insertId,
      });
    });
  },

  update: (id, teamData, callback) => {
    const { name, ownerId, description } = teamData;
    const query =
      'UPDATE team SET name = ?, ownerId = ?, description = ? WHERE id = ?';
    connection.query(query, [name, ownerId, description, id], (err, result) => {
      if (err) return callback(err, null);
      if (result.affectedRows === 0)
        return callback({ message: "Team não encontrado" }, null);
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM team WHERE id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) return callback(err, null);
      if (result.affectedRows === 0)
        return callback({ message: "Team não encontrado" }, null);
      callback(null, { message: "Team deletado com sucesso" });
    });
  },
};

export default teamService;
