import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");

import RestClient = require("TFS/VersionControl/GitRestClient");

export class GitflowConfig {

  buildGrid() {
    var client = RestClient.getClient();

    client.getRepositories().then(response => {
      var container = $(".build-grid-container");

      var gridOptions: Grids.IGridOptions = {
        height: "100%",
        width: "100%",
        source: response.map(repo => {
          console.log(repo);
          return repo.name;
        }),
        columns: [
          { text: "Name", index: 0 }
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