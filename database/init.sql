CREATE DATABASE IF NOT EXISTS mydatabase;
USE mydatabase;

CREATE TABLE IF NOT EXISTS `games`(
    `idgames` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `cost` VARCHAR(255) NOT NULL,
    `category` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO games (
  `name`, `cost`, `category`
) VALUES
  ('Game 1', '10', 'Action game'),
  ('Game 2', '15', 'Horror game'),
  ('Game 3', '20', 'Simulation video game');
