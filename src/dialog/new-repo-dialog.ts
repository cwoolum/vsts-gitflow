import Dialogs = require("VSS/Controls/Dialogs");

import * as dialogTemplate from '../../static/new-repo-dialog.html!text';

export class NewRepoDialog{
 setupDialog() {
    $("#show").click(() => {
      // Display the dialog
      var dialog = Dialogs.show(Dialogs.ModalDialog, <Dialogs.IModalDialogOptions>{
        width: 300,
        title: "Register",
        content: dialogTemplate.default,
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
}