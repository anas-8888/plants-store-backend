const db = require("../config/db");

async function savePlant(plantData) {
  const query = `
    INSERT INTO plant (plant_name, description, price, pot, quantity, water, light, toxicity, humidity, problems_pests, fertilizing, temperatures, soil_repotting, learn_more, characteristics, subcategory_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const result = await db.execute(query, [
      plantData.plant_name,
      plantData.description,
      plantData.price,
      plantData.pot,
      plantData.quantity,
      plantData.water,
      plantData.light,
      plantData.toxicity,
      plantData.humidity,
      plantData.problems_pests,
      plantData.fertilizing,
      plantData.temperatures,
      plantData.soil_repotting,
      plantData.learn_more,
      plantData.characteristics,
      plantData.subcategory_id,
    ]);
    return result;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

async function savePlantPhotos(plantId, photos) {
  const query = `INSERT INTO plant_photo (plant_id, photo) VALUES (?, ?)`;
  for (const photo of photos) {
    await db.execute(query, [plantId, photo.path]);
  }
}

async function findAllPlants() {
  const query = `SELECT * FROM plant`;
  const [plants] = await db.execute(query);
  return plants;
}

async function findPlantById(id) {
  const query = `SELECT * FROM plant WHERE id = ?`;
  const [plants] = await db.execute(query, [id]);
  return plants[0];
}

async function findPlantsBySubcategory(subcategoryId) {
  try {
    const [plants] = await db.query(
      'SELECT * FROM plant WHERE subcategory_id = ?',
      [subcategoryId]
    );

    return plants;
  } catch (error) {
    console.error('Error fetching plants by subcategory:', error);
    throw error;
  }
}

async function findPlantPhotosById(plantId) {
  const query = `SELECT * FROM plant_photo WHERE plant_id = ?`;
  const [photos] = await db.execute(query, [plantId]);
  return photos;
}

async function findPlantPhotoById(photoId) {
  const query = `SELECT * FROM plant_photo WHERE id = ?`;
  const [photos] = await db.execute(query, [photoId]);
  return photos[0];
}

async function updatePlant(id, plantData) {
  let query = `
    UPDATE plant
    SET plant_name = ?, description = ?, price = ?, pot = ?, quantity = ?, subcategory_id = ?,
        water = ?, light = ?, toxicity = ?, humidity = ?, problems_pests = ?, fertilizing = ?,
        temperatures = ?, soil_repotting = ?, learn_more = ?, characteristics = ?
    WHERE id = ?
  `;
  const result = await db.execute(query, [
    plantData.plant_name,
    plantData.description,
    plantData.price,
    plantData.pot,
    plantData.quantity,
    plantData.subcategory_id,
    plantData.water,
    plantData.light,
    plantData.toxicity,
    plantData.humidity,
    plantData.problems_pests,
    plantData.fertilizing,
    plantData.temperatures,
    plantData.soil_repotting,
    plantData.learn_more,
    plantData.characteristics,
    id,
  ]);
  return { success: result[0].affectedRows > 0, message: "Plant updated successfully" };
}

async function deletePlant(id) {
  const query = `DELETE FROM plant WHERE id = ?`;
  await db.execute(query, [id]);
}

async function deletePlantPhotos(plantId) {
  const query = `DELETE FROM plant_photo WHERE plant_id = ?`;
  await db.execute(query, [plantId]);
}

async function deletePlantPhoto(photoId) {
  const query = `DELETE FROM plant_photo WHERE id = ?`;
  await db.execute(query, [photoId]);
}

module.exports = {
  savePlant,
  savePlantPhotos,
  findAllPlants,
  findPlantById,
  findPlantPhotosById,
  findPlantPhotoById,
  findPlantsBySubcategory,
  updatePlant,
  deletePlant,
  deletePlantPhotos,
  deletePlantPhoto,
};
