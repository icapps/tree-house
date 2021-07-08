import { Application } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Serve swagger documentation
 */
export function setSwagger(app: Application, route: string, filePath: string, options: SwaggerOptions = {}): void {
  try {
    const stats = fs.lstatSync(filePath);
    let swaggerDocument: any;

    if (options.concatenate) {
      // Throw error if concatenate = true and filepath = file
      if (stats.isFile()) {
        throw new Error('Boolean concatenate cannot be true when you specify a file. When you want to concatenate, specify a folder');
      }
      if (stats.isDirectory()) {
        const swaggerContent = buildSwaggerDocumentFromFiles(filePath);
        swaggerDocument = yaml.load(swaggerContent);
      }
    } else {
      if (stats.isFile()) {
        // Load yaml document
        swaggerDocument = yaml.load(fs.readFileSync(filePath, 'utf8'));
      }
      if (stats.isDirectory()) {
        throw new Error('To concatenate a folder of swagger YMLS, you need to explicitly set the boolean concatenate on true for the swaggerOptions');
      }
    }

    // Bugfix to host multiple swagger definitions see:
    // https://github.com/scottie1984/swagger-ui-express/issues/92#issuecomment-454034754
    const useSchema = (schema, options: SwaggerOptions) => (...args) => swaggerUi.setup(schema, options)(...args);

    // Serve the document served via swagger-ui
    app.use(route, swaggerUi.serve, useSchema(swaggerDocument, options));
  } catch (e) {
    throw new Error(`Failed to load swagger documentation: ${e}`);
  }
}

function buildSwaggerDocumentFromFiles(filePath: string) {
  let swaggerDocument = '';
  try {
    swaggerDocument += fs.readFileSync(path.join(filePath, 'index.yml'), 'utf8');
    swaggerDocument += 'paths: \n';
  } catch (error) {
    throw new Error(`Could not read index.yml make sure the file is named: index.yml and in the correct folder ${error}`);
  }

  try {
    const routeFiles = fs.readdirSync(path.join(filePath, 'routes'));
    routeFiles.forEach((file) => {
      swaggerDocument += fs.readFileSync(path.join(filePath, 'routes', file), 'utf8');
    });
  } catch (error) {
    throw new Error(`Error while reading routes folder. Make sure there is one! , ${error}`);
  }

  return swaggerDocument;
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
