import express from 'express';
import morgan from 'morgan';
import { createMedicine, deleteMedicine, getAllMedicine, getMedicineByID, updateMedicine } from '../controllers/medsController.js';


export const medsRouter = express.Router()


medsRouter
.route('/')
.get(getAllMedicine)
.post(createMedicine)

medsRouter
.route('/:id')
.patch(updateMedicine)
.delete(deleteMedicine)
.get(getMedicineByID)