const pool = require("../config/db");

const createLogo = async (photoPath) => {
  const query = "INSERT INTO logo (photoPath) VALUES (?)";
  const [result] = await pool.execute(query, [photoPath]);
  return { id: result.insertId, photoPath };
};

const findAllLogos = async () => {
  const query = "SELECT * FROM logo";
  const [rows] = await pool.execute(query);
  return rows;
};

const findLogoById = async (id) => {
  const query = "SELECT * FROM logo WHERE id = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

const findAcctiveLogo = async () => {
  const query = "SELECT * FROM logo WHERE is_active = 1 LIMIT 1";
  const [rows] = await pool.execute(query);
  return rows[0];
};

const updateLogoAcctive = async (id) => {
  // Set all other logos as inactive
  const deactivateQuery = "UPDATE logo SET is_active = 0";
  await pool.execute(deactivateQuery);

  // Activate the specific logo
  const activateQuery = "UPDATE logo SET is_active = 1 WHERE id = ?";
  const [result] = await pool.execute(activateQuery, [id]);
  return result.affectedRows > 0;
};

const deleteLogo = async (id) => {
  const query = "DELETE FROM logo WHERE id = ?";
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createLogo,
  findAllLogos,
  findLogoById,
  findAcctiveLogo,
  updateLogoAcctive,
  deleteLogo,
};
