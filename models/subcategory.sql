CREATE TABLE subcategory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subcategory_name VARCHAR(100) NOT NULL,
  category_id INT NOT NULL,
  photoPath VARCHAR(255),
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);
