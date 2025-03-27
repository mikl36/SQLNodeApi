GENERAL
Author: Mika Körkkö <mika.korkko@tuni.fi>
Date: 2025-03-11

DESCRIPTION
Project Name: API DEVELOPMENT PROJECT

Description:
This project is a Node.js application developed as part of a course project.
It implements a service with the following features:

HTTP Server:
Responds with JSON data.

Database:
Uses SQLite.
Contains three connected tables (Foreign Key - Primary Key relationships) for testing.
Tables are joined together during API GET calls. Install SQL database first -> /sql/README.txt

API:
Implements CRUD operations: Create, Read, Update, and Delete.
Allows reading an entity (GET) and provides at least four parameterized API calls,
    with the first searching by one criterion, the second by two criteria, and so on.
Allows creating an entity (POST).
Allows updating an entity (PUT).
Allows deleting an entity (DELETE).

Other Features:
Error handling for all HTTP methods regarding invalid or unknown parameters or their values.
Error codes are based on the HTTP RFC (REST) standard.
Code must pass style checks using StandardJS.

INSTALL
To install the required Node modules, run the following command:

npm install
This will install all dependencies listed in the package.json file
(express body parser, dotenv, sqlite3, express).

USAGE
Create a .env file in the root directory with the following content:

PORT=8078 (or your own port, you must change ports to this later on)
DATABASE_NAME=database.db
Start the server using the following command:

node server.js
The server will run on http://localhost:8078.

API DESCRIPTION
The API provides the following endpoints:

GET /api/v1/user: Retrieve all users.
GET /api/v1/user/query: Retrieve users based on search criteria, first name, last name, city and/or address.
POST /api/v1/user: Create a new user (all tables).
PUT /api/v1/user/:id: Update an existing user (person table).
DELETE /api/v1/user/:id: Delete a user (all tables).
API EXAMPLES
Here are some examples of how to call the API using curl (use GET all users to check changes):

GET all users:
curl --silent --include "http://localhost:8078/api/v1/user"

GET users by query:
Search by one criterion (lastName):
curl --silent --include "http://localhost:8078/api/v1/user/query?lastName=Doe"

Search by two criteria (firstName and lastName):
curl --silent --include "http://localhost:8078/api/v1/user/query?firstName=John&lastName=Doe"

Search by three criteria (firstName, lastName, and city):
curl --silent --include "http://localhost:8078/api/v1/user/query?firstName=John&lastName=Doe&city=Tampere"

Search by four criteria (firstName, lastName, city, and address):
curl --silent --include "http://localhost:8078/api/v1/user/query?firstName=John&lastName=Doe&city=Tampere&address=Tamperetie"

POST create a new user:
curl --silent --include --request POST --header "Content-Type: application/json" --data '{"firstName":"joe","lastName":"doe","city":"tampere","address":"tamperetie","teamName":"f","pay":60000}' "http://localhost:8078/api/v1/user"

DELETE a user (previously created):
curl --silent --include --request DELETE "http://localhost:8078/api/v1/user/6"

PUT update a user (firstName Joan to Jane):
curl --silent --include --request PUT --header "Content-Type: application/json" --data '{"firstName":"Jane"}' "http://localhost:8078/api/v1/user/2"
