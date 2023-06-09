// Requires ↓

const { generateError } = require("../../services/generateError");
const { getConnection } = require("../connectionDB");

// Controller ↓

const postVoteQuery = async (offerId, userId, vote) => {
  let connection;
  try {
    connection = await getConnection();

    // Check the user_id of the offer
    const [offer] = await connection.query(
      `
      SELECT user_id
      FROM offers
      WHERE id = ?
    `,
      [offerId]
    );

    // User cannot vote for their own offer
    if (offer[0].user_id === userId) {
      throw generateError("No puedes votar tu propia oferta", 403);
    }

    // Check if the user has already voted this offer
    const [existsVote] = await connection.query(
      `
        SELECT id
        FROM votes
        WHERE user_id = ? AND offer_id = ?
      `,
      [userId, offerId]
    );

    // User cannot vote the same offer multiple times
    if (existsVote.length > 0) {
      throw generateError("Ya has votado esta oferta", 403);
    } else {
      // Insert vote
      await connection.query(
        `
            INSERT INTO votes (vote, user_id, offer_id)
            VALUES (?, ?, ?)
          `,
        [vote, userId, offerId]
      );
    }
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { postVoteQuery };
