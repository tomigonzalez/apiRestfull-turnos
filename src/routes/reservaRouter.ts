import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { crearReserva, obtenerReservasDeBarberia, obtenerReservasDeFecha } from "../controllers/reservaControllers";




const reservaRouter = Router();

// Crear una nueva reserva (usuario)
reservaRouter.post("/barberia", crearReserva);

// Obtener reservas de una barbería (para el admin)
reservaRouter.get("/barberia/reservas", verifyToken, obtenerReservasDeBarberia);

// Obtener reservas para una barbería en una fecha específica (para frontend al armar horarios disponibles)
reservaRouter.get("/barberia/:barberiaId/fecha/:fecha", obtenerReservasDeFecha);

export default reservaRouter;
