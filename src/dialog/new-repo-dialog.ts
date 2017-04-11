import { DataService } from '../data-service';
import Dialogs = require("VSS/Controls/Dialogs");

interface SaveRepoConfig {
  repositoryId: string;
  currentVersionMajor: number;
  currentVersionMinor: number;
  currentVersionPatch: number;
  repoName: string;
}

export class NewRepoDialog {
  dataService: DataService;
  constructor() {
    this.dataService = new DataService();
  }

  setupDialog() {

    $("#new-repo-btn").click(() => {
      $.get("../static/new-repo-dialog.html", (dialog) => {
        let $dialog = $(dialog);

        this.buildRepositorySelect($dialog).then(() => {
          //this.buildBuildSelect($dialog).then(() => {
          var dialog = Dialogs.show(Dialogs.ModalDialog, <Dialogs.IModalDialogOptions>{
            width: 300,
            title: "Add Repository",
            content: $dialog,
            okCallback: (result: SaveRepoConfig) => {
              this.dataService.fetchConfiguredRepos().then(repoList => {
                repoList[result.repositoryId] = {
                  repoId: result.repositoryId,
                  repoName: result.repoName,
                  currentVersion: result.currentVersionMajor + '.' + result.currentVersionMinor + '.' + result.currentVersionPatch
                };

                this.dataService.saveConfigurationForRepository(result.repositoryId, {
                  repositoryId: result.repositoryId,
                  currentVersionMajor: result.currentVersionMajor,
                  currentVersionMinor: result.currentVersionMinor,
                  currentVersionPatch: result.currentVersionPatch
                }).then(() => this.dataService.saveConfiguredRepos(repoList));
              });
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
          //});
        });

        function isEmpty(parent: JQuery): boolean {
          let inputsFilled = parent.find("input").filter((index: number, el: Element) => {
            return !$(el).val();
          }).length > 0;

          let repoEmpty = parent.find('.repository-select').val() == undefined ||
            parent.find('.repository-select').val() == '';

          return inputsFilled || repoEmpty;
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

  private buildRepositorySelect(template: JQuery) {
    let sel = template.find('.repository-select')

    return this.dataService.getAllRepositories().then(response => {
      response.forEach(repo => {
        sel.append($("<option>").attr('value', repo.id).text(repo.name));
      });
    });
  }

  private buildBuildSelect(template: JQuery) {
    let sel = template.find('.build-select')

    return this.dataService.getAllBuildDefinitions().then(response => {
      response.forEach(build => {
        sel.append($("<option>").attr('value', build.id).text(build.name));
      });
    });
  }
}