const pool = require("../config/db");

// Save Plant
async function savePlant(plantData) {
  const connection = await pool.getConnection();
  try {
    const {
      plant_name_EN,
      plant_name_AR,
      description_EN,
      description_AR,
      price,
      pot_EN,
      pot_AR,
      quantity,
      water_EN,
      water_AR,
      light_EN,
      light_AR,
      temperatures_EN,
      temperatures_AR,
      easy_EN,
      easy_AR,
      part_sun_EN,
      part_sun_AR,
      medium_EN,
      medium_AR,
      newest,
      recommended,
      subcategory_id,
    } = plantData;

    const query = `
      INSERT INTO plant (
        plant_name_EN, plant_name_AR, description_EN, description_AR, price,
        pot_EN, pot_AR, quantity, water_EN, water_AR, light_EN, light_AR,
        temperatures_EN, temperatures_AR, easy_EN, easy_AR, part_sun_EN,
        part_sun_AR, medium_EN, medium_AR, newest, recommended, subcategory_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const [result] = await connection.execute(query, [
      plant_name_EN,
      plant_name_AR,
      description_EN,
      description_AR,
      price,
      pot_EN,
      pot_AR,
      quantity,
      water_EN,
      water_AR,
      light_EN,
      light_AR,
      temperatures_EN,
      temperatures_AR,
      easy_EN,
      easy_AR,
      part_sun_EN,
      part_sun_AR,
      medium_EN,
      medium_AR,
      newest,
      recommended,
      subcategory_id,
    ]);

    return result;
  } catch (error) {
    console.error("Error creating plant:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Find All Plants with Photos
async function findAllPlantsWithPhotos() {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.*, 
        pp.photoPath 
      FROM 
        plant p
      LEFT JOIN 
        plant_photo pp 
      ON 
        p.id = pp.plant_id
    `;
    const [rows] = await connection.execute(query);

    const plantsMap = new Map();

    rows.forEach((row) => {
      const {
        id,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price,
        pot_EN,
        pot_AR,
        quantity,
        water_EN,
        water_AR,
        light_EN,
        light_AR,
        temperatures_EN,
        temperatures_AR,
        easy_EN,
        easy_AR,
        part_sun_EN,
        part_sun_AR,
        medium_EN,
        medium_AR,
        newest,
        recommended,
        subcategory_id,
        photoPath,
      } = row;

      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price,
          pot_EN,
          pot_AR,
          quantity,
          water_EN,
          water_AR,
          light_EN,
          light_AR,
          temperatures_EN,
          temperatures_AR,
          easy_EN,
          easy_AR,
          part_sun_EN,
          part_sun_AR,
          medium_EN,
          medium_AR,
          newest,
          recommended,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push(photoPath);
      }
    });

    return Array.from(plantsMap.values());
  } catch (error) {
    console.error("Error finding plants with photos:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Find Plant By Id
async function findPlantById(plantId) {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT 
        p.*, 
        pp.photoPath 
      FROM 
        plant p
      LEFT JOIN 
        plant_photo pp 
      ON 
        p.id = pp.plant_id
      WHERE p.id = ?`;
    const [rows] = await connection.execute(query, [plantId]);

    const plantsMap = new Map();

    rows.forEach((row) => {
      const {
        id,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price,
        pot_EN,
        pot_AR,
        quantity,
        water_EN,
        water_AR,
        light_EN,
        light_AR,
        temperatures_EN,
        temperatures_AR,
        easy_EN,
        easy_AR,
        part_sun_EN,
        part_sun_AR,
        medium_EN,
        medium_AR,
        newest,
        recommended,
        subcategory_id,
        photoPath,
      } = row;

      // Initialize plant entry in the map if not already present
      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price,
          pot_EN,
          pot_AR,
          quantity,
          water_EN,
          water_AR,
          light_EN,
          light_AR,
          temperatures_EN,
          temperatures_AR,
          easy_EN,
          easy_AR,
          part_sun_EN,
          part_sun_AR,
          medium_EN,
          medium_AR,
          newest,
          recommended,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push(photoPath);
      }
    });

    return Array.from(plantsMap.values());
  } catch (error) {
    console.error("Error finding plant by ID:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Find Plants By Subcategory
async function findPlantsBySubcategory(subcategoryId) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.*, 
        pp.photoPath 
      FROM 
        plant p
      LEFT JOIN 
        plant_photo pp 
      ON 
        p.id = pp.plant_id
      WHERE 
        p.subcategory_id = ?
    `;
    const [rows] = await connection.execute(query, [subcategoryId]);

    const plantsMap = new Map();

    rows.forEach((row) => {
      const {
        id,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price,
        pot_EN,
        pot_AR,
        quantity,
        water_EN,
        water_AR,
        light_EN,
        light_AR,
        temperatures_EN,
        temperatures_AR,
        easy_EN,
        easy_AR,
        part_sun_EN,
        part_sun_AR,
        medium_EN,
        medium_AR,
        newest,
        recommended,
        subcategory_id,
        photoPath,
      } = row;

      // Initialize plant entry in the map if not already present
      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price,
          pot_EN,
          pot_AR,
          quantity,
          water_EN,
          water_AR,
          light_EN,
          light_AR,
          temperatures_EN,
          temperatures_AR,
          easy_EN,
          easy_AR,
          part_sun_EN,
          part_sun_AR,
          medium_EN,
          medium_AR,
          newest,
          recommended,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push(photoPath);
      }
    });

    return Array.from(plantsMap.values());
  } catch (error) {
    console.error("Error fetching plants by subcategory:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Update Plant
async function updatePlant(plantData) {
  const connection = await pool.getConnection();
  try {
    const {
      id,
      plant_name_EN,
      plant_name_AR,
      description_EN,
      description_AR,
      price,
      pot_EN,
      pot_AR,
      quantity,
      water_EN,
      water_AR,
      light_EN,
      light_AR,
      temperatures_EN,
      temperatures_AR,
      easy_EN,
      easy_AR,
      part_sun_EN,
      part_sun_AR,
      medium_EN,
      medium_AR,
      newest,
      recommended,
      subcategory_id,
    } = plantData;

    const query = `
      UPDATE plant
      SET plant_name_EN = ?, plant_name_AR = ?, description_EN = ?, description_AR = ?,
          price = ?, pot_EN = ?, pot_AR = ?, quantity = ?, water_EN = ?, water_AR = ?, 
          light_EN = ?, light_AR = ?, temperatures_EN = ?, temperatures_AR = ?, 
          easy_EN = ?, easy_AR = ?, part_sun_EN = ?, part_sun_AR = ?, 
          medium_EN = ?, medium_AR = ?, newest = ?, recommended = ?, 
          subcategory_id = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [
      plant_name_EN,
      plant_name_AR,
      description_EN,
      description_AR,
      price,
      pot_EN,
      pot_AR,
      quantity,
      water_EN,
      water_AR,
      light_EN,
      light_AR,
      temperatures_EN,
      temperatures_AR,
      easy_EN,
      easy_AR,
      part_sun_EN,
      part_sun_AR,
      medium_EN,
      medium_AR,
      newest,
      recommended,
      subcategory_id,
      id,
    ]);

    return {
      success: result.affectedRows > 0,
      message: "Plant updated successfully",
    };
  } catch (error) {
    console.error("Error updating plant:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Delete Plant
async function deletePlant(plantId) {
  const connection = await pool.getConnection();
  try {
    const query = `DELETE FROM plant WHERE id = ?`;
    await connection.execute(query, [plantId]);
  } catch (error) {
    console.error("Error deleting plant:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function getPlantPrice(id) {
  const connection = await pool.getConnection();
  try {
    const query = `SELECT price FROM plant WHERE id = ?`;
    const [rows] = await connection.execute(query, [id]);

    if(rows.length === 0) {
      return -1;
    }

    return rows[0].price;
  } catch (error) {
    console.error("Error finding plant by ID:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  savePlant,
  findAllPlantsWithPhotos,
  findPlantById,
  findPlantsBySubcategory,
  updatePlant,
  deletePlant,
  getPlantPrice
};
