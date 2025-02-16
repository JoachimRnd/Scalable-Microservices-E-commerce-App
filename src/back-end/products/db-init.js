const fs = require('fs');
const axios = require('axios'); // Make sure to install this package

const data = fs.readFileSync('db-init.json', 'utf8');
const items = JSON.parse(data);
const DB_URL = process.env.DB_URL || 'http://localhost:5984/products';


items.forEach(async (item) => {
  try {
    await axios.post(DB_URL, item); // Replace DB_URL with your database URL
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});