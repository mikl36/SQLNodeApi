CREATE TABLE person
(
    id                   INTEGER       NOT NULL UNIQUE PRIMARY KEY,
    last_name            VARCHAR(100),
    first_name           VARCHAR(100),
    city                 VARCHAR(60),
    address              VARCHAR(100)
);

CREATE TABLE team
(
    id                   INTEGER       NOT NULL UNIQUE PRIMARY KEY,
    person_id            INTEGER,
    team_name            VARCHAR(100),
    FOREIGN KEY (person_id) REFERENCES person(id)
);

CREATE TABLE salary
(
    id                   INTEGER       NOT NULL UNIQUE PRIMARY KEY,
    person_id            INTEGER,
    pay                  DECIMAL(10, 2),
    FOREIGN KEY (person_id) REFERENCES person(id)
);
