import { Application } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

/**
 * Serve swagger documentation
 */
export function setSwagger(app: Application, route: string, filePath: string, options: SwaggerOptions = {}): void {
  try {
    const stats = fs.lstatSync(filePath);
    let swaggerDocument;

    if (options.concatenate) {
      // Throw error if concatenate = true and filepath = file
      if (stats.isFile()) {
        throw new Error('Boolean concatenate cannot be true when you specify a file. When you want to concatenate, specify a folder');
      }
      if (stats.isDirectory()) {
        swaggerDocument = buildSwaggerDocumentFromFiles(filePath);
      }
    } else {
      if (stats.isFile()) {
        // Load yaml document
        swaggerDocument = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
        Object.assign(swaggerDocument, options);
      }
      if (stats.isDirectory()) {
        throw new Error('To concatenate a folder of swagger YMLS, you need to explicitly set the boolean concatenate on true for the swaggerOptions');
      }
    }

    const useSchema = schema => (...args) => swaggerUi.setup(schema)(...args);
    console.log('Testing symbolic link');

    // Serve the document served via swagger-ui
    app.use(route, swaggerUi.serve, useSchema(swaggerDocument));
  } catch (e) {
    throw new Error(`Failed to load swagger documentation: ${e}`);
  }
}

function buildSwaggerDocumentFromFiles(_filePath: string) {

}

// Interfaces
export interface SwaggerOptions {
  swaggerUrl?: string;
  customJs?: string;
  customCss?: string;
  explorer?: boolean;
  host?: string;
  basePath?: string;
  schemes?: string[];
  swaggerOptions?: {
    validatorUrl?: string | null,
  };
  concatenate?: boolean;
}
