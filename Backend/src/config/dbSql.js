const postgres = require('postgres')

const connectionString = process.env.SupabaseURI
const sql = postgres(connectionString)

module.exports = sql