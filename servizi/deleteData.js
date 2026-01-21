import axios from 'axios';

/**
 * Esegue una chiamata PUT autenticata.
 * @param {string} url - Endpoint completo della richiesta.
 * @param {string} token - Token Bearer per autorizzazione.
 * @param {object} data - Oggetto JSON da inviare nel body.
 * @returns {Promise<object>} - Risposta della chiamata oppure errore.
 */
async function deleteData(url, token) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await axios.delete(url, { headers });
    if (response.status !== 204 && response.status !== 200) {
      console.debug('⚠️ La richiesta è stata accettata ma ha restituito ', response.status);
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
export async function deleteGroupRoles(baseUrl, token, tenantId, groupRoleId) {
  const url = `${baseUrl}/admin/application/role/group/${tenantId}/${groupRoleId}`;
  return await deleteData(url, token);
}

export async function deletePermission(baseUrl, token, permissionId) {
  const url = `${baseUrl}/admin/permission/${permissionId}`;
  return await deleteData(url, token);
}