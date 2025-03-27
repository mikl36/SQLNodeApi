# from project folder run to create a database table
sqlite3 database.db < sql/create.sql

# from project folder insert example data
sqlite3 database.db < sql/insert.sql

# from project folder delete example data
sqlite3 database.db < sql/delete.sql

# from project folder delete file database.db
rm database.db
