CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cartId INT NOT NULL,
    plantId INT NOT NULL,
    quantity INT NOT NULL,
    details VARCHAR(255) NOT NULL DEFAULT 'no details',
    CONSTRAINT fk_cart FOREIGN KEY (cartId) REFERENCES cart(id) ON DELETE CASCADE,
    CONSTRAINT fk_plant FOREIGN KEY (plantId) REFERENCES plant(id) ON DELETE CASCADE
);
