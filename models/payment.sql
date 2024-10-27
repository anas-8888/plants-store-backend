CREATE TABLE payment (
    id INT AUTO_INCREMENT PRIMARY KEY,                                        
    provider VARCHAR(50) NOT NULL,                                            
    status ENUM('pending', 'completed', 'failed') NOT NULL,                   
    amount DECIMAL(10, 2) NOT NULL,                                           
    currency VARCHAR(10) NOT NULL,                                            
    paymentMethod VARCHAR(50) NOT NULL,                                       
    transactionId VARCHAR(100),                                               
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                            
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);
