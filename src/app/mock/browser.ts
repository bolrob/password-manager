import { setupWorker } from 'msw/browser';
import { getHandlers } from './handlers';

// Remove trailing slash: 'https://bolrob.github.io/password-manager/' → '…/password-manager'
const apiBase = document.baseURI.replace(/\/$/, '');

export const worker = setupWorker(...getHandlers(apiBase));
