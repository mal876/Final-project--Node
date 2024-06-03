import express from 'express';
import morgan from 'morgan';

import { getAllRecords, createRecord, updateRecord, deleteRecord, getRecordByID } from '../controllers/recordsController.js';


export const recordsRouter = express.Router();

recordsRouter
.route('/')
.get(getAllRecords)
.post(createRecord)


recordsRouter
.route('/:id')
.patch(updateRecord)
.delete(deleteRecord)
.get(getRecordByID)