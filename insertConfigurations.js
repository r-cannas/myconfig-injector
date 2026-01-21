import dotenv from "dotenv";
import { validateJson, getJsonDataFromFile } from './utils-Json.js';
import configDataSchema from './schemas/configData.schema.js';
import { getItem } from './servizi/retriveData.js';
import { insertNewItem } from "./servizi/addData.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

// Costanti di configurazione
const baseUrl = process.env.BASE_URL;
const adminUser = process.env.ADMIN_USER;
const adminPwd = process.env.ADMIN_PWD;

// Funzione principale asincrona IIFE (Immediately Invoked Function Expression)
(async () => {

  // Carica e valida i dati degli utenti
  const configData = await getJsonDataFromFile('/resources/configData.json');
  validateJson(configData, configDataSchema, "configData.json");



  // Imposta userCode e userDomain se non presenti
  const authAccount =
  {
    username: adminUser,
    password: adminPwd
  };
  if (configData && configData.tenants && configData.configs) {
    // per ogni tenant in lista,
    for (const tenantCode of configData.tenants) {
      // qualora abbia un errore, passo al tenant successivo
      try {

        // inserisco in ordine quanto richiesto
        for (const config of configData.configs) {
          // recupero un valore
          const fatherNodeId = await getFatherNodeId(baseUrl, authAccount, tenantCode, config.fatherCode);
          console.debug("Father Node Id:", fatherNodeId);
          const newItemId = await insertNewNodeOrSkipIfCodeAlreadyExists(baseUrl, authAccount, tenantCode, fatherNodeId, config);
          console.debug("New Item Id:", newItemId);
        }
      } catch (error) {
        console.error(`❌ Errore durante l'elaborazione del tenant ${tenantCode}:`, error);
      }
      console.debug("Finished Tenant:", tenantCode);
    }
    console.debug("Execution completed successfully");
  }
})();

// --- Helper Functions ---

async function getFatherNodeId(baseUrl, authAccount, tenantCode, fatherCode) {
  const fatherNode = await getItem(baseUrl, authAccount, tenantCode, fatherCode, false);
  if (fatherNode) {
    console.debug('FatherNode found: ', fatherNode);
    return fatherNode.id
  } else {
    console.error('❌ Nodo padre non trovato.  tenantCode:${tenantCode}, fatherCode:${fatherCode}');
    throw new Error(`Nodo padre non trovato.  tenantCode:${tenantCode}, fatherCode:${fatherCode}`);
  }
}


async function insertNewNodeOrSkipIfCodeAlreadyExists(baseUrl, authAccount, tenantCode, fatherNodeId, config) {
  const newCode = config.fatherCode ? `${config.fatherCode}>${config.code}`: config.code;
  const existingItem = await getItem(baseUrl, authAccount, tenantCode, newCode, false);
  // if item doesn't exists I create new one
  if (existingItem) {
    console.debug(`Il nodo da inserire '${newCode}' è già presente:`, existingItem);
    return existingItem.id;
  } else {

    const newConfig = {
      name: config.name ? config.name : config.code,
      fk: fatherNodeId,
      code: config.code,
      type: config.type,
      value: config.value
    }

    const newItemId = await insertNewItem(baseUrl, authAccount, newConfig);
    if (!newItemId) {
      console.error('Impossibile inserire il nodo richiesto:', newConfig);
      throw new Error(`Impossibile inserire il nodo richiesto.`);
    }
    return newItemId;
  }
}