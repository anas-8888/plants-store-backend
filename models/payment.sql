CREATE TABLE payment (
    id INT AUTO_INCREMENT PRIMARY KEY,                                        -- Unique payment ID
    provider VARCHAR(50) NOT NULL,                                            -- Payment provider name (e.g., MontyPay)
    status ENUM('pending', 'completed', 'failed') NOT NULL,                   -- Payment status (e.g., pending, completed, failed)
    amount DECIMAL(10, 2) NOT NULL,                                           -- Amount paid
    currency VARCHAR(10) NOT NULL,                                            -- Currency code (e.g., USD, EUR)
    paymentMethod VARCHAR(50) NOT NULL,                                       -- Payment method (e.g., card, bank transfer)
    transactionId VARCHAR(100),                                               -- Transaction ID from MontyPay or provider
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                            -- Timestamp of payment initiation
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Last update timestamp
);
