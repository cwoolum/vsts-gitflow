import { IRepoSettings } from './dto/repo-settings';
import { NewReleaseDialog } from './dialog/new-release-dialog';
import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");

import RestClient = require("TFS/VersionControl/GitRestClient");
import { DataService } from "./data-service";
import { NewRepoDialog } from "./dialog/new-repo-dialog";

export class GitflowConfig {
  dataService: DataService;
  grid: Grids.Grid;
  repoSettings: IRepoSettings;

  constructor() {
    this.dataService = new DataService();

    let repoDialog = new NewRepoDialog();
    repoDialog.setupDialog();

    let releaseDialog = new NewReleaseDialog();

    $("#new-release-btn").click(() => {
      releaseDialog.setupDialog(this.repoSettings);
    });
  }

  buildGrid() {
    return this.dataService.fetchConfiguredRepos().then(response => {
      var container = $(".build-grid-container");

      let mappedResponse = [];

      if (response) {
        mappedResponse = Object.keys(response).map(repoId => {
          return {
            name: response[repoId].repoName,
            version: response[repoId].currentVersion,
            repoId: repoId
          };
        });
      }

      var gridOptions: Grids.IGridOptions = {
        height: "100%",
        width: "100%",
        source: mappedResponse,
        lastCellFillsRemainingContent: true,
        columns: [
          { index: 'repoId', hidden: true },
          { text: "Name", index: 'name' },
          { text: "Current Version", index: 'version', width: 200 }
        ]
      };

      this.grid = Controls.create(Grids.Grid, container, gridOptions);

      var checkExist = setInterval(() => {
        this.setSelectedRepo();
        
        if ($('.grid-row').length) {
          $('.grid-row').click((event) => {
            $('#manage-release').hide();
            this.setSelectedRepo();
          });

          clearInterval(checkExist);
        }
      }, 100);

      
    });

  }

  private setSelectedRepo() {
    let selectedIndex = this.grid.getSelectedDataIndex();
    let item = this.grid._dataSource[selectedIndex];
    this.dataService.fetchConfigurationForRepository(item.repoId).then(repoSettings => {
      this.repoSettings = repoSettings;
      if (repoSettings.branchId) {
        $('#manage-release').show();
      }
    });
  }
}