import { IRepoSettings } from "./dto/repo-settings";
import { GitVersionType } from "TFS/VersionControl/Contracts";
import RestClient = require("TFS/VersionControl/GitRestClient");
import { IRepoListItem, RepoListDictionary } from "./dto/repo-list";
import BuildHttpClient = require("TFS/Build/RestClient");

export class DataService {
    _client: RestClient.GitHttpClient3_1;
    _buildClient: BuildHttpClient.BuildHttpClient3_1;

    constructor() {
        this._client = RestClient.getClient();
        this._buildClient = BuildHttpClient.getClient();
    }

    createNewFeatureBranch(newVersion: string, repoId: string) {
        return this._client.getBranch(repoId, 'develop').then(branchInfo => {
            // return this._client.updateRefs([<any>{
            //     oldObjectId: branchInfo.commit.commitId,
            //     name: 'refs/heads/' + newVersion,
            //     sha1IdString: branchInfo.commit.commitId
            // }], repoId);
            return this._client.createPush(<any>{
                refUpdates: [{
                    name: 'refs/heads/' + newVersion,
                    oldObjectId: branchInfo.commit.commitId
                }],
                commits: [{
                    "comment": "Updating active tasks, but saving in a new branch.",
                    "changes": [
                        {
                            "changeType": "add",
                            "item": {
                                "path": "/" + newVersion + ".md"
                            },
                            "newContent": {
                                "content": "Delete me!",
                                "contentType": "rawtext"
                            }
                        }
                    ]
                }]
            }, repoId).then(response => {
                return this.fetchConfigurationForRepository(repoId).then(repoConfig => {
                    repoConfig.branchId = newVersion;
                    return this.saveConfigurationForRepository(repoId, repoConfig);
                });
            });
        });
    }

    fetchCommitsForFeatureBranch(repoId: string, branchName: string, fromDate: string) {
        return this._client.getCommits(repoId, <any>{
            compareVersion: {
                version: branchName,
                versionType: GitVersionType.Branch
            },
            fromDate: fromDate
        });
    }

    fetchConfiguredRepos() {
        return VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: IExtensionDataService) => {
            return dataService.getValue<RepoListDictionary>('configuredrepos').then((doc) => {
                return doc || {};
            }, err => {
                return {};
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

    saveConfiguredRepos(repoConfigs: RepoListDictionary) {
        return VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: IExtensionDataService) => {
            return dataService.setValue('configuredrepos', repoConfigs);
        });
    }

    getAllRepositories() {
        return this._client.getRepositories();
    }

    getAllBuildDefinitions() {
        return this._buildClient.getDefinitions();
    }
}