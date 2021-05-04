#!/usr/bin/env node

import chalk from "chalk";
import ora, { Ora } from "ora";
import pjson from "./package.json";
import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import arg from "arg";

process.stdout.write(chalk`
{whiteBright.bold yacrac} v${pjson.version}
{gray.italic yet another create-react-app clone}

`);

let spinner: Ora;
let yarn: boolean;
const nameRegex = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

(async () => {
  let name: string;
  if (arg({})._.length === 1 && arg({})._[0].match(nameRegex)) {
    name = arg({})._[0];
    ora(chalk`{bold Project Name} {gray …} ${name}`).succeed();
  } else {
    const response = await prompts({
      type: "text",
      name: "name",
      message: "Project Name",
      validate: (value: string) => !!value.match(nameRegex),
    });
    if (!response.name) process.exit();
    name = response.name;
  }

  spinner = ora("Copying files").start();
  await fs.copy(path.join(__dirname, "template"), name);
  await fs.writeFile(
    path.join(name, "package.json"),
    JSON.stringify(
      {
        name,
        version: "0.1.0",
        scripts: {
          dev: "snowpack dev",
          build: "snowpack build",
        },
      },
      null,
      2
    )
  );
  await fs.writeFile(
    path.join(name, "README.md"),
    `# ${name}

This is a [react](https://reactjs.org/) project bootstrapped with [yacrac](https://github.com/maltejur/yacrac) running on [snowpack](https://www.snowpack.dev/).

## Getting Started

To run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\``
  );
  spinner.succeed();
  spinner = ora("Installing dependencies").start();
  yarn = await hasYarn();
  spinner.text += chalk` {gray (${yarn ? "yarn" : "npm"})}`;
  await install(["react", "react-dom", "styled-jsx"], name);
  await install(
    [
      "@snowpack/app-scripts-react",
      "@snowpack/plugin-dotenv",
      "@snowpack/plugin-react-refresh",
      "@snowpack/plugin-typescript",
      "@snowpack/plugin-webpack",
      "@types/react",
      "@types/react-dom",
      "@types/snowpack-env",
      "snowpack",
      "snowpack-plugin-svgr",
      "typescript",
    ],
    name,
    true
  );
  spinner.succeed();
  process.stdout.write(chalk`
Done!

Next steps:

  - {cyan cd ${name}}
  - {cyan ${yarn ? "yarn" : "npm run"} dev}

  `);
})();

function install(packages: string[], path: string, dev = false) {
  return aexec(
    `${yarn ? "yarn add" : "npm i -S"}${dev ? " -D" : ""} ${packages.join(
      " "
    )}`,
    {
      cwd: path,
    }
  );
}

function aexec(command: string, { cwd } = { cwd: "." }): Promise<string> {
  return new Promise((resolve, reject) =>
    exec(command, { cwd }, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout);
    })
  );
}

function hasYarn(): Promise<boolean> {
  return new Promise((resolve) => {
    exec("yarn --version", (error) => resolve(!error));
  });
}
