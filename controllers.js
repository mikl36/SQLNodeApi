const db = require('./database')
const httpStatusCode = require('./httpStatusCode')

// Base SQL query to select user details from multiple tables
const SQL_BASE_TABLE = `
  SELECT p.first_name, p.last_name, p.city, p.address, t.team_name, s.pay
  FROM person AS p
  INNER JOIN team AS t ON p.id = t.person_id
  INNER JOIN salary AS s ON p.id = s.person_id
`
// ORDER BY p.last_name ASC, t.team_name ASC

// Function to get all users
const getAllUsers = (req, res) => {
  // Execute the base SQL query without any conditions
  db.all(SQL_BASE_TABLE, [], (err, rows) => {
    if (err) {
      // Return internal server error if query fails
      res.status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR).json({ error: err.message })
    } else {
      // Return the result rows if query succeeds
      res.status(httpStatusCode.HTTP_OK).json(rows)
    }
  })
}

// Function to get users based on query parameters (first name, last name, city and/or address)
const getUserByQuery = (req, res) => {
  const { firstName, lastName, city, address } = req.query

  // Check if at least one of the parameters are given
  if (!firstName && !lastName && !city && !address) {
    return res
      .status(httpStatusCode.HTTP_BAD_REQUEST)
      .json({ error: 'At least one query parameter is required.' })
  }

  // parameters firstName NULL (firstName) etc.
  const params = [firstName, firstName, lastName, lastName, city, city, address, address]

  // use query parameter if exists, use NULL if not exists
  const query = `
    ${SQL_BASE_TABLE}
    WHERE (LOWER(p.first_name) = LOWER(?) OR ? IS NULL)
    AND (LOWER(p.last_name) = LOWER(?) OR ? IS NULL)
    AND (LOWER(p.city) = LOWER(?) OR ? IS NULL)
    AND (LOWER(p.address) = LOWER(?) OR ? IS NULL)
  `
  // ORDER BY p.last_name ASC, t.team_name ASC

  // Execute the query with the provided parameters
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database query error:', err.message)
      return res.status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR).json({ error: err.message })
    }
    if (rows.length === 0) {
      // Return not found error if no matching users are found
      return res.status(httpStatusCode.HTTP_NOT_FOUND).json({ error: 'User not found' })
    }
    // Return the result rows if query succeeds
    res.status(httpStatusCode.HTTP_OK).json(rows)
  })
}

// Function to create user to all the tables (TRANSACTIONS?)
const createUser = (req, res) => {
  const { firstName, lastName, city, address, teamName, pay } = req.body

  // Check if at least one required parameter is provided
  if (!firstName && !lastName && !city && !teamName) {
    return res
      .status(httpStatusCode.HTTP_BAD_REQUEST)
      .json({ error: 'At least one parameter (firstName, lastName, city, teamName) is required.' })
  }

  db.serialize(() => {
    // Insert new user into the person table, allows NULL values
    db.run(
      `INSERT INTO person (first_name, last_name, city, address)
      VALUES
        (COALESCE(?, NULL)
        , COALESCE(?, NULL)
        , COALESCE(?, NULL)
        , COALESCE(?, NULL))`,
      [firstName, lastName, city, address],
      function (err) {
        if (err) {
          console.error('Database insert error (person):', err.message)
          return res
            .status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR)
            .json({ error: err.message })
        }

        const personId = this.lastID // use person id to insert team and salary

        // Insert new team entry for the user
        db.run(
          `INSERT INTO team (person_id, team_name)
          VALUES (?, COALESCE(?, NULL))`,
          [personId, teamName],
          function (err) {
            if (err) {
              console.error('Database insert error (team):', err.message)
              return res
                .status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR)
                .json({ error: err.message })
            }

            // Insert new salary entry for the user
            db.run(
              `INSERT INTO salary (person_id, pay)
              VALUES (?, COALESCE(?, NULL))`,
              [personId, pay],
              function (err) {
                if (err) {
                  console.error('Database insert error (salary):', err.message)
                  return res
                    .status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: err.message })
                }

                // Return success message if all inserts succeed
                res
                  .status(httpStatusCode.HTTP_CREATED)
                  .json({ message: 'User created successfully' })
              }
            )
          }
        )
      }
    )
  })
}

// Function to update an existing user with multiple parameters (TRANSACTIONS?)
const updateUser = (req, res) => {
  const { id } = req.params
  const { firstName, lastName, city, address } = req.body

  // Check if at least one parameter is provided
  if (!firstName && !lastName && !city && !address) {
    return res
      .status(httpStatusCode.HTTP_BAD_REQUEST)
      .json({ error: 'At least one parameter (firstName, lastName, city, address) is required.' })
  }

  db.serialize(() => {
    // First check if ID is found
    db.get('SELECT id FROM person WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Database query error:', err.message)
        return res
          .status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR)
          .json({ error: err.message })
      }

      if (!row) {
        return res
          .status(httpStatusCode.HTTP_NOT_FOUND)
          .json({ error: 'User not found' })
      }

      // Proceed with the update if ID is found, TRIM?
      db.run(`
        UPDATE person
        SET first_name = COALESCE(?, first_name),
            last_name = COALESCE(?, last_name),
            city = COALESCE(?, city),
            address = COALESCE(?, address)
        WHERE id = ?
      `, [firstName, lastName, city, address, id], function (err) {
        if (err) {
          console.error('Database update error:', err.message)
          return res.status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR).json({ error: err.message })
        }

        // Return success message if update succeeds
        res.status(httpStatusCode.HTTP_OK).json({
          message: 'User updated successfully'
        })
      })
    })
  })
}

// Function to delete a user (TRANSACTIONS?)
const deleteUser = (req, res) => {
  const { id } = req.params

  // first check if id is found
  db.get('SELECT id FROM person WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database query error:', err.message)
      return res
        .status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR)
        .json({ error: err.message })
    }

    if (!row) {
      return res
        .status(httpStatusCode.HTTP_NOT_FOUND)
        .json({ error: 'User not found' })
    }

    db.serialize(() => {
      // Delete from team and salary first (foreign key constraints)
      db.run('DELETE FROM team WHERE person_id = ?', [id], function (err) {
        if (err) {
          console.error('Database delete error (team):', err.message)
          return res
            .status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR)
            .json({ error: err.message })
        }

        db.run('DELETE FROM salary WHERE person_id = ?', [id], function (err) {
          if (err) {
            console.error('Database delete error (salary):', err.message)
            return res
              .status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR)
              .json({ error: err.message })
          }

          // Finally delete from person
          db.run('DELETE FROM person WHERE id = ?', [id], function (err) {
            if (err) {
              console.error('Database delete error (person):', err.message)
              return res
                .status(httpStatusCode.HTTP_INTERNAL_SERVER_ERROR)
                .json({ error: err.message })
            }
            // Return success message if all deletes succeed
            res
              .status(httpStatusCode.HTTP_OK)
              .json({ message: 'User deleted successfully' })
          })
        })
      })
    })
  })
}

module.exports = {
  getAllUsers,
  getUserByQuery,
  createUser,
  updateUser,
  deleteUser
}
