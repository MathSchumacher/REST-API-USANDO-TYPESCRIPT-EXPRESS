import express, { Request, Response/*, NextFunction*/ } from 'express';
import usersRoute from './routes/users.route';
import statusRoute from './routes/status.route';
import errorHandler from './middlewares/error-handler.middleware';
import authorizationRoute from './routes/authorization.route';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middleware';
import db from './db';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(statusRoute);
app.use('/authentication', authorizationRoute);
app.use('/users', jwtAuthenticationMiddleware, usersRoute);
app.use(errorHandler);
app.use('/', (req: Request, res: Response) => {
    res.json({ message: 'ok' });
});
const server = app.listen(3000, () => {
    console.log('listem on 3000!');
});

process.on('SIGTERM', () => {
    db.end(() => {
        console.log('database connection closed!')
    });
    server.close(() => {
        console.log('server on 3000 closed!');
    });
})
/*app.use(jwtAuthenticationMiddleware);
app.use(usersRoute);

app.use(errorHandler);
app.get('/status', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ foo: 'sucesso total!' });
});

app.listen(3000, () => {
    console.log('Aplicação executando na porta 3000!');
});
*/