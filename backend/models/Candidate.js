import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  residentialAddress: {
    street1: { type: String, required: true },
    street2: { type: String, required: true }
  },
  permanentAddress: {
    street1: String,
    street2: String
  },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
}, { timestamps: true });

export default mongoose.model('Candidate', candidateSchema);