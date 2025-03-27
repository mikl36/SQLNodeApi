-- DELETE FROM person;
-- DROP TABLE IF EXISTS person;
DELETE FROM team WHERE person_id = 1;
DELETE FROM team WHERE person_id  = 2;
DELETE FROM team WHERE person_id  = 3;
DELETE FROM team WHERE person_id  = 4;
DELETE FROM team WHERE person_id  = 5;

DELETE FROM salary WHERE person_id  = 1;
DELETE FROM salary WHERE person_id  = 2;
DELETE FROM salary WHERE person_id  = 3;
DELETE FROM salary WHERE person_id  = 4;
DELETE FROM salary WHERE person_id  = 5;

DELETE FROM person WHERE id = 1;
DELETE FROM person WHERE id = 2;
DELETE FROM person WHERE id = 3;
DELETE FROM person WHERE id = 4;
DELETE FROM person WHERE id = 5;

--DELETE FROM person WHERE id IN (1, 2, 3, 4, 5);
