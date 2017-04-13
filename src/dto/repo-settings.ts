import { IRepoListItem } from "./repo-list";

export class IRepoSettings {
    repositoryId: string;
    //buildId: string;
    currentVersionMajor: number;
    currentVersionMinor: number;
    currentVersionPatch: number;
    nextVersion?: string;
    branchId?: string;
}