const connection = require("../config/connection.js");

const teamUsersService = {
  getAll: (callback) => {
    const query = "SELECT * FROM team_users";
    connection.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getByUserId: (userId, callback) => {
    const query = "SELECT * FROM team_users WHERE userId = ?";
    connection.query(query, [userId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getByTeamId: (teamId, callback) => {
    const query = "SELECT * FROM team_users WHERE teamId = ?";
    connection.query(query, [teamId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  create: (teamUserData, callback) => {
    const { userId, teamId, role } = teamUserData;
    const query =
      "INSERT INTO team_users (userId, teamId, role) VALUES (?, ?, ?)";
    connection.query(query, [userId, teamId, role], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.insertId);
    });
  },

  update: (id, teamUserData, callback) => {
    const { status } = teamUserData;
    const query = "UPDATE team_users SET status = ? WHERE id = ?";
    connection.query(query, [status, id], (err, results) => {
      if (err) return callback(err, null);
      if (results.affectedRows === 0)
        return callback("Usuário do time não encontrado", null);
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = "DELETE FROM team_users WHERE id = ?";
    connection.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      if (results.affectedRows === 0)
        return callback("Usuário do time não encontrado", null);
      callback(null, results);
    });
  },
};

export default teamUsersService;
