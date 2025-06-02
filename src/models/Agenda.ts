import mongoose from 'mongoose';

const agendaSchema = new mongoose.Schema({
  barberiaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barberia', // O "Usuario" si es un admin
    required: true,
    unique: true
  },
  nombreBarberia: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  redesSociales: {
    type: String, // podés usar un string libre (link) o convertirlo en objeto si después querés IG, FB, etc.
  },

  diasAtencion: [String], // ['Lunes', 'Martes', 'Miércoles']
  
  horarios: [
    {
      desde: String, // "09:00"
      hasta: String  // "13:00"
    },
    {
      desde: String, // "15:00"
      hasta: String  // "19:00"
    }
  ],

  duracionTurno: Number, // en minutos
  tiempoEntreTurnos: Number, // en minutos, opcional
  minAnticipacionDias: Number,
  maxAnticipacionDias: Number,
  barberos: [String]
}, {
  timestamps: true
});

export default mongoose.model('Agenda', agendaSchema);
