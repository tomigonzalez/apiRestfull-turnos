// services/userServices.ts
import Users from '../models/Users';
import bcrypt from 'bcryptjs';

export const registerUserService = async (email: string, password: string, barberName: string) => {
  try {
    if (!email || !password || !barberName) {
      return { status: 400, data: { message: 'Todos los campos son obligatorios' } };
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return { status: 400, data: { message: 'El email ya está registrado' } };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Users({
      email,
      password: hashedPassword,
      barberName,
    });

    const savedUser = await newUser.save();

    return { status: 201, data: { message: 'Usuario registrado', userId: savedUser._id } };
  } catch (error) {
    return {
      status: 500,
      data: { message: 'Error al registrar usuario', error: (error as Error).message },
    };
  }
};

export const loginUserService = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      return { status: 400, data: { message: 'Email y contraseña obligatorios' } };
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return { status: 400, data: { message: 'Credenciales inválidas' } };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 400, data: { message: 'Credenciales inválidas' } };
    }

    return {
      status: 200,
      data: {
        message: 'Inicio de sesión exitoso',
        user: {
          id: user._id,
          email: user.email,
          barberName: user.barberName,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: 'Error al iniciar sesión', error: (error as Error).message },
    };
  }
};
