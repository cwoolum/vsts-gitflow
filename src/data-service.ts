import { IRepoSettings } from "./dto/repo-settings";
import { GitVersionType } from "TFS/VersionControl/Contracts";
import RestClient = require("TFS/VersionControl/GitRestClient");
import { IRepoListItem, RepoListDictionary } from "./dto/repo-list";
import BuildHttpClient = require("TFS/Build/RestClient");

export class DataService {
    _client: RestClient.GitHttpClient3_1;
    _buildClient: BuildHttpClient.BuildHttpClient3_1;
    _projectId: string;

    constructor(
        private projectId: string
    ) {
        this._client = RestClient.getClient();
        this._buildClient = BuildHttpClient.getClient();
    }

    createNewFeatureBranch(newVersion: string, repoId: string) {
        return this._client.getBranch(repoId, 'develop').then(branchInfo => {
            return this._client.updateRefs([<any>{
                newObjectId: branchInfo.commit.commitId,
                name: 'refs/heads/' + newVersion,
                oldObjectId: "0000000000000000000000000000000000000000"
            }], repoId).then(response => {
                return this._client.createPullRequest(<any>{
                    sourceRefName: `refs/heads/${newVersion}`,
                    targetRefName: `refs/heads/master`,
                    title: `Merge version ${newVersion} to master`,
                    description: ''
                }, repoId).then(createPullRequestResponse => {
                    return this.fetchConfigurationForRepository(repoId).then(repoConfig => {
                        repoConfig.branchId = newVersion;
                        repoConfig.branchCreateDate = new Date();
                        repoConfig.pullRequestId = createPullRequestResponse.codeReviewId;
                        return this.saveConfigurationForRepository(repoId, repoConfig);
                    });
                });
            });
        });
    }

    clearFeatureBranch(repoId: string) {
        //// return this._client..updateRefs([<any>{
        ////     newObjectId: branchInfo.commit.commitId,
        ////     name: 'refs/heads/' + newVersion,
        ////     oldObjectId: "0000000000000000000000000000000000000000"
        //// }], repoId).then(response => {
        return this.fetchConfigurationForRepository(repoId).then(repoConfig => {
            repoConfig.branchId = undefined;
            repoConfig.branchCreateDate = null;
            return this.saveConfigurationForRepository(repoId, repoConfig);
        });
        ////});

    }

    async deleteRepo(repoId: string) {
        let repos = await this.fetchConfiguredRepos();
        delete repos[repoId];
        this.saveConfiguredRepos(repos);

        let dataService = <IExtensionDataService>(await VSS.getService(VSS.ServiceIds.ExtensionData));
        dataService.setValue(repoId, null);
    }

    fetchPullRequestDetails(pullRequestId: number) {
        return this._client.getPullRequestById(pullRequestId);
    }

    fetchCommitsForFeatureBranch(repoId: string, branchName: string, fromDate: string) {
        return this._client.getCommits(repoId, <any>{
            itemVersion: {
                version: branchName,
                versionType: GitVersionType.Branch
            },
            fromDate: fromDate
        });
    }

    fetchCommitsForMasterBranchSinceFeature(repoId: string, branchName: string, fromDate: string) {
        return this._client.getCommits(repoId, <any>{
            compareVersion: {
                version: 'master',
                versionType: GitVersionType.Branch
            },
            itemVersion: {
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

        return this._buildClient.getDefinitions(this.projectId, null, null, null, null, 100);
    }
}