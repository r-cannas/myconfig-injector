import dotenv from "dotenv";
import { validateJson, getJsonDataFromFile } from './utils-Json.js';
import configDataSchema from './schemas/configData.schema.js';
import { getItem } from './servizi/retriveData.js';
// import {

// } from './servizi/updateData.js';
// import {

// } from './servizi/addData.js';


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
    for (const tenantCode of configData.tenants) {
      for (const config of configData.configs) {

        try {
          // recupero un valore
          const value = await getItem(baseUrl, authAccount, tenantCode, config.code, false);
          console.debug('valore: ',value);
            // String url = String.format("%s/getComplexItem?code=%s&withDefault=false", new Object[]{this.baseUrl, URLEncoder.encode(code, "UTF-8")});
insertItem
         const testInsertObj = {
                    name: "Test Name",
                    fk: 14232,
                    code: 'TEST',
                    type: 'root',
                    value: 'Test Value'
                }
https://myconfig-rw-private.staging.regione.veneto.it/myconfig-server/confServiceJsonDao/insertItem
        } catch (error) {
          console.error(`❌ Errore durante l'elaborazione dell'utente ${user.userCode}:`, error);
          // continue; // Continua con il prossimo utente in caso di errore  
        }
      }
    }
  }

})();

// --- Helper Functions ---

/**
 * Verifica se l'utente esiste, altrimenti lo crea e aggiunge eventuali attributi.
 */
async function ensureUserExists(baseUrl, token, user) {
  let userInfo = await getUser(baseUrl, token, user.userTaxCode);
  if (userInfo) {
    console.debug('✅ Utente trovato:', userInfo);
  } else {
    console.debug('❌ Nessun dato utente.');
    try {
      userInfo = await createUser(baseUrl, token, user);
      console.debug('✅ Utente creato con successo:', userInfo);
      // Se ci sono attributi, li aggiunge all'utente
      if (user.attributes) {
        for (const attribute of user.attributes) {
          try {
            await createUserAttribute(baseUrl, token, userInfo.userId, attribute.name, attribute.value);
          } catch (err) {
            console.error('❌ Creazione attributo fallito:', err);
          }
        }
      }
    } catch (err) {
      console.error('❌ Creazione utente fallita:', err);
      throw new Error(`Impossibile creare l'utente ${user.userCode}: ${err.message}`);
    }
  }
  return userInfo;
}
