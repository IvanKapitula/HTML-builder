const fs = require('fs');
const path = require('path');

const streamForReading = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);
streamForReading.on('data', (data) => console.log(data));
streamForReading.on('error', (error) => console.log(error.message));
