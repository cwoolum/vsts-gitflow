import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");

import RestClient = require("TFS/VersionControl/GitRestClient");
import { DataService } from "./data-service";
import { NewRepoDialog } from "./dialog/new-repo-dialog";

export class GitflowConfig {
  dataService: DataService;

  constructor() {
    this.dataService = new DataService();

    let repoDialog= new NewRepoDialog();
    repoDialog.setupDialog();
  }

  buildGrid() {
    this.dataService.fetchConfiguredRepos().then(response => {
      var container = $(".build-grid-container");

      let mappedResponse = [];

      if (response) {
        mappedResponse = response.map(repo => {
          return {
            name: repo.repoName,
            version: repo.currentVersion
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