import axios from 'axios';

/**
 * Esegue una chiamata PUT autenticata.
 * @param {string} url - Endpoint completo della richiesta.
 * @param {string} token - Token Bearer per autorizzazione.
 * @param {object} data - Oggetto JSON da inviare nel body.
 * @returns {Promise<object>} - Risposta della chiamata oppure errore.
 */
async function putData(url, token, data) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await axios.put(url, data, { headers });
    if (response.status !== 200) {
      console.debug('⚠️ La richiesta è stata accettata ma ha restituito 400');
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
 * Aggiorna i gruppi associati a un utente per un tenant.
 */
export async function updateTenantUserGroups(baseUrl, token, tenantId, userId, groupsData) {
  const url = `${baseUrl}/admin/user/tenant/${tenantId}/${userId}/groups`;
  return await putData(url, token, groupsData);
}

/**
 * Aggiorna gli uffici associati a un utente per un tenant.
 */
export async function updateTenantUserOffices(baseUrl, token, tenantId, userId, officesData) {
  const url = `${baseUrl}/admin/user/tenant/${tenantId}/${userId}/offices`;
  return await putData(url, token, officesData);
}
