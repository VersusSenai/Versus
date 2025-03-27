CREATE DATABASE IF NOT EXISTS pa;

USE pa;

CREATE TABLE
	IF NOT EXISTS user (
		id INT PRIMARY KEY AUTO_INCREMENT,
		username VARCHAR(100) NOT NULL,
		email VARCHAR(100) NOT NULL UNIQUE,
		password VARCHAR(255) NOT NULL,
		role ENUM ("P", "O") NOT NULL,
		registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

CREATE TABLE
	IF NOT EXISTS event (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		description VARCHAR(250),
		start_date DATE NOT NULL,
		end_date DATE NOT NULL,
		model ENUM ("P", "O") NOT NULL,
		status ENUM ("E", "S", "P") DEFAULT "P"
	);

CREATE TABLE
	IF NOT EXISTS team (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		ownerId INT NOT NULL,
		description VARCHAR(250),
		registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (ownerId) REFERENCES user (id)
	);

CREATE TABLE
	IF NOT EXISTS event_inscriptions (
		id INT PRIMARY KEY AUTO_INCREMENT,
		userId int not null,
		eventId int not null,
		registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		status ENUM ("P", "C", "D") DEFAULT "P",
		FOREIGN KEY (userId) REFERENCES user (id),
		FOREIGN KEY (eventId) REFERENCES event (id)
	);



CREATE TABLE
	IF NOT EXISTS team_users (
		id INT PRIMARY KEY AUTO_INCREMENT,
		userId INT NOT NULL UNIQUE,
		teamId INT NOT NULL,
		inscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		status ENUM ("P", "C", "D") DEFAULT "P",
		FOREIGN KEY (userId) REFERENCES user (id),
		FOREIGN KEY (teamId) REFERENCES team (id)
	);

CREATE TABLE
	IF NOT EXISTS team_events (
		id INT PRIMARY KEY AUTO_INCREMENT,
		teamId INT NOT NULL,
		eventId INT NOT NULL,
		inscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		status ENUM ("P", "C", "D") DEFAULT "P",
		FOREIGN KEY (eventId) REFERENCES event (id),
		FOREIGN KEY (teamId) REFERENCES team (id)
	);

CREATE TABLE
	IF NOT EXISTS matchs (
		id INT PRIMARY KEY AUTO_INCREMENT,
		eventId INT NOT NULL,
		firstTeamId INT NOT NULL,
		secondTeamId INT NOT NULL,
		time TIMESTAMP NOT NULL,
		winnerId INT,
		loserId INT,
		FOREIGN KEY (eventId) REFERENCES event (id),
		FOREIGN KEY (firstTeamId) REFERENCES team (id),
		FOREIGN KEY (secondTeamId) REFERENCES team (id)
	);