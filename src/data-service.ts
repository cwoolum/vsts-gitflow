import { IRepoSettings } from "./dto/repo-settings";
import RestClient = require("TFS/VersionControl/GitRestClient");
import { IRepoListItem } from "./dto/repo-list";

export class DataService {
    _client: RestClient.GitHttpClient3_1;

    constructor() {
        this._client = RestClient.getClient();
    }

    fetchConfiguredRepos() {
        return VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: IExtensionDataService) => {
            return dataService.getValue<Array<IRepoListItem>>('configuredrepos').then((doc) => {
                return doc;
            });
        });
    }

    fetchConfigurationForRepository(repoId: string) {
        return VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: IExtensionDataService) => {
            return dataService.getValue<IRepoSettings>(repoId).then((doc) => {
                return doc;
            });
        });
    }

    saveConfigurationForRepository(repoId: string, repoInfo: IRepoSettings) {
        return VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: IExtensionDataService) => {
            return dataService.setValue(repoId, repoInfo);
        });
    }

    saveConfiguredRepos(repoConfigs: Array<IRepoListItem>) {
        return VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: IExtensionDataService) => {
            return dataService.setValue('configuredrepos', repoConfigs);
        });
    }

    getAllRepositories() {
        return this._client.getRepositories();
    }
}