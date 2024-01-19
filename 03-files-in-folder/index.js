const { readdir, stat } = require('fs/promises');
const path = require('path');

async function checkSecretInfo() {
  try {
    const infoItem = await readdir(path.join(__dirname, 'secret-folder'), {
      withFileTypes: true,
    });
    for (let el of infoItem) {
      if (el.isFile()) {
        const nameOfFile = el.name;
        const size = await stat(
          path.join(path.join(__dirname, 'secret-folder'), nameOfFile),
        );
        const ex = path.extname(nameOfFile);
        console.log(
          nameOfFile.split('.')[0],
          '-',
          ex.slice(1),
          '-',
          size.size,
          'bytes',
        );
      }
    }
  } catch (err) {
    console.log('Oh my gosh: ', err);
  }
}
checkSecretInfo();
