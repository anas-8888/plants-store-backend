CREATE TABLE `order` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location TEXT NOT NULL,
    items JSON NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    customerId INT NOT NULL,
    paymentId INT NOT NULL,
    CONSTRAINT fk_customer FOREIGN KEY (customerId) REFERENCES customer(id) ON DELETE CASCADE,
    CONSTRAINT fk_payment FOREIGN KEY (paymentId) REFERENCES payment(id) ON DELETE CASCADE
);
