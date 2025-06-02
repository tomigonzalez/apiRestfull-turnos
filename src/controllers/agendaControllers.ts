import { Request, Response } from "express";
import Agenda from "../models/Agenda";

// Obtener agenda propia
export const getMyAgenda = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const agenda = await Agenda.findOne({ barberiaId: userId });

    if (!agenda) {
      res.status(404).json({ message: "Agenda no encontrada." });
    }

    res.json(agenda);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la agenda.", error });
  }
};

// Crear o actualizar agenda
export const upsertAgenda = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const agendaData = {
      ...req.body,
      barberiaId: userId,
    };

    const agenda = await Agenda.findOneAndUpdate(
      { barberiaId: userId },
      agendaData,
      { new: true, upsert: true } // si no existe, la crea
    );

    res.status(200).json({
      message: "Agenda guardada correctamente.",
      agenda,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar la agenda.", error });
  }
};

// Eliminar agenda
export const deleteAgenda = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await Agenda.findOneAndDelete({ barberiaId: userId });
    res.json({ message: "Agenda eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la agenda.", error });
  }
};
