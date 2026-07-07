-- Migration: create pariwisata reviews table

CREATE TABLE IF NOT EXISTS pariwisata_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pariwisata_id INT NOT NULL,
  user_id INT,
  union_id VARCHAR(255) NOT NULL,

  rating DECIMAL(3,2) NOT NULL,
  review TEXT NOT NULL,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_pariwisata_reviews_pariwisata
    FOREIGN KEY (pariwisata_id) REFERENCES pariwisata(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pariwisata_reviews_pariwisata_id
  ON pariwisata_reviews(pariwisata_id);

CREATE INDEX IF NOT EXISTS idx_pariwisata_reviews_union_id
  ON pariwisata_reviews(union_id);

