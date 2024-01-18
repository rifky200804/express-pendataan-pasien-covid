// validation/Patient.js
import { body } from 'express-validator';

const PatientValidation = {};

PatientValidation.createValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'), 
  body('address').optional().notEmpty().withMessage('Address is required'), 
  body('status').notEmpty().withMessage('Status is required').isIn(['sembuh', 'positif', 'meninggal']).withMessage('Invalid status, Status value is positif/sembuh/meniggal'),
  body('inDateAt').notEmpty().isISO8601().toDate().withMessage('Invalid inDateAt'),
  body('outDateAt').optional().isISO8601().toDate().withMessage('Invalid outDateAt'), 
];

PatientValidation.updateValidation = [
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('address').optional().notEmpty().withMessage('Address is required'),
  body('status').optional().notEmpty().withMessage('Status is required').isIn(['sembuh', 'positif', 'meninggal']).withMessage('Invalid status, Status value is positif/sembuh/meniggal'),
  body('inDateAt').optional().isISO8601().toDate().withMessage('Invalid inDateAt'),
  body('outDateAt').optional().isISO8601().toDate().withMessage('Invalid outDateAt'),
];

export default PatientValidation;
