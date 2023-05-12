// Functions requires ↓

const { getConnection } = require("../connectionDB");
const { generateError } = require("../../services/generateError");

// Query ↓

const getOfferById = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    const [offer] = await connection.query(
      `
        SELECT * FROM offers WHERE id = ?
      `,
      [id]
    );

    if (offer.length === 0) {
      throw generateError(`No se han encontrado ofertas`, 404);
    }
    console.log(offer);
    return offer[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getOfferById };
