import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

// Garante que o dotenv procure o arquivo .env na raiz da pasta backend
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log("DEBUG DATABASE: Host ->", process.env.DB_HOST);
console.log("DEBUG DATABASE: Senha preenchida? ->", process.env.DB_PASSWORD ? "SIM" : "NÃO");

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
});

pool.on("connect", () => {
  console.log("Base de dados conectada com sucesso!");
});

pool.on("error", (err) => {
  console.error("Erro na conexão com a base de dados:", err);
});
