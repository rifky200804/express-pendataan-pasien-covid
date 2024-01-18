import express from "express";
import routes from "./routes/api.js";
import response from "./utils/response.js";
import dotenv from 'dotenv';
import { swaggerUI, swaggerSpec } from './docs/swagger.js'; 
import cors from "cors";
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

dotenv.config();

app.use(routes);
app.get('/', (req, res) => {
  response.success(res, "Pendataan Covid Api v1", "Pendataan Covid Api");
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use((req, res) => {
  response.error(res, response.API_RESOURCE_NOT_FOUND, response.HTTP_NOT_FOUND);
});

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log("Server Berjalan di http://localhost:" + port);
});
