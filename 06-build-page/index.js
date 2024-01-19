const path = require("path");
const fs = require("fs/promises");
const { createWriteStream } = require("fs");

const cssEndFile = "style.css";
const htmlEndFile = "index.html";

const templateStartFile = "template.html";
const cssStartDirectory = "styles";
const componentsStartDirectory = "components";
const assetsDirectory = "assets";

const cssExtension = ".css";
const htmlExtension = ".html";

const nameOfDirectory = "project-dist";
const pathOfDirectory = path.join(__dirname, "project-dist");

function cssFilter(arg) {
  return arg.filter((el) => el.isFile() && path.extname(el.name) === ".css");
}
async function cssMaker() {
  try {
    const stremOfWriting = createWriteStream(
      path.join(pathOfDirectory, cssEndFile),
      "utf-8"
    );
    const oldFolder = await fs.readdir(
      path.join(__dirname, cssStartDirectory),
      { withFileTypes: true }
    );
    const onlyCss = cssFilter(oldFolder);
    for (let el of onlyCss) {
      const valueOfEl = await fs.readFile(
        path.join(path.join(__dirname, cssStartDirectory), el.name),
        "utf-8"
      );
      stremOfWriting.write(`${valueOfEl}\n`);
    }
    console.log(`Created ${cssEndFile} file\n`);
  } catch (err) {
    console.log("cssMaker has error >> ", err);
  }
}
async function htmlMaker(file, dir) {
  try {
    const item = await fs.readFile(path.join(__dirname, file));
    const itemToString = item.toString();
    const componentItem = itemToString.match(/{{([^}]+)}}/gi);
    let htmlChanged = itemToString;

    if (componentItem) {
      for (let el of componentItem) {
        const nameOfFile = `${el.replace(
          /{{([^}]+)}}/gi,
          "$1"
        )}${htmlExtension}`;
        const valueOfFile = await fs.readFile(
          path.join(__dirname, dir, nameOfFile)
        );

        htmlChanged = htmlChanged.replace(el, valueOfFile.toString());
      }
      fs.writeFile(path.join(pathOfDirectory, htmlEndFile), htmlChanged);
      console.log(`Created ${htmlEndFile} file in ${nameOfDirectory}\n`);
    }
  } catch (err) {
    console.log("htmlMaker has error >> ", err);
  }
}

async function copyMaker(entry, exit) {
  try {
    const baseForCopy = await fs.readdir(entry, { withFileTypes: true });
    for (let el of baseForCopy) {
      if (el.isDirectory()) {
        await fs.mkdir(path.join(exit, el.name));
        console.log(`Created ${el.name} directory\n`);
        await copyMaker(path.join(entry, el.name), path.join(exit, el.name));
        console.log(`Created ${el.name} file\n`);
      } else {
        await fs.copyFile(path.join(entry, el.name), path.join(exit, el.name));
        console.log(`Created ${el.name} file\n`);
      }
    }
  } catch (err) {
    console.log("copyMaker has error >> ", err);
  }
}
async function directoryMaker(entryDirectory, exitDirectory, directory) {
  try {
    await fs.rm(exitDirectory, { recursive: true, force: true });
    await fs.mkdir(exitDirectory, { recursive: true });
    console.log(`Created ${directory} directory\n`);

    copyMaker(entryDirectory, exitDirectory);
  } catch (err) {
    console.log("directoryMaker has error >> ", err);
  }
}
async function projectMaker() {
  try {
    await fs.rm(pathOfDirectory, { recursive: true, force: true });

    await fs.mkdir(pathOfDirectory, { recursive: true, force: true });

    await directoryMaker(
      path.join(__dirname, assetsDirectory),
      path.join(pathOfDirectory, assetsDirectory),
      assetsDirectory
    );

    await htmlMaker(
      templateStartFile,
      componentsStartDirectory,
      pathOfDirectory
    );

    await cssMaker();
  } catch (err) {
    console.log("ProjectMaker has error >> ", err);
  }
}
projectMaker();
