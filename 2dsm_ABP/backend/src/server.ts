import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';
import { swaggerDocument } from '@/server/config/swagger.js';
import { pdfUploadDir } from '@/server/config/multer.js';
import routes from '@/routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads/pdfs', express.static(pdfUploadDir));

// Rota do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

app.use((
  error: unknown,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'O arquivo PDF deve ter no maximo 10 MB.'
        : 'Erro ao processar o upload do arquivo.';
    res.status(400).json({ error: message });
    return;
  }

  if (error instanceof Error && error.message.includes('PDF')) {
    res.status(400).json({ error: error.message });
    return;
  }

  next(error);
});

const PORT = process.env.PORT || 3666;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
