const getHeaders = (token: string, dateTimeUTC: string, isUpdate = false) => {
  const myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('x-ms-version', '2015-12-16');
  myHeaders.append('Authorization', token);
  myHeaders.append('x-ms-date', dateTimeUTC);
  if (isUpdate) {
    myHeaders.append('x-ms-documentdb-partitionkey', '[{}]');
    myHeaders.append('Content-Type', 'application/json');
  } else {
    myHeaders.append('x-ms-documentdb-isquery', 'True');
    myHeaders.append('x-ms-documentdb-query-enablecrosspartition', 'True');
    myHeaders.append('Content-Type', 'application/query+json');
  }

  return myHeaders;
};

export const callApi = (
  token: string,
  query: string,
  urlInfo: Record<string, string>,
  dateTimeUTC: string,
  docId = '',
) => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: docId.length > 0 ? 'PUT' : 'POST',
      headers: getHeaders(token, dateTimeUTC, docId.length > 0),
      body: query,
      redirect: 'follow',
    };

    const urlArgs = docId.length > 0 ? `/${docId}` : '';

    fetch(
      `https://cw-fo-cosmosdb-account-qa.documents.azure.com/dbs/${urlInfo.databaseKey}/colls/${urlInfo.containerName}/docs${urlArgs}`.trim(),
      requestOptions as Record<string, unknown>,
    )
      .then((response) => response.text())
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
