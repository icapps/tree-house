import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

export default function serveSwagger(express, path, filePath, properties) {
  try {
    // Load yaml document
    const swaggerDocument = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
    Object.assign(swaggerDocument, properties);

    // Serve the document served via swagger-ui
    express.use(path, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (e) {
    throw new Error(`Failed to load swagger documentation: ${e}`);
  }
}
