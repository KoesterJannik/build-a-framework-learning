// This will simply ready a .env file from the root dir and attach it to the process.env object
import fs from "fs";

export function parseEnvFromRootDir(pathToFile: string = ".env") {
  //read .env file
  const envFile = fs.readFileSync(pathToFile);
  //split by new line
  const envLines = envFile.toString().split("\n");
  // split only by the first = sign
  envLines.forEach((line) => {
    const [key, ...rest] = line.split("=");

    process.env[key] = rest.join("=");
  });
}
