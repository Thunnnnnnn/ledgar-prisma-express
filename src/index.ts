import express, { Request, Response } from 'express';
import routes from './routes';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.json('Hello, world!');
});

routes(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});