// Functions requires ↓

const { getConnection } = require("../database/connectionDB");
const { generateError } = require("../services/generateError");

// Middleware ↓

const userExists = async (req, res, next) => {
  let connection;
  try {
    const { id } = req.params;
    const { email, user } = req.body;

    connection = await getConnection();

    if (id) {
      // Check that no other user exists with that mail
      const [userIdExists] = await connection.query(
        `SELECT id FROM users WHERE id = ?`,
        [id]
      );

      if (userIdExists.length === 0) {
        throw generateError("No existe un usuario con esa id.", 404);
      }
    }

    // Check that no other user exists with that mail
    const [userEmailExists] = await connection.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (userEmailExists.length > 0) {
      throw generateError(
        "Ya existe un usuario registrado con el mismo email",
        409
      );
    }

    // Check that no other user exists with that mail
    const [userNameExists] = await connection.query(
      `SELECT id FROM users WHERE user = ?`,
      [user]
    );

    if (userNameExists.length > 0) {
      throw generateError(
        "Ya existe un usuario registrado con el mismo user name",
        409
      );
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = userExists;
