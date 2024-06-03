import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { recordsRouter } from './routes/recordsRouter.js';
import { doctorsRouter } from './routes/doctorsRouter.js';
import { medsRouter } from './routes/medsRouter.js';
import { authRouter } from './routes/authRouter.js';

const port = 4000;
const app = express();


app.options('*', cors(['Angular localhost']));
app.use(cors(['angular localhost']));

app.use(express.json({limit: '5kb'}));
app.use(express.urlencoded({extended: true, limit:'5kb'}));

if(process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/v1/records', recordsRouter);

app.use('/api/v1/doctors', doctorsRouter);

app.use('/api/v1/meds', medsRouter);

app.use('/api/v1/auth', authRouter);


app.listen(port, ()=>{console.log(`Watchtower Online`)});