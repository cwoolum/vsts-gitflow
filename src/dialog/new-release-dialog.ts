import { DataService } from '../data-service';
import Dialogs = require("VSS/Controls/Dialogs");

interface SaveRepoConfig {
  repositoryId: string;
  currentVersionMajor: number;
  currentVersionMinor: number;
  currentVersionPatch: number;
  repoName: string;
}

export class NewReleaseDialog {
  dataService: DataService;
  constructor() {
    this.dataService = new DataService();
  }

  setupDialog() {

    $("#new-release-btn").click(() => {
      $.get("../static/new-release-dialog.html", (dialogTemplate) => {
        let $dialog = $(dialogTemplate);


        let dialog = Dialogs.show(Dialogs.ModalDialog, <Dialogs.IModalDialogOptions>{
          width: 300,
          title: "Create New Release",
          content: $dialog,
          okCallback: (result: SaveRepoConfig) => {

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

        function isEmpty(parent: JQuery): boolean {
          return true;
        }

        function getValue(parent: JQuery): SaveRepoConfig {
          return <SaveRepoConfig>{
            repositoryId: parent.find('.repository-select').val(),
            repoName: parent.find('.repository-select').find('option:selected').text(),
            currentVersionMajor: parent.find('#major').val(),
            currentVersionMinor: parent.find('#minor').val(),
            currentVersionPatch: parent.find('#patch').val()
          }
        }
      });
    });
  }
}