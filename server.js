import 'express-async-errors'
import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

import connectDB from './db/connect.js';

import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json())
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// only when ready to deploy
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.get('/', (req, res) => {
    //throw new Error('error')
    res.json({msg:'Welcome!'});
});
app.get('/api/v1', (req, res) => {
    //throw new Error('error')
    res.json({msg:'api'});
});

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
const port = process.env.PORT || 5000;



const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error)
    }
}

start()