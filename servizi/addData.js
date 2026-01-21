import axios from 'axios';

/**
 * Esegue una chiamata POST autenticata.
 * @param {string} url - Endpoint completo della richiesta.
 * @param {string} token - Token Bearer per autorizzazione.
 * @param {object|null} data - Oggetto JSON da inviare nel body.
 * @returns {Promise<object>} - Risposta della chiamata oppure errore.
 */
async function postData(url, token, data) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await axios.post(url, data, { headers });
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
export async function assignUserToTenant(baseUrl, token, tenantId, userId) {
  const url = `${baseUrl}/admin/user/tenant/${tenantId}/${userId}/`;
  return postData(url, token, null);
}

/**
 * Crea un nuovo utente.
 */
export async function createUser(baseUrl, token, userData) {
  const url = `${baseUrl}/admin/user/create/`;
  return postData(url, token, userData);
}

/**
 * Crea un nuovo gruppo di ruoli in un tenant.
 */
export async function createGroup(baseUrl, token, tenantId, groupData) {
  const url = `${baseUrl}/admin/group/${tenantId}/`;
  return postData(url, token, groupData);
}

/**
 * Crea un nuovo ruolo in un gruppo di un tenant.
 */
export async function associateRoleToGroup(baseUrl, token, tenantId, groupId, roleId) {
  const url = `${baseUrl}/admin/application/role/group/${tenantId}/${groupId}/${roleId}/`;
  return postData(url, token, null);
}


/**
 * Associa un utente a una applicazione per un tenant.
 */
export async function createTenantApplicationUser(baseUrl, token, tenantId, applId, userId) {
  const url = `${baseUrl}/admin/tenant/application/user/${tenantId}/${applId}/${userId}`;
  return postData(url, token, null);
}

/**
 * Associa un ruolo a un utente per una specifica applicazione e organigramma.
 */
export async function createTenantApplicationUserRole(baseUrl, token, applId, tenantId, userId, organId, roleId) {
  const url = `${baseUrl}/admin/application/role/app/${applId}/uo/${tenantId}/${userId}/${organId}/${roleId}`;
  return postData(url, token, null);
}

/**
 * Crea un attributo per un utente.
 */
export async function createUserAttribute(baseUrl, token, userId, attributeName, attributeValue) {
  const attributeData = {
    attributeName: `${attributeName}`,
    attributeValue: `${attributeValue}`
  };
  const url = `${baseUrl}/admin/user/attribute/create/${userId}/`;
  return postData(url, token, attributeData);
}

/**
 * Aggiunge un permesso a un ruolo per un determinato organigramma utente.
 */
export async function addPermissionToRole(baseUrl, token, roleId, userOrganlId, permissionAnagId, resource) {
  const permissionData = {
    permissionId: null,
    resource: `${resource}`,
    permission: {
      permissionAnagId: `${permissionAnagId}`,
      permissionName: null,
      permissionDesc: null
    }
  };
  const url = `${baseUrl}/admin/permission/${roleId}?userOrganlId=${userOrganlId}`;
  return postData(url, token, permissionData);
}

export async function addPermissionToRoleByGroupId(baseUrl, token, roleId, groupId, permissionAnagId, resource) {
  const permissionData = {
    permissionId: null,
    resource: `${resource}`,
    permission: {
      permissionAnagId: `${permissionAnagId}`,
      permissionName: null,
      permissionDesc: null
    }
  };
  const url = `${baseUrl}/admin/permission/${roleId}?groupId=${groupId}`;
  return postData(url, token, permissionData);
}
