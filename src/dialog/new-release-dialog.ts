import { IRepoSettings } from '../dto/repo-settings';
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

  setupDialog(repoSettings: IRepoSettings) {
    $.get("../static/new-release-dialog.html", (dialogTemplate) => {
      let $dialog = $(dialogTemplate);


      let dialog = Dialogs.show(Dialogs.ModalDialog, <Dialogs.IModalDialogOptions>{
        width: 300,
        title: "Create New Release",
        content: $dialog,
        okCallback: (result: string) => {
          this.dataService.createNewFeatureBranch(result, repoSettings.repositoryId)
            .then(response => {
              console.log(response);
            }, err => {
              alert(err.message);
            });
        }
      });

      var dialogElement = dialog.getElement();
      // Monitor input changes
      dialogElement.find('input[type=radio]').click(function (event) {
        let nextVersion = '';

        switch ($(this).val()) {
          case 'major':
            nextVersion = (repoSettings.currentVersionMajor + 1) + '.' + repoSettings.currentVersionMinor + '.' + repoSettings.currentVersionPatch;
            break;
          case 'minor':
            nextVersion = repoSettings.currentVersionMajor + '.' + (repoSettings.currentVersionMinor + 1) + '.' + repoSettings.currentVersionPatch;
            break;
          case 'patch':
            nextVersion = repoSettings.currentVersionMajor + '.' + repoSettings.currentVersionMinor + '.' + (repoSettings.currentVersionPatch + 1);
            break;
        }

        dialogElement.find('#next-version').html(nextVersion);

        // Set dialog result
        dialog.setDialogResult(nextVersion);
        // Update enabled status of ok button
        dialog.updateOkButton(true);
      });

      let nextVersion = (repoSettings.currentVersionMajor + 1) + '.' + repoSettings.currentVersionMinor + '.' + repoSettings.currentVersionPatch;
      dialogElement.find('#next-version').html(nextVersion);

    });

  }
}