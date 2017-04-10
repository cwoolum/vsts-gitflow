import { DataService } from '../data-service';
import Dialogs = require("VSS/Controls/Dialogs");

// Can't inport HTML.... need a better solution for template loading
//import dialogTemplate = require('../../static/new-repo-dialog.html!text');

export class NewRepoDialog {
  dataService: DataService;
  constructor() {
    this.dataService = new DataService();
  }

  setupDialog() {

    $.get("../static/new-repo-dialog.html", (dialog) => {
      let $dialog = $(dialog);

      $("#new-repo-btn").click(() => {
        this.buildRepositorySelect($dialog).then(() => {
          this.buildBuildSelect($dialog).then(() => {


            var dialog = Dialogs.show(Dialogs.ModalDialog, <Dialogs.IModalDialogOptions>{
              width: 300,
              title: "Add Repository",
              content: $dialog,
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