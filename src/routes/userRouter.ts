
// routes/routes.ts
import { Router } from 'express';

import { loginUser, logoutUser, refreshToken, registerUser } from '../controllers/userControllers';
import agendaRouter from './agendaRouter';

const routerUsuario = Router();


//ROUTES USUARIOS
// Ruta para registrar un nuevo usuario
routerUsuario.post('/register', registerUser);
// Ruta para iniciar sesión
routerUsuario.post('/login', loginUser);
// Ruta para cerrar sesión
routerUsuario.post('/logout', logoutUser);
// routes/routes.ts
routerUsuario.post('/refresh-token', refreshToken);

//ROUTES AGENDA
routerUsuario.use("/agenda",agendaRouter );

export default routerUsuario;

