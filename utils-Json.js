import Ajv from "ajv";
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


export function validateJson(data, schema, name = "input") {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    const errors = validate.errors.map(e => `${e.instancePath} ${e.message}`).join("; ");
    throw new Error(`Errore di validazione ${name}: ${errors}`);
  }
}

/**
 * Legge un file JSON e restituisce i dati come oggetto.
 * @param {string} fileName - Nome del file JSON (es. 'utente.json')
 * @returns {Promise<object>} - Oggetto JSON oppure errore.
 */
export async function getJsonDataFromFile(fileName) {
  // __dirname workaround per ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, fileName);

  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Errore nella lettura o parsing del file JSON: ${err.message}`);
  }
}