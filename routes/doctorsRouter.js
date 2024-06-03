import express from 'express';
import morgan from 'morgan';

import { createDoctor, deleteDoctor, getAllDoctors, getDoctorByID, updateDoctor } from '../controllers/doctorsController.js';

export const doctorsRouter = express.Router()

doctorsRouter
.route('/')
.get(getAllDoctors)
.post(createDoctor)


doctorsRouter
.route('/:id')
.patch(updateDoctor)
.delete(deleteDoctor)
.get(getDoctorByID)