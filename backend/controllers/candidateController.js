import Candidate from '../models/Candidate.js';
import Document from '../models/Document.js';
import fs from 'fs/promises';

const validateAge = (dob) => {
  // Remove extra quotes if they exist
  const cleanedDob = dob.replace(/^"|"$/g, '');
  const birthDate = new Date(cleanedDob);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
};

export const submitApplication = async (req, res) => {
  try {
    // Clean up and parse dob field
    let dob = req.body.dob;
    if (typeof dob === 'string') {
      dob = dob.replace(/^"|"$/g, '');
    }
    if (!validateAge(dob)) {
      return res.status(400).json({ error: 'Must be at least 18 years old' });
    }

    // Parse the addresses if they are JSON strings
    let residentialAddress = req.body.residentialAddress;
    try {
      residentialAddress = JSON.parse(residentialAddress);
    } catch (err) {
      // If parsing fails, assume it's already an object
    }
    let permanentAddress = req.body.permanentAddress;
    try {
      permanentAddress = JSON.parse(permanentAddress);
    } catch (err) {
      // If parsing fails, assume it's already an object
    }

    // Validate that required address fields exist
    if (!residentialAddress || !residentialAddress.street1 || !residentialAddress.street2) {
      return res.status(400).json({ error: 'Residential address (street1 and street2) is required' });
    }

    // If sameAsResidential is true, use residentialAddress for permanentAddress
    if (req.body.sameAsResidential === 'true') {
      permanentAddress = residentialAddress;
    } else if (!permanentAddress || !permanentAddress.street1 || !permanentAddress.street2) {
      return res.status(400).json({ error: 'Permanent address (street1 and street2) is required when not same as residential' });
    }

    // Validate file uploads
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Minimum 2 documents required' });
    }

    // Process documents
    const documents = await Promise.all(
      req.files.map(async (file) => {
        const doc = new Document({
          filename: file.originalname,
          fileType: file.mimetype.startsWith('image/') ? 'image' : 'pdf',
          filePath: file.path
        });
        await doc.save();
        return doc._id;
      })
    );

    // Create candidate with proper parsed fields
    const candidate = new Candidate({
      ...req.body,
      dob: new Date(dob),
      residentialAddress,
      permanentAddress,
      documents
    });

    await candidate.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      candidate
    });

  } catch (error) {
    console.error('Submission error:', error);
    // Delete uploaded files if an error occurred
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (file) => {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            console.error(`Failed to delete file ${file.path}:`, unlinkError);
          }
        })
      );
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
