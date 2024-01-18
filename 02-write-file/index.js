const path = require('path');
const fs = require('fs');
const { stdout, stdin, exit } = require('process');

const streamForWriting = fs.createWriteStream(path.join(__dirname, 'text.txt'));

function endFunction() {
  stdout.write('\nBye-bye!');
  exit();
}

stdout.write('\nHi! Type your text here! I will save it:\n');
stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    endFunction();
  } else {
    streamForWriting.write(chunk + '\n');
  }
});

process.on('SIGINT', endFunction);
