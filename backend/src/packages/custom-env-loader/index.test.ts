import fs from "fs";
import { parseEnvFromRootDir } from "./index"; // adjust the import path if necessary

describe("parseEnvFromRootDir", () => {
  // create a temporary .env file

  const tempEnvPath = ".env.temp";

  beforeAll(() => {
    // Create a temporary .env file
    fs.writeFileSync(tempEnvPath, "TEST_KEY=TEST_VALUE\nTEST_KEY2=TEST_VALUE2");
  });

  afterAll(() => {
    // Delete the temporary .env file
    fs.unlinkSync(tempEnvPath);
  });

  it("should parse .env file and attach it to process.env", () => {
    parseEnvFromRootDir(tempEnvPath);

    expect(process.env.TEST_KEY).toBe("TEST_VALUE");
    expect(process.env.TEST_KEY2).toBe("TEST_VALUE2");
  });
});
