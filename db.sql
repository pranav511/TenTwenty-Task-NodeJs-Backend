CREATE DATABASE tentwenty;

USE tentwenty;

-- 1️⃣ USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','vip','user','guest') DEFAULT 'guest',
    total_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2️⃣ CONTESTS
CREATE TABLE contests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    access_level ENUM('normal','vip') DEFAULT 'normal',
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    prize VARCHAR(255),
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contest_id INT NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('single','multi','truefalse') DEFAULT 'single',
  options JSON NOT NULL,
  correct_option JSON NOT NULL,
  points INT DEFAULT 10,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE
);

-- USER_ANSWERS
CREATE TABLE user_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  contest_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_option_ids JSON NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_answer (user_id, contest_id, question_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- LEADERBOARD
CREATE TABLE leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  contest_id INT NOT NULL,
  score INT DEFAULT 0,
  rank_position INT DEFAULT NULL,
  UNIQUE KEY unique_user_contest (user_id, contest_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE
);

-- USER_HISTORY
CREATE TABLE user_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  contest_id INT NOT NULL,
  prize_won VARCHAR(50),
  status ENUM('in_progress','completed') DEFAULT 'in_progress',
  UNIQUE KEY unique_history (user_id, contest_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE
);

