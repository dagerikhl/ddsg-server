function updateEntitiesFromDataSources() {
    // Fetch CAPEC source
    const capecVersion = getNewestVersionOfSource('capec');
    const capecData = fetchCapecData(capecVersion);

    // Fetch CWE source
    const cweVersion = getNewestVersionOfSource('cwe');
    const cweData = fetchCweData(cweVersion);

    const entities = generateEntities(capecData, cweData);

    const data = {
        timestamp: Date.now() || new Date().getTime(),
        entities: entities
    };

    setFileContent('entities', data);
}
