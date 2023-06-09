// Function require ↓

const { getConnection } = require("../connectionDB");

// Query ↓

const patchFavoriteQuery = async (offer_id, user_id) => {
  let connection;

  try {
    const connection = await getConnection();

    const [favorites] = await connection.query(
      `
                  SELECT *
                  FROM favorites
                  WHERE user_id = ? AND offer_id = ?
                `,
      [user_id, offer_id]
    );

    if (favorites.length > 0) {
      const [favorite] = await connection.query(
        `
            SELECT favorite
            FROM favorites
            WHERE user_id = ? AND offer_id = ?
            `,
        [user_id, offer_id]
      );

      // Set favorite depending on favorite is true or false

      const isFavorite = favorite[0].favorite;

      if (isFavorite === 1) {
        await connection.query(
          `
            UPDATE favorites
            SET favorite = 0
            WHERE user_id = ? AND offer_id = ?
            `,
          [user_id, offer_id]
        );
      } else if (isFavorite === 0) {
        await connection.query(
          `
            UPDATE favorites
            SET favorite = 1
            WHERE user_id = ? AND offer_id = ?
            `,
          [user_id, offer_id]
        );
      }
    } else {
      // If the user never gave to favorite, insert a new value

      await connection.query(
        `
              INSERT INTO favorites (user_id, offer_id, favorite)
              VALUES (?, ?, 1);
              `,
        [user_id, offer_id]
      );
    }
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { patchFavoriteQuery };
