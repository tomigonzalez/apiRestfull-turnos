import { Types } from "mongoose";

export interface IReserva {
  barberiaId: Types.ObjectId;
  nombreCliente: string;
  telefonoCliente: string;
  fecha: Date;
  barbero?: string;
  estado: "pendiente" | "confirmado" | "cancelado";
  createdAt?: Date;
  updatedAt?: Date;
}
