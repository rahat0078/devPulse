import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const {email, password} = req.body
    const result = await authService.loginUser(email, password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  createUser,
  loginUser,
};
