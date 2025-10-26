import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);


const sanitizeUrl = (url: string): string => {
  try {
   
    const urlObj = new URL(url);
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid protocol');
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('Invalid API_BASE_URL:', url, error);
    return 'http://localhost:3000'; 
  }
};

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

app.use(async (req, res, next) => {
  try {
    const response = await angularApp.handle(req);
    if (!response) {
      next();
      return;
    }
    
    const rawApiBaseUrl = process.env['API_BASE_URL'] || 'http://localhost:3000';
    
    const apiBaseUrl = sanitizeUrl(rawApiBaseUrl);
    
    const safeApiBaseUrl = escapeHtml(apiBaseUrl);
    
    const html = await response.text();
    const modifiedHtml = html.replace('{{API_BASE_URL}}', safeApiBaseUrl);
    
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    res.status(response.status).send(modifiedHtml);
  } catch (error) {
    next(error);
  }
});

const handleBootstrapError = (error: NodeJS.ErrnoException | undefined) => {
  if (!error) {
    return;
  }

  const permissionDenied = error.code === 'EPERM' || error.code === 'EACCES';

  if (permissionDenied) {
    console.warn(
      'Angular SSR server bootstrap skipped: unable to bind to a local port in this environment.',
    );
    return;
  }

  throw error;
};

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;

  try {
    const server = app.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });

    server.once('error', handleBootstrapError);
  } catch (error) {
    handleBootstrapError(error as NodeJS.ErrnoException | undefined);
  }
}

export const reqHandler = createNodeRequestHandler(app);
