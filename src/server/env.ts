interface Env {
  port: number;
}

const port: number =
  parseInt(process.env["WFX_PORT"] || process.env["PORT"]) || 8080;

export default { port } as Env;
