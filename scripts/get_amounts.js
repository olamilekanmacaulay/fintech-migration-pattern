const { Sequelize } = require('sequelize');
const config = require('../config/config')['development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false
});

async function fetchAmounts() {
  try {

    // Simple raw query to get exactly what's in the DB
    const [results] = await sequelize.query(
      'SELECT id, description, amount FROM "Transactions" ORDER BY id ASC'
    );

    // Display as a neat table
    console.table(results);

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await sequelize.close();
  }
}

fetchAmounts();