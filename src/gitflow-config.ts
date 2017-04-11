import { NewReleaseDialog } from './dialog/new-release-dialog';
import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");

import RestClient = require("TFS/VersionControl/GitRestClient");
import { DataService } from "./data-service";
import { NewRepoDialog } from "./dialog/new-repo-dialog";

export class GitflowConfig {
  dataService: DataService;

  constructor() {
    this.dataService = new DataService();

    let repoDialog = new NewRepoDialog();
    repoDialog.setupDialog();

    let releaseDialog = new NewReleaseDialog();
    releaseDialog.setupDialog();
  }

  buildGrid() {
    return this.dataService.fetchConfiguredRepos().then(response => {
      var container = $(".build-grid-container");

      let mappedResponse = [];

      if (response) {
        mappedResponse = Object.keys(response).map(repoId => {
          return {
            name: response[repoId].repoName,
            version: response[repoId].currentVersion
          };
        });
      }

      var gridOptions: Grids.IGridOptions = {
        height: "100%",
        width: "100%",
        source: mappedResponse,
        columns: [
          { text: "Name", index: 'name' },
          { text: "Current Version", index: 'version' }
        ]
      };

      Controls.create(Grids.Grid, container, gridOptions);
    });

  }

  private buildSource() {
    var result = [], i;
    for (i = 0; i < 100; i++) {
      result[result.length] = [i, "Column 2 text" + i];
    }
    return result;
  }
}