class DataService {
    fetchInfoForRepository(repoId: string) {
        return VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: IExtensionDataService) => {
            return dataService.getValue(repoId).then((doc) => {
                return doc;
            });
        });
    }

    saveInfoForRepository(repoId: string, repoInfo: any) {
        return VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: IExtensionDataService) => {
            return dataService.setValue(repoId, repoInfo);
        });
    }
}