import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");
import Dialogs = require("VSS/Controls/Dialogs");
import RestClient = require("TFS/VersionControl/GitRestClient");

export class GitflowConfig {

  constructor() {

  }

  setupDialog() {
    $("#show").click(() => {
      // Display the dialog
      var dialog = Dialogs.show(Dialogs.ModalDialog, <Dialogs.IModalDialogOptions>{
        width: 300,
        title: "Register",
        content: $(".dialog-content").clone(),
        okCallback: (result: any) => {
          $("<li />").text(result).appendTo(".person-list");
        }
      });

      var dialogElement = dialog.getElement();
      // Monitor input changes
      dialogElement.on("input", "input", (e: JQueryEventObject) => {
        // Set dialog result
        dialog.setDialogResult(getValue(dialogElement));
        // Update enabled status of ok button
        dialog.updateOkButton(!isEmpty(dialogElement));
      });
    });

    function isEmpty(parent: JQuery): boolean {
      return parent.find("input").filter((index: number, el: Element) => {
        return !$(el).val();
      }).length > 0;
    }

    function getValue(parent: JQuery): string {
      return parent.find("input").map((index: number, el: Element) => {
        return $(el).val();
      }).get().join(" - ");
    }
  }

  buildGrid() {
    var client = RestClient.getClient();

    client.getRepositories().then(response => {
      var container = $(".build-grid-container");

      var gridOptions: Grids.IGridOptions = {
        height: "100%",
        width: "100%",
        source: response.map(repo => repo.name),
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