import { callApi } from './service';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

const environment = new Map<string, string>([
  ['host', 'https://cw-fo-cosmosdb-account-qa.documents.azure.com'],
  ['key', 'tAGrKK0jvPq9XGkYgzsp07UDPAGwNOPF6AbQOMR06kUjBe2fkkepWHiKc5QBkWmjom7pvREoutxN8fjTS679EQ=='],
  ['databaseKey', 'cw-fo-cosmosdb-qa'],
  ['containerName', 'PortalCustomers'],
]);

const getAuthorizationTokenUsingMasterKey = (
  verb: string,
  resourceType: string,
  resourceId: string,
  date: string,
  masterKey: string,
) => {
  const text =
    (verb || '').toLowerCase() +
    '\n' +
    (resourceType || '').toLowerCase() +
    '\n' +
    (resourceId || '') +
    '\n' +
    date.toLowerCase() +
    '\n' +
    '' +
    '\n';

  const secretByteArray = Base64.parse(masterKey);
  const body = Utf8.parse(text);
  const signatureBytes = hmacSHA256(body, secretByteArray);
  const signature = Base64.stringify(signatureBytes);
  const MasterToken = 'master';
  const TokenVersion = '1.0';
  return encodeURIComponent('type=' + MasterToken + '&ver=' + TokenVersion + '&sig=' + signature);
};

const getTokenInfo = (isUpdate: boolean, id: string) => {
  const dbKey = environment.get('databaseKey');
  // const containerName = "PortalSoldHoldings";

  const containerName = environment.get('containerName');
  const resourceType = 'docs';
  const resourceId = `dbs/${dbKey}/colls/${containerName}${isUpdate ? `/docs/${id}` : ''}`.trim();
  const key = environment.get('key');
  const dateTimeUTC = new Date().toUTCString();
  const token = getAuthorizationTokenUsingMasterKey(
    isUpdate ? 'put' : 'post',
    resourceType,
    resourceId,
    dateTimeUTC,
    key!,
  );
  return { dateTimeUTC: dateTimeUTC, cosmosDBToken: token };
};

const makeApiCall = (query: string, isUpdate = false, id = '') => {
  const tokenInfo = getTokenInfo(isUpdate, id);
  return callApi(
    tokenInfo.cosmosDBToken,
    query,
    {
      databaseKey: environment.get('databaseKey')!,
      containerName: 'PortalCustomers',
    },
    tokenInfo.dateTimeUTC,
    id,
  );
};

export const useVintradeMapperService = () => {
  const onVerfiyEmail = (email: string) => {
    const query = JSON.stringify({
      query: `SELECT *  FROM c where c.clientEmail='${email}'`,
      parameters: [],
    });
    return makeApiCall(query);
  };

  const onQueryByAccountHolderId = (accId: number) => {
    const query = JSON.stringify({
      query: `SELECT *  FROM c where c.vintradeAccountHolderId=${accId}`,
      parameters: [],
    });
    return makeApiCall(query);
  };

  const onUpdateClientEmail = (doc: Record<string, unknown>) => {
    return makeApiCall(JSON.stringify(doc), true, `${doc.vintradeClientId}`);
  };

  return { onVerfiyEmail, onQueryByAccountHolderId, onUpdateClientEmail };
};
