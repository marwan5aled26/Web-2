-- Run SQL Query in New DB
CREATE DATABASE movie_app;

-- Run SQL Query in movie_app DB
CREATE TABLE movies (
  id int(11) PRIMARY KEY AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  year year(4) DEFAULT NULL,
  rating float DEFAULT NULL,
  note text DEFAULT NULL,
  poster varchar(255) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
)
