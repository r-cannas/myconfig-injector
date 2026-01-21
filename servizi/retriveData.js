import axios from 'axios';

const maxElementsPerPage = 100; // Numero massimo di elementi per pagina nelle chiamate paginabili

/**
 * Esegue una richiesta GET autenticata e restituisce il body della risposta.
 * Gestisce anche casi di risposta vuota.
 */
async function getData(url, authAccount) {
 

  try {
    const response = await axios.get(url, {auth:authAccount});
    const body = response.data;

    // Controlla se il body è vuoto
    const isEmpty = (
      body === null ||
      body === undefined ||
      (typeof body === 'string' && body.trim() === '') ||
      (typeof body === 'object' && Object.keys(body).length === 0)
    );

    if (isEmpty) {
      console.debug('⚠️ Il body della risposta è vuoto.');
      return null;
    } else {
      console.debug('✅ Risposta ricevuta:', body);
      return body;
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('❌ Errore:', error.response.data);
    } else {
      console.error('❌ Errore:', error.message);
    }
    throw error;
  }
}

/**
 * Recupera un tenant tramite il suo codice.
 */
export async function getItem(baseUrl, authAccount, tenantCode, code, withDefault) {
  const safeConfigCode = encodeURIComponent(tenantCode+'>'+code);
  const safeWithDefault = encodeURIComponent(withDefault);
  const url = `${baseUrl}/getItem?code=${safeConfigCode}&withDefault=${safeWithDefault}`;
  return getData(url, authAccount);
}


export async function insertItem(baseUrl, authAccount, tenantCode, code, withDefault) {
  const safeConfigCode = encodeURIComponent(tenantCode+'>'+code);
  const safeWithDefault = encodeURIComponent(withDefault);
  const url = `${baseUrl}/insertItem?code=${safeConfigCode}&withDefault=${safeWithDefault}`;
  return getData(url, authAccount);
}

