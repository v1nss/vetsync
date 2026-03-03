const { Client } = require("pg");

const url = process.env.PGURL;

if (!url) {
  console.error("PGURL is not set");
  process.exit(1);
}

const masked = url.replace(/:([^@]+)@/, ":****@");
console.log("Connecting to:", masked);

const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

client
  .connect()
  .then(() => {
    console.log("DB connection successful");
    return client.end();
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
