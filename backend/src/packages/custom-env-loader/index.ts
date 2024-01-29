// This will simply ready a .env file from the root dir and attach it to the process.env object
import fs from "fs";

export function parseEnvFromRootDir(pathToFile: string = ".env") {
  //read .env file
  const envFile = fs.readFileSync(pathToFile);
  //split by new line
  const envLines = envFile.toString().split("\n");
  //now split by = and attach to process.env
  envLines.forEach((envLine) => {
    const [key, value] = envLine.split("=");

    process.env[key] = value;
  });
}
