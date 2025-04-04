import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileType: { 
    type: String,
    required: true,
    enum: ['image', 'pdf']
  },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);