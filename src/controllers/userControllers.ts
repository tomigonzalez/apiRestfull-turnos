//controllers/useControllers.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken"
import Users from "../models/Users";
import { registerSchema, loginSchema } from "../validations/userSchema";
import { SECRET_JWT_KEY } from "../config/config";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const { email, password, barberName } = result.data;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "El email ya está registrado." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const publicId = crypto.randomUUID();

    const newUser = new Users({
      email,
      password: hashedPassword,
      barberName,
      publicId,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "Registro exitoso.",
      userId: savedUser._id,
    });
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    res.status(500).json({
      message: "Hubo un error en el servidor al intentar registrar el usuario.",
      error: (error as Error).message,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const { email, password } = result.data;

  

    const user = await Users.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Credenciales inválidas." });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Credenciales inválidas." });
      return;
    }
    const token = jwt.sign({id:user.id , email:user.email}, SECRET_JWT_KEY , {
    expiresIn:'1h'
    })
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_JWT_KEY,
      { expiresIn: '7d' } // vida más larga
    );
    // Setear las cookies
    res
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15 // 15 min
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
      })
      .json({
        user: {
          id: user._id,
          email: user.email,
          barberName: user.barberName,
        },
        token,
        refreshToken
      });

    
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({
      message: "Hubo un error en el servidor al intentar iniciar sesión.",
      error: (error as Error).message,
    });
  }
};


export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  res
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .json({ message: 'Sesión cerrada correctamente.' });
};

// controllers/userControllers.ts
export const refreshToken = (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;

  if (!token) {
    res.status(401).json({ message: "Refresh token faltante." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY) as { id: string; email: string };

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      SECRET_JWT_KEY,
      { expiresIn: '15m' }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 15
    });

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    console.warn("Refresh token inválido:", (err as Error).message);
    res.status(401).json({ message: "Refresh token inválido." });
  }
};