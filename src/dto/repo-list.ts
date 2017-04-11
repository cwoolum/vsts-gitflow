export class RepoListDictionary {
    [id: string]: IRepoListItem;
}

export class IRepoListItem {
    repoId: string;
    repoName: string;
    currentVersion: string;
}