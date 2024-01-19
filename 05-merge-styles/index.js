const fs = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");

async function createBundl() {
  try {
    const oldFolder = await readdir(path.join(__dirname, "styles"), {
      withFileTypes: true,
    });
    const stremOfWriting = fs.createWriteStream(
      path.join(__dirname, "project-dist/bundle.css")
    );

    for (let el of oldFolder) {
      const fileOfName = el.name;
      const ex = path.extname(
        path.join(path.join(__dirname, "styles"), fileOfName)
      );

      if (ex.toLowerCase() === ".css" && el.isFile()) {
        const stremOfReading = fs.createReadStream(
          path.join(path.join(__dirname, "styles"), fileOfName)
        );
        stremOfReading.pipe(stremOfWriting);
      }
    }
  } catch (err) {
    console.log("Oh my gosh", err);
  }
}

createBundl();