const db = require("../config/db");

async function savePlant(plantData) {
  const query = `
    INSERT INTO plant (
      plant_name_EN, plant_name_AR, description_EN, description_AR, price, 
      pot_EN, pot_AR, quantity, water_EN, water_AR, light_EN, light_AR, 
      toxicity_EN, toxicity_AR, humidity_EN, humidity_AR, problems_pests_EN, 
      problems_pests_AR, fertilizing_EN, fertilizing_AR, temperatures_EN, 
      temperatures_AR, soil_repotting_EN, soil_repotting_AR, learn_more_EN, 
      learn_more_AR, characteristics_EN, characteristics_AR, easy_EN, easy_AR, 
      part_sun_EN, part_sun_AR, midium_EN, midium_AR, newest, recommended, subcategory_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  try {
    const result = await db.execute(query, [
      plantData.plant_name_EN,
      plantData.plant_name_AR,
      plantData.description_EN,
      plantData.description_AR,
      plantData.price,
      plantData.pot_EN,
      plantData.pot_AR,
      plantData.quantity,
      plantData.water_EN,
      plantData.water_AR,
      plantData.light_EN,
      plantData.light_AR,
      plantData.toxicity_EN,
      plantData.toxicity_AR,
      plantData.humidity_EN,
      plantData.humidity_AR,
      plantData.problems_pests_EN,
      plantData.problems_pests_AR,
      plantData.fertilizing_EN,
      plantData.fertilizing_AR,
      plantData.temperatures_EN,
      plantData.temperatures_AR,
      plantData.soil_repotting_EN,
      plantData.soil_repotting_AR,
      plantData.learn_more_EN,
      plantData.learn_more_AR,
      plantData.characteristics_EN,
      plantData.characteristics_AR,
      plantData.easy_EN,
      plantData.easy_AR,
      plantData.part_sun_EN,
      plantData.part_sun_AR,
      plantData.midium_EN,
      plantData.midium_AR,
      plantData.newest,
      plantData.recommended,
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
    SET plant_name_EN = ?, plant_name_AR = ?, description_EN = ?, description_AR = ?, 
        price = ?, newest = ?, recommended = ?, pot_EN = ?, pot_AR = ?, 
        quantity = ?, water_EN = ?, water_AR = ?, light_EN = ?, light_AR = ?, 
        toxicity_EN = ?, toxicity_AR = ?, humidity_EN = ?, humidity_AR = ?, 
        problems_pests_EN = ?, problems_pests_AR = ?, fertilizing_EN = ?, 
        fertilizing_AR = ?, temperatures_EN = ?, temperatures_AR = ?, 
        soil_repotting_EN = ?, soil_repotting_AR = ?, learn_more_EN = ?, 
        learn_more_AR = ?, characteristics_EN = ?, characteristics_AR = ?, 
        easy_EN = ?, easy_AR = ?, part_sun_EN = ?, part_sun_AR = ?, 
        midium_EN = ?, midium_AR = ?, subcategory_id = ?
    WHERE id = ?
  `;

  const result = await db.execute(query, [
    plantData.plant_name_EN,
    plantData.plant_name_AR,
    plantData.description_EN,
    plantData.description_AR,
    plantData.price,
    plantData.newest,
    plantData.recommended,
    plantData.pot_EN,
    plantData.pot_AR,
    plantData.quantity,
    plantData.water_EN,
    plantData.water_AR,
    plantData.light_EN,
    plantData.light_AR,
    plantData.toxicity_EN,
    plantData.toxicity_AR,
    plantData.humidity_EN,
    plantData.humidity_AR,
    plantData.problems_pests_EN,
    plantData.problems_pests_AR,
    plantData.fertilizing_EN,
    plantData.fertilizing_AR,
    plantData.temperatures_EN,
    plantData.temperatures_AR,
    plantData.soil_repotting_EN,
    plantData.soil_repotting_AR,
    plantData.learn_more_EN,
    plantData.learn_more_AR,
    plantData.characteristics_EN,
    plantData.characteristics_AR,
    plantData.easy_EN,
    plantData.easy_AR,
    plantData.part_sun_EN,
    plantData.part_sun_AR,
    plantData.midium_EN,
    plantData.midium_AR,
    plantData.subcategory_id,
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
