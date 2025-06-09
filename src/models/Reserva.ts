// models/Reserva.ts
import mongoose, { Schema, model, Model } from "mongoose";
import { IReserva } from "../types/reserva";

const reservaSchema = new Schema<IReserva>(
  {
    barberiaId: {
      type: Schema.Types.ObjectId,
      ref: "Agenda",
      required: true,
    },
    nombreCliente: { type: String, required: true },
    telefonoCliente: { type: String, required: true },
    fecha: { type: Date, required: true },
    barbero: { type: String },
    estado: {
      type: String,
      enum: ["pendiente", "confirmado", "cancelado"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

const Reserva: Model<IReserva> = model<IReserva>("Reserva", reservaSchema);
export default Reserva;
