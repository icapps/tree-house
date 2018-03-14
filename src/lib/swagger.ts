import { Application } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';


/**
 * Serve swagger documentation
 */
export default function setSwagger(app: Application, route: string, filePath: string, properties: SwaggerOptions): void {
  try {
    // Load yaml document
    const swaggerDocument = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
    Object.assign(swaggerDocument, properties);

    // Serve the document served via swagger-ui
    app.use(route, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (e) {
    throw new Error(`Failed to load swagger documentation: ${e}`);
  }
}


// Interfaces
export interface SwaggerOptions {
  swaggerUrl?: string;
  customJs?: string;
  customCss?: string;
  explorer?: boolean;
  host?: string;
  schemes?: string[];
  swaggerOptions?: {
    validatorUrl?: string | null,
  };
}
