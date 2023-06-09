// Requires npm ↓

require("dotenv").config();
const chalk = require("chalk");

// Requires ↓

const { getConnection } = require("./connectionDB");

// Database config ↓

async function createDB() {
  let connection;

  try {
    connection = await getConnection();

    console.log(chalk.blue("Borrando tablas existentes"));

    await connection.query(`DROP TABLE IF EXISTS likes`);
    await connection.query(`DROP TABLE IF EXISTS votes`);
    await connection.query(`DROP TABLE IF EXISTS comments`);
    await connection.query(`DROP TABLE IF EXISTS favorites`);
    await connection.query(`DROP TABLE IF EXISTS offers`);
    await connection.query(`DROP TABLE IF EXISTS users`);

    console.log(chalk.blue("Creando tablas"));

    await connection.query(`
     CREATE TABLE users (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        user VARCHAR(100) UNIQUE NOT NULL,
        avatar VARCHAR(250),
        role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
        deleted BOOLEAN DEFAULT false,
        lastAuthUpdate DATETIME,
        active BOOLEAN DEFAULT false,
        regCode CHAR(36),
        recoverCode CHAR(36),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
     )`);

    await connection.query(`
     CREATE TABLE offers (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER UNSIGNED NOT NULL,
        url VARCHAR(280) NOT NULL,
        title VARCHAR(60) NOT NULL,
        descrip VARCHAR(280),
        price decimal(10,2),
        offer_price decimal(10,2),
        plataform ENUM("Playstation-5", "Playstation-4", "Xbox-One", "Xbox-Series", "Nintendo-Switch", "PC-Gaming"),
        offer_expiry date,
        photo VARCHAR(250),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE (user_id, url)
     )`);

    await connection.query(`
    CREATE TABLE favorites (
      user_id INTEGER UNSIGNED NOT NULL,
      offer_id INT UNSIGNED NOT NULL,
      favorite BOOLEAN,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (offer_id) REFERENCES offers(id)
    )`);

    await connection.query(`
    CREATE TABLE comments (
       id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       comment VARCHAR(280),
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
       user_id INT UNSIGNED NOT NULL,
       FOREIGN KEY (user_id) REFERENCES users(id),
       offer_id INT UNSIGNED NOT NULL,
       FOREIGN KEY (offer_id) REFERENCES offers(id)
   )`);

    await connection.query(`
     CREATE TABLE votes (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        dateVote DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        vote TINYINT CHECK (vote IN (1,2,3,4,5)),
        user_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        offer_id INT UNSIGNED,
        FOREIGN KEY (offer_id) REFERENCES offers(id),
        UNIQUE (user_id, offer_id)
    )`);

    await connection.query(`
    CREATE TABLE likes (
       id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
       dateLike DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
       like_ BOOLEAN DEFAULT TRUE,
       user_id INT UNSIGNED NOT NULL,
       FOREIGN KEY (user_id) REFERENCES users(id),
       comment_id INT UNSIGNED,
       FOREIGN KEY (comment_id) REFERENCES comments(id),
       UNIQUE (user_id, comment_id)
   )`);

    console.log(chalk.yellow("Base de datos creada"));
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

createDB();
