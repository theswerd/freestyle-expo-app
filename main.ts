import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

app.use("*", serveStatic({ root: "./dist" }));

Deno.serve(app.fetch);
