import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

app.use("*", serveStatic({ root: "./dist" }));

// fallback to index.html
app.get("*", serveStatic({ path: "./dist/index.html" }));

Deno.serve(app.fetch);
