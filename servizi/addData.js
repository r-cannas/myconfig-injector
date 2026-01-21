import axios from 'axios';
import FormData from "form-data";

async function postData(url, authAccount, data) {


  try {

    const formData = new FormData();
    
    for (const key in data) { 
      if (data.hasOwnProperty(key)) { 
        formData.append(key, data[key]); 
      } 
    }

    const response = await axios.post(url, formData, {
      auth:authAccount,
      headers: formData.getHeaders()
    });
    if (response.status < 200 || response.status >= 300) {
      console.debug('⚠️ La richiesta è stata accettata ma ha restituito un valore diverso da 200');
      throw new Error('Impossibile completare la richiesta');
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      console.debug('❌ Errore nella risposta:', error.response.status, error.response.data);
      throw error.response.data;
    } else {
      console.debug('❌ Errore di rete o configurazione:', error.message);
      throw error;
    }
  }
}

/**
 * Associa un utente a un tenant.
 */
export async function insertNewItem(baseUrl, authAccount, data) {
   const url = `${baseUrl}/insertItem`;

  return postData(url, authAccount, data);
}
