import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  port: process.env.PORT,
  access_secret: process.env.JWT_SECRET,
  refresh_secret: process.env.REFRESH_SECRET
};

export default config;