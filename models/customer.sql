CREATE TABLE customer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(20) NOT NULL,
  lastName VARCHAR(20) NOT NULL,
  email VARCHAR(50) NULL DEFAULT 'No email',
  thumbnail VARCHAR(255) NULL,
  googleId VARCHAR(100) NULL DEFAULT 'No google id',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
