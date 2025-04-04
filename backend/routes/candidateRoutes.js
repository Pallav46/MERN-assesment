import express from 'express';
import { submitApplication } from '../controllers/candidateController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/submit', 
  upload.array('documents', 5),
  submitApplication
);

export default router;