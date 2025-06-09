import { Types } from "mongoose";

export interface IAgenda {
  barberiaId: Types.ObjectId;
  nombreBarberia: string;
  telefono: string;
  direccion: string;
  redesSociales?: string;
  diasAtencion: string[]; // Ej: ['Lunes', 'Martes']
  horarios: {
    desde: string; // "09:00"
    hasta: string; // "13:00"
  }[];
  duracionTurno: number; // en minutos
  tiempoEntreTurnos: number; // en minutos
  minAnticipacionDias: number;
  maxAnticipacionDias: number;
  barberos: string[];
  createdAt?: Date;
  updatedAt?: Date;
}