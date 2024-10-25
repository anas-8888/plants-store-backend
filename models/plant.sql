CREATE TABLE plant (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plant_name_EN VARCHAR(100) NOT NULL,
  plant_name_AR VARCHAR(100) NOT NULL,
  description_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  description_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  price DECIMAL(10, 2) NOT NULL,
  newest BOOLEAN NOT NULL DEFAULT 1,
  recommended BOOLEAN NOT NULL DEFAULT 1,
  pot_EN VARCHAR(50) NOT NULL,
  pot_AR VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  water_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  water_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  light_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  light_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  toxicity_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  toxicity_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  humidity_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  humidity_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  problems_pests_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  problems_pests_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  fertilizing_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  fertilizing_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  temperatures_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  temperatures_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  soil_repotting_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  soil_repotting_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  learn_more_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  learn_more_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  characteristics_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  characteristics_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  easy_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  easy_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  part_sun_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  part_sun_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  midium_EN VARCHAR(255) NOT NULL DEFAULT 'no info',
  midium_AR VARCHAR(255) NOT NULL DEFAULT 'لا يوجد معلومات',
  subcategory_id INT NOT NULL,
  FOREIGN KEY (subcategory_id) REFERENCES subcategory(id) ON DELETE CASCADE
);
