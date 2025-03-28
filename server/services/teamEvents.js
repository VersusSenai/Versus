const connection = require("../config/connection.js");

const teamEventsService = {
  getAll: (callback) => {
    const query = "SELECT * FROM team_events";
    connection.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getByTeamId: (teamId, callback) => {
    const query = "SELECT * FROM team_events WHERE teamId = ?";
    connection.query(query, [teamId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  getByEventId: (eventId, callback) => {
    const query = "SELECT * FROM team_events WHERE eventId = ?";
    connection.query(query, [eventId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  create: (teamEventData, callback) => {
    const { teamId, eventId, status } = teamEventData;
    const query =
      "INSERT INTO team_events (teamId, eventId, status) VALUES (?, ?, ?)";
    connection.query(query, [teamId, eventId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.insertId);
    });
  },

  update: (id, teamEventData, callback) => {
    const { status } = teamEventData;
    const query = "UPDATE team_events SET status = ? WHERE id = ?";
    connection.query(query, [status, id], (err, results) => {
      if (err) return callback(err, null);
      if (results.affectedRows === 0)
        return callback("Evento do time não encontrado", null);
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = "DELETE FROM team_events WHERE id = ?";
    connection.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      if (results.affectedRows === 0)
        return callback("Evento do time não encontrado", null);
      callback(null, results);
    });
  },
};

export default teamEventsService;
