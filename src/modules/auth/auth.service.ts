import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { I_User } from "./auth.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const createUserIntoDB = async (payload: I_User) => {
  const { name, email, password, role } = payload;
  if (!name || !email || !password || !role) {
    throw new Error("All fields are required");
  }
  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );
  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }
  const hashPassword = await bcrypt.hash(password, 10);


  const result = await pool.query(
    `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
      `,
    [name, email, hashPassword, role],
  );
  return result;
};

const loginUser = async (email: string, password: string) => {
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid Credential");
  }

  const JwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(JwtPayload, config.access_secret as string, {
    expiresIn: "1d",
  });

  delete user.password;
  return {
    token,
    user,
  };
};

export const authService = {
  createUserIntoDB,
  loginUser,
};
