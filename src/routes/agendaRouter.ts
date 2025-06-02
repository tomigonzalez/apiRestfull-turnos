import { Router } from "express";
import { deleteAgenda, getMyAgenda, upsertAgenda } from "../controllers/agendaControllers";
import { verifyToken } from "../middleware/verifyToken";


const agendaRouter = Router();
// Ruta para traer una agenda
agendaRouter.get("/mi-agenda", verifyToken, getMyAgenda);
// Ruta para crear o editar agenda
agendaRouter.post("/mi-agenda", verifyToken, upsertAgenda);
// Ruta para borrar agenda
agendaRouter.delete("/mi-agenda", verifyToken, deleteAgenda);

export default agendaRouter;
