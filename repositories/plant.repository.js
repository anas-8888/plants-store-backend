const pool = require("../config/db");

// Save Plant
async function savePlant(plantData) {
  const connection = await pool.getConnection();
  try {
    const {
      plant_name_EN,
      plant_name_AR,
      description_EN = 'no info',
      description_AR = 'لا يوجد معلومات',
      price1 = -1.00,
      price2 = -1.00,
      price3 = -1.00,
      price4 = -1.00,
      pot_EN = 'no info',
      pot_AR = 'لا يوجد معلومات',
      quantity,
      water_EN = 'no info',
      water_AR = 'لا يوجد معلومات',
      light_EN = 'no info',
      light_AR = 'لا يوجد معلومات',
      temperatures_EN = 'no info',
      temperatures_AR = 'لا يوجد معلومات',
      easy_EN = 'no info',
      easy_AR = 'لا يوجد معلومات',
      part_sun_EN = 'no info',
      part_sun_AR = 'لا يوجد معلومات',
      medium_EN = 'no info',
      medium_AR = 'لا يوجد معلومات',
      size1_EN = 'no info',
      size1_AR = 'لا يوجد معلومات',
      size2_EN = 'no info',
      size2_AR = 'لا يوجد معلومات',
      size3_EN = 'no info',
      size3_AR = 'لا يوجد معلومات',
      size4_EN = 'no info',
      size4_AR = 'لا يوجد معلومات',
      newest = 1,
      recommended = 1,
      category_id,
      subcategory_id = null,
      is_active = 1
    } = plantData;

    const query = `
      INSERT INTO plant (
        plant_name_EN, plant_name_AR, description_EN, description_AR, price1, price2, price3, price4,
        pot_EN, pot_AR, quantity, water_EN, water_AR, light_EN, light_AR,
        temperatures_EN, temperatures_AR, easy_EN, easy_AR, part_sun_EN,
        part_sun_AR, medium_EN, medium_AR, size1_EN, size1_AR, size2_EN, size2_AR,
        size3_EN, size3_AR, size4_EN, size4_AR, newest, recommended, category_id, subcategory_id, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const [result] = await connection.execute(query, [
      plant_name_EN,
      plant_name_AR,
      description_EN,
      description_AR,
      price1,
      price2,
      price3,
      price4,
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
      size1_EN,
      size1_AR,
      size2_EN,
      size2_AR,
      size3_EN,
      size3_AR,
      size4_EN,
      size4_AR,
      newest,
      recommended,
      category_id,
      subcategory_id,
      is_active
    ]);

    return result;
  } catch (error) {
    console.error("Error creating plant:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Find All active Plants with Photos
async function findAllActivePlantsWithPhotos() {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.*, 
        pp.id photo_id,
        pp.photoPath 
      FROM 
        plant p
      LEFT JOIN 
        plant_photo pp 
      ON 
        p.id = pp.plant_id
      WHERE
      p.is_active = 1
    `;
    const [rows] = await connection.execute(query);

    const plantsMap = new Map();

    rows.forEach((row) => {
      const {
        id,
        is_active,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price1,
        price2,
        price3,
        price4,
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
        size1_EN,
        size1_AR,
        size2_EN,
        size2_AR,
        size3_EN,
        size3_AR,
        size4_EN,
        size4_AR,
        newest,
        recommended,
        category_id,
        subcategory_id,
        photo_id,
        photoPath,
      } = row;

      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          is_active,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price1,
          price2,
          price3,
          price4,
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
          size1_EN,
          size1_AR,
          size2_EN,
          size2_AR,
          size3_EN,
          size3_AR,
          size4_EN,
          size4_AR,
          newest,
          recommended,
          category_id,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push({
          photo_id,
          photoPath
        });
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

// Find All  Plants with Photos
async function findAllPlantsWithPhotos() {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.*, 
        pp.id photo_id,
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
        is_active,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price1,
        price2,
        price3,
        price4,
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
        size1_EN,
        size1_AR,
        size2_EN,
        size2_AR,
        size3_EN,
        size3_AR,
        size4_EN,
        size4_AR,
        newest,
        recommended,
        category_id,
        subcategory_id,
        photo_id,
        photoPath,
      } = row;

      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          is_active,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price1,
          price2,
          price3,
          price4,
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
          size1_EN,
          size1_AR,
          size2_EN,
          size2_AR,
          size3_EN,
          size3_AR,
          size4_EN,
          size4_AR,
          newest,
          recommended,
          category_id,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push({
          photo_id,
          photoPath
        });
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

// Find active Plant By Id
async function findActivePlantById(plantId) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.*, 
        pp.id photo_id,
        pp.photoPath 
      FROM 
        plant p
      LEFT JOIN 
        plant_photo pp 
      ON 
        p.id = pp.plant_id
      WHERE p.id = ? AND p.is_active = 1`;
    const [rows] = await connection.execute(query, [plantId]);

    const plantsMap = new Map();

    rows.forEach((row) => {
      const {
        id,
        is_active,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price1,
        price2,
        price3,
        price4,
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
        size1_EN,
        size1_AR,
        size2_EN,
        size2_AR,
        size3_EN,
        size3_AR,
        size4_EN,
        size4_AR,
        newest,
        recommended,
        category_id,
        subcategory_id,
        photo_id,
        photoPath,
      } = row;

      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          is_active,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price1,
          price2,
          price3,
          price4,
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
          size1_EN,
          size1_AR,
          size2_EN,
          size2_AR,
          size3_EN,
          size3_AR,
          size4_EN,
          size4_AR,
          newest,
          recommended,
          category_id,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push({
          photo_id,
          photoPath
        });
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

// Find Plant By Id
async function findPlantById(plantId) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.*, 
        pp.id photo_id,
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
        is_active,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price1,
        price2,
        price3,
        price4,
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
        size1_EN,
        size1_AR,
        size2_EN,
        size2_AR,
        size3_EN,
        size3_AR,
        size4_EN,
        size4_AR,
        newest,
        recommended,
        category_id,
        subcategory_id,
        photo_id,
        photoPath,
      } = row;

      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          is_active,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price1,
          price2,
          price3,
          price4,
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
          size1_EN,
          size1_AR,
          size2_EN,
          size2_AR,
          size3_EN,
          size3_AR,
          size4_EN,
          size4_AR,
          newest,
          recommended,
          category_id,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push({
          photo_id,
          photoPath
        });
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

// Find Plant By Name
async function findPlantByName(plantName) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.*, 
        pp.id photo_id,
        pp.photoPath 
      FROM 
        plant p
      LEFT JOIN 
        plant_photo pp 
      ON 
        p.id = pp.plant_id
      WHERE 
        (p.plant_name_EN LIKE ? AND p.is_active = 1)
        OR (p.plant_name_AR LIKE ? AND p.is_active = 1)`;
    const [rows] = await connection.execute(query, [`%${plantName}%`, `%${plantName}%`]);

    const plantsMap = new Map();

    rows.forEach((row) => {
      const {
        id,
        is_active,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price1,
        price2,
        price3,
        price4,
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
        size1_EN,
        size1_AR,
        size2_EN,
        size2_AR,
        size3_EN,
        size3_AR,
        size4_EN,
        size4_AR,
        newest,
        recommended,
        category_id,
        subcategory_id,
        photo_id,
        photoPath,
      } = row;

      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          is_active,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price1,
          price2,
          price3,
          price4,
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
          size1_EN,
          size1_AR,
          size2_EN,
          size2_AR,
          size3_EN,
          size3_AR,
          size4_EN,
          size4_AR,
          newest,
          recommended,
          category_id,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push({
          photo_id,
          photoPath
        });
      }
    });

    return Array.from(plantsMap.values());
  } catch (error) {
    console.error("Error fetching plants by name:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// Find Plants By Category
async function findPlantsByCategory(categoryId) {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.*, 
        pp.id photo_id,
        pp.photoPath 
      FROM 
        plant p
      LEFT JOIN 
        plant_photo pp 
      ON 
        p.id = pp.plant_id
      WHERE 
        p.category_id = ? AND p.is_active = 1`;
    const [rows] = await connection.execute(query, [categoryId]);

    const plantsMap = new Map();

    rows.forEach((row) => {
      const {
        id,
        is_active,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price1,
        price2,
        price3,
        price4,
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
        size1_EN,
        size1_AR,
        size2_EN,
        size2_AR,
        size3_EN,
        size3_AR,
        size4_EN,
        size4_AR,
        newest,
        recommended,
        category_id,
        subcategory_id,
        photo_id,
        photoPath,
      } = row;

      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          is_active,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price1,
          price2,
          price3,
          price4,
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
          size1_EN,
          size1_AR,
          size2_EN,
          size2_AR,
          size3_EN,
          size3_AR,
          size4_EN,
          size4_AR,
          newest,
          recommended,
          category_id,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push({
          photo_id,
          photoPath
        });
      }
    });

    return Array.from(plantsMap.values());
  } catch (error) {
    console.error("Error fetching plants by category:", error);
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
        pp.id photo_id,
        pp.photoPath 
      FROM 
        plant p
      LEFT JOIN 
        plant_photo pp 
      ON 
        p.id = pp.plant_id
      WHERE 
        p.subcategory_id = ? AND p.is_active = 1`;
    const [rows] = await connection.execute(query, [subcategoryId]);

    const plantsMap = new Map();

    rows.forEach((row) => {
      const {
        id,
        is_active,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price1,
        price2,
        price3,
        price4,
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
        size1_EN,
        size1_AR,
        size2_EN,
        size2_AR,
        size3_EN,
        size3_AR,
        size4_EN,
        size4_AR,
        newest,
        recommended,
        category_id,
        subcategory_id,
        photo_id,
        photoPath,
      } = row;

      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          is_active,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price1,
          price2,
          price3,
          price4,
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
          size1_EN,
          size1_AR,
          size2_EN,
          size2_AR,
          size3_EN,
          size3_AR,
          size4_EN,
          size4_AR,
          newest,
          recommended,
          category_id,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push({
          photo_id,
          photoPath
        });
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

// Find All Newest Plants
async function findAllNewestPlants() {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.*, 
        pp.id photo_id,
        pp.photoPath 
      FROM 
        plant p
      LEFT JOIN 
        plant_photo pp 
      ON 
        p.id = pp.plant_id
      WHERE 
        p.newest = 1 AND p.is_active = 1`;
    const [rows] = await connection.execute(query);

    const plantsMap = new Map();

    rows.forEach((row) => {
      const {
        id,
        is_active,
        plant_name_EN,
        plant_name_AR,
        description_EN,
        description_AR,
        price1,
        price2,
        price3,
        price4,
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
        size1_EN,
        size1_AR,
        size2_EN,
        size2_AR,
        size3_EN,
        size3_AR,
        size4_EN,
        size4_AR,
        newest,
        recommended,
        category_id,
        subcategory_id,
        photo_id,
        photoPath,
      } = row;

      if (!plantsMap.has(id)) {
        plantsMap.set(id, {
          id,
          is_active,
          plant_name_EN,
          plant_name_AR,
          description_EN,
          description_AR,
          price1,
          price2,
          price3,
          price4,
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
          size1_EN,
          size1_AR,
          size2_EN,
          size2_AR,
          size3_EN,
          size3_AR,
          size4_EN,
          size4_AR,
          newest,
          recommended,
          category_id,
          subcategory_id,
          photos: [],
        });
      }

      if (photoPath) {
        plantsMap.get(id).photos.push({
          photo_id,
          photoPath
        });
      }
    });

    return Array.from(plantsMap.values());
  } catch (error) {
    console.error("Error fetching newest plants:", error);
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
      is_active,
      plant_name_EN,
      plant_name_AR,
      description_EN,
      description_AR,
      price1,
      price2,
      price3,
      price4,
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
      size1_EN,
      size1_AR,
      size2_EN,
      size2_AR,
      size3_EN,
      size3_AR,
      size4_EN,
      size4_AR,
      newest,
      recommended,
      category_id,
      subcategory_id
    } = plantData;

    const query = `
      UPDATE plant
      SET is_active = ?,plant_name_EN = ?, plant_name_AR = ?, description_EN = ?, description_AR = ?,
          price1 = ?, price2 = ?, price3 = ?, price4 = ?, pot_EN = ?, pot_AR = ?, 
          quantity = ?, water_EN = ?, water_AR = ?, light_EN = ?, light_AR = ?, 
          temperatures_EN = ?, temperatures_AR = ?, easy_EN = ?, easy_AR = ?, 
          part_sun_EN = ?, part_sun_AR = ?, medium_EN = ?, medium_AR = ?, 
          size1_EN = ?, size1_AR = ?, size2_EN = ?, size2_AR = ?, 
          size3_EN = ?, size3_AR = ?, size4_EN = ?, size4_AR = ?, 
          newest = ?, recommended = ?, category_id = ?, subcategory_id = ?
      WHERE id = ?`;

    const [result] = await connection.execute(query, [
      is_active,
      plant_name_EN,
      plant_name_AR,
      description_EN,
      description_AR,
      price1,
      price2,
      price3,
      price4,
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
      size1_EN,
      size1_AR,
      size2_EN,
      size2_AR,
      size3_EN,
      size3_AR,
      size4_EN,
      size4_AR,
      newest,
      recommended,
      category_id,
      subcategory_id,
      id
    ]);

    return result;
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

// Get Plant Price
async function getPlantPrice(size, id) {
  const connection = await pool.getConnection();
  try {

    const query = 
    `SELECT price1, price2, price3, price4, size1_EN, size1_AR, size2_EN, size2_AR, size3_EN, size3_AR, size4_EN, size4_AR  
     FROM plant 
     WHERE id = ?
     AND is_active = 1`;
    const [rows] = await connection.execute(query, [id]);

    if (rows.length === 0) {
      return -1;
    }

    if(rows[0].size1_EN == size || rows[0].size1_AR == size) {
      return rows[0].price1;
    }
    else if(rows[0].size2_EN == size || rows[0].size2_AR == size) {
      return rows[0].price2;
    }
    else if(rows[0].size3_EN == size || rows[0].size3_AR == size) {
      return rows[0].price3;
    }
    else if(rows[0].size4_EN == size || rows[0].size4_AR == size) {
      return rows[0].price4;
    } else {
      return -1;
    }

  } catch (error) {
    console.error("Error finding plant by ID:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}


module.exports = {
  savePlant,
  findAllActivePlantsWithPhotos,
  findAllPlantsWithPhotos,
  findActivePlantById,
  findPlantById,
  findPlantByName,
  findPlantsByCategory,
  findPlantsBySubcategory,
  findAllNewestPlants,
  updatePlant,
  deletePlant,
  getPlantPrice
};
