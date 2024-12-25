import express, { Request, Response } from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.json('Hello, world!');
});
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true}));
routes(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});