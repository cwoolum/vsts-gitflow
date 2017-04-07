import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");

export class GitflowConfig {

  constructor() {
    var container = $("§build-grid-container");

    var gridOptions: Grids.IGridOptions = {
      height: "100%",
      width: "100%",
      source: () => {
        var result = [], i;
        for (i = 0; i < 100; i++) {
          result[result.length] = [i, "Column 2 text" + i, "Column 3 " + Math.random()];
        }
        return result;
      },
      columns: [
        { text: "Column 1", index: 0, width: 50 },
        { text: "Column 2", index: 1, width: 200, canSortBy: false }
      ]

    };

    Controls.create(Grids.Grid, container, gridOptions);
  }
}