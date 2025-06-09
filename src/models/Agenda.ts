// models/Agenda.ts
import mongoose, { Schema, model, Model } from "mongoose";
import { IAgenda } from "../types/agenda";

const agendaSchema = new Schema<IAgenda>(
  {
    barberiaId: {
      type: Schema.Types.ObjectId,
      ref: "Barberia",
      required: true,
      unique: true,
    },
    nombreBarberia: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    redesSociales: String,
    diasAtencion: [String],
    horarios: [
      {
        desde: String,
        hasta: String,
      },
    ],
    duracionTurno: { type: Number, required: true },
    tiempoEntreTurnos: { type: Number, required: true },
    minAnticipacionDias: { type: Number, required: true },
    maxAnticipacionDias: { type: Number, required: true },
    barberos: [String],
  },
  { timestamps: true }
);

const Agenda: Model<IAgenda> = model<IAgenda>("Agenda", agendaSchema);
export default Agenda;