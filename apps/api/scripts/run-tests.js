const { spawn } = require("child_process");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const composeFile = path.join(repoRoot, "infra", "docker-compose.test.yml");

const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) return resolve();
      const error = new Error(`${command} exited with code ${code}`);
      error.code = code;
      reject(error);
    });
  });

const runCapture = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"], ...options });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) return resolve({ stdout, stderr });
      const error = new Error(`${command} exited with code ${code}`);
      error.code = code;
      error.stdout = stdout;
      error.stderr = stderr;
      reject(error);
    });
  });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dbContainerName = "app_test_db";

const waitForDb = async () => {
  const maxAttempts = 30;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const result = await runCapture("docker", ["inspect", "-f", "{{.State.Health.Status}}", dbContainerName]);
      if (result.stdout.trim() === "healthy") return;
    } catch (error) {
      // Ignore while container is booting.
    }
    await delay(1000);
  }
  throw new Error("db_test did not become healthy in time");
};

const projectArgs = ["--project-name", "app_test"];

const runTests = async () => {
  let exitCode = 0;

  try {
    await run("docker", ["compose", ...projectArgs, "-f", composeFile, "up", "-d"], { cwd: repoRoot });
    await waitForDb();

    const env = {
      ...process.env,
      NODE_ENV: "test",
      DB_HOST: "localhost",
      DB_PORT: "5433"
    };

    await run("npx", ["vitest", "--run"], { cwd: path.join(repoRoot, "apps", "api"), env });
  } catch (error) {
    exitCode = typeof error.code === "number" ? error.code : 1;
  } finally {
    try {
      await run("docker", ["compose", ...projectArgs, "-f", composeFile, "down"], { cwd: repoRoot });
    } catch (error) {
      // Ignore teardown errors so test result is preserved.
    }
  }

  process.exit(exitCode);
};

runTests();
