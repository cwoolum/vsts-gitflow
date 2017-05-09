import { IRepoSettings } from './dto/repo-settings';
import { NewReleaseDialog } from './dialog/new-release-dialog';
import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");

import RestClient = require("TFS/VersionControl/GitRestClient");
import { DataService } from "./data-service";
import { NewRepoDialog } from "./dialog/new-repo-dialog";
import { IMenuItemSpec } from "VSS/Controls/Menus";

export class GitflowConfig {
  dataService: DataService;
  grid: Grids.Grid;
  repoSettings: IRepoSettings;

  constructor(webContext: WebContext) {
    this.dataService = new DataService(webContext.project.id);

    let repoDialog = new NewRepoDialog(webContext.project.id);
    repoDialog.setupDialog();

    let releaseDialog = new NewReleaseDialog(webContext.project.id);

    $("#new-release-btn").click(() => {
      releaseDialog.setupDialog(this.repoSettings, () => {
        let selectedIndex = this.grid.getSelectedDataIndex();
        let item = this.grid._dataSource[selectedIndex];
        this.dataService.fetchConfigurationForRepository(item.repoId).then(repoSettings => {
          this.repoSettings = repoSettings;
          if (repoSettings.branchId) {
            $('#manage-release').show();
            $('#new-release-btn').hide();

            $('#next-version-number').html(repoSettings.branchId);
            this.getCommits(item.repoId, repoSettings.branchId, new Date().toISOString());

            this.dataService.fetchPullRequestDetails(repoSettings.pullRequestId).then(details => {
              $('#pr-status').html(details.status.toString());
            });
          } else {
            $('#manage-release').hide();
            $('#new-release-btn').show();
          }
        });
      });
    });

    $('#cancel-button').click(() => {
      if (confirm('Are you sure you want to cancel this release?')) {
        this.dataService.clearFeatureBranch(this.repoSettings.repositoryId).then(() => {
          this.setSelectedRepo();
        });
      }
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
        ],
        contextMenu: {
          items: [<IMenuItemSpec>{
            id: 'delete',
            text: 'Delete',
            icon: "icon-delete"
          }],
          executeAction: args => {
            switch (args.get_commandName()) {
              case "open":
                break;

              case "delete":
                if (confirm("Are you sure you want to delete this configuration?")) {
                  //this.dataService.deleteRepo()
                }
                break;
            }
          },
          useBowtieStyle: true
        },
        gutter: {
          contextMenu: true
        }
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
        $('#new-release-btn').hide();

        $('#next-version-number').html(repoSettings.branchId);
        this.getCommits(item.repoId, repoSettings.branchId, new Date(repoSettings.branchCreateDate).toISOString()).then(response => {
          let $commitsTable = $('.commits-since-creation tbody');
          $commitsTable.html('');
          response.forEach(element => {
            var $tr = $('<tr>').append(
              $('<td>').text(element.commitId),
              $('<td>').text(element.comment)
            );

            $commitsTable.append($tr);
          });
        });

        this.dataService.fetchPullRequestDetails(repoSettings.pullRequestId).then(details => {
          $('#pr-status').html(details.status.toString());
        });

      } else {
        $('#manage-release').hide();
        $('#new-release-btn').show();
      }
    });
  }

  private getCommits(repoId: string, branchName: string, fromDate: string) {
    return this.dataService.fetchCommitsForFeatureBranch(repoId, branchName, fromDate);
  }
}