import { FreestyleSandboxes } from "freestyle-sandboxes";
import { prepareDirForDeploymentSync } from "freestyle-sandboxes/utils";

// Create a sandboxes client
const sandboxes = new FreestyleSandboxes({
  apiKey: process.env.FREESTYLE_API_KEY!,
});

async function deploy() {
  const web = await sandboxes.deployWeb(
    {
      kind: "files",
      files: prepareDirForDeploymentSync("."),
    },
    {
      entrypoint: "main.ts",
      // put whatever domains you want here
      domains: ["example.style.dev"],
    }
  );

  console.log(
    "Deployed to",
    web.domains?.map((dmn) => `https://${dmn}`).join(", ")
  );
}

deploy();
