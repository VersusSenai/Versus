const connection = require("../config/connection.js");

const matchService = {
  
  getAll: (callback) => {
    const query = "SELECT * FROM matchs";
    connection.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    const query = "SELECT * FROM matchs WHERE id = ?";
    connection.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      if (results.lenght === 0)
        return callback({ message: "Partida não encontrada" }, null);
      callback(null, results[0]);
    });
  },

  create: (matchData, callBack) => {
    const { eventId, firstTeamId, secondTeamId, time, winnerId, loserId } =
      matchData;
    const query =
      "INSERT INTO matchs (eventId, firstTeamId, secondTeamId, time, winnerId, loserId) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(
      query,
      [eventId, firstTeamId, secondTeamId, time, winnerId, loserId],
      (err, results) => {
        if (err) return callBack(err, null);
        callBack(null, results.insertId);
      }
    );
  },

  update: (id, matchData, callback) => {
    const { eventId, firstTeamId, secondTeamId, time, winnerId, loserId } =
      matchData;
    const query =
      "UPDATE matchs SET eventId = ?, firstTeamId = ?, secondTeamId = ?, time = ?, winnerId = ?, loserId = ? WHERE id = ?";
    connection.query(
      query,
      [eventId, firstTeamId, secondTeamId, time, winnerId, loserId, id],
      (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0)
          return callback("Partida não encontrada", null);
        callback(null, results);
      }
    );
  },

  delete: (id, callback) => {
    const query = "DELETE FROM matchs WHERE id = ?";
    connection.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      if (results.affectedRows === 0)
        return callback("Partida não encontrada", null);
      callback(null, results);
    });
  },
};

export default matchService;
