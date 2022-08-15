import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import * as ymodels from '@jupyterlab/shared-models';

import { requestAPI } from "./handler";

const PLUGIN_ID = '@educational-technology-collective/etc_jupyterlab_awareness:plugin';
/**
 * Initialization data for the @educational-technology-collective/etc_jupyterlab_awareness extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [
    INotebookTracker
  ],
  activate: (
    app: JupyterFrontEnd,
    notebookTracker: INotebookTracker
  ) => {

    (async () => {

      try {

        const VERSION = await requestAPI<string>("version")

        console.log(`${PLUGIN_ID}, ${VERSION}`);

        const hubName = await requestAPI<string>("hub_user")

        async function setAwareness(notebookPanel: NotebookPanel) {

          await notebookPanel.revealed;
          await notebookPanel.sessionContext.ready;
    
          ((notebookPanel.content.model?.sharedModel as unknown) as ymodels.YDocument<any>).awareness.setLocalStateField('user', hubName);
        }

        await app.restored;

        notebookTracker.forEach((notebookPanel: NotebookPanel) => {

          setAwareness(notebookPanel);
        });

        notebookTracker.widgetAdded.connect(async (sender: INotebookTracker, notebookPanel: NotebookPanel) => {

          setAwareness(notebookPanel);
        });

      }
      catch (e) {
        console.error(e);
      }
    })();
  }
};

export default plugin;
