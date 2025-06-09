import { Request, Response } from "express";
import {
  parseISO,
  format,
  isAfter,
  differenceInCalendarDays,
  startOfDay,
  endOfDay,
  
} from "date-fns";
import Agenda from "../models/Agenda";
import Reserva from "../models/Reserva";

// Crear reserva
export const crearReserva = async (req: Request, res: Response) => {
  try {
    const { barberiaId, nombreCliente, telefonoCliente, fecha, barbero } =
      req.body;

    const agenda = await Agenda.findOne({ barberiaId });
    if (!agenda) {
      res.status(404).json({ message: "Agenda no encontrada" });
      return;
    }

    const fechaReserva = parseISO(fecha);
    const hoy = new Date();

    const diasAnticipacion = differenceInCalendarDays(
      startOfDay(fechaReserva),
      startOfDay(hoy)
    );

    if (
      diasAnticipacion < agenda.minAnticipacionDias ||
      diasAnticipacion > agenda.maxAnticipacionDias
    ) {
      res
        .status(400)
        .json({ message: "Fecha fuera del rango de anticipación permitido" });
      return;
    }

    const diaSemana = format(fechaReserva, "EEEE");
    const capitalizado =
      diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

    if (!agenda.diasAtencion.includes(capitalizado)) {
      res.status(400).json({ message: "La barbería no atiende ese día" });
      return;
    }

    const turnoFin = new Date(
      fechaReserva.getTime() + agenda.duracionTurno * 60 * 1000
    );

    const enRango = agenda.horarios.some((r: any) => {
      const desde = parseISO(`${format(fechaReserva, "yyyy-MM-dd")}T${r.desde}`);
      const hasta = parseISO(`${format(fechaReserva, "yyyy-MM-dd")}T${r.hasta}`);
      return fechaReserva >= desde && turnoFin <= hasta;
    });

    if (!enRango) {
      res
        .status(400)
        .json({ message: "Horario fuera del rango de atención" });
      return;
    }

    const existe = await Reserva.findOne({
      barberiaId,
      fecha: new Date(fecha),
      estado: { $ne: "cancelado" },
    });

    if (existe) {
      res.status(400).json({ message: "Ya hay una reserva en ese horario" });
      return;
    }

    const nueva = await Reserva.create({
      barberiaId,
      nombreCliente,
      telefonoCliente,
      fecha,
      barbero,
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear reserva", error });
  }
};


// Obtener reservas de una barbería (admin)
export const obtenerReservasDeBarberia = async (
  req: Request,
  res: Response
) => {
  try {
    const barberiaId = (req as any).user.id;
    const reservas = await Reserva.find({ barberiaId }).sort({ fecha: 1 });
    res.json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener reservas", error });
  }
};

// Obtener reservas de una barbería (admin)
export const obtenerReservasDeFecha = async (req: Request, res: Response) => {
  try {
    const { barberiaId, fecha } = req.params;

    const agenda = await Agenda.findOne({ barberiaId });
    if (!agenda) {
      res.status(404).json({ message: "Agenda no encontrada" });
      return;
    }

    const dia = parseISO(fecha);
    const diaSemana = format(dia, "EEEE");
    const capitalizado =
      diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

    if (!agenda.diasAtencion.includes(capitalizado)) {
      res.status(400).json({ message: "La barbería no atiende ese día" });
      return;
    }

    const reservas = await Reserva.find({
      barberiaId,
      fecha: {
        $gte: startOfDay(dia),
        $lte: endOfDay(dia),
      },
      estado: { $ne: "cancelado" },
    });

    const turnosOcupados = reservas.map((r) =>
      format(new Date(r.fecha), "HH:mm")
    );

    const turnosDisponibles: string[] = [];

    for (const franja of agenda.horarios) {
      let actual = parseISO(`${fecha}T${franja.desde}`);
      const hasta = parseISO(`${fecha}T${franja.hasta}`);

      while (true) {
        const finTurno = new Date(
          actual.getTime() + agenda.duracionTurno * 60 * 1000
        );

        if (isAfter(finTurno, hasta)) break;

        const hora = format(actual, "HH:mm");
        if (!turnosOcupados.includes(hora)) {
          turnosDisponibles.push(hora);
        }

        const minutosEntre =
          (agenda.tiempoEntreTurnos || 0) + agenda.duracionTurno;
        actual = new Date(actual.getTime() + minutosEntre * 60 * 1000);
      }
    }

    res.json({ fecha, disponibles: turnosDisponibles });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener turnos disponibles",
      error,
    });
  }
};

