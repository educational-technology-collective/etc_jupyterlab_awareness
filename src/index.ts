import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

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
      console.log('JupyterLab extension @educational-technology-collective/etc_jupyterlab_awareness is activated!');

      await app.restored;

      async function setAwareness(notebookPanel: NotebookPanel) {

        await notebookPanel.revealed;
        await notebookPanel.sessionContext.ready;

        let hubUser = document?.cookie?.split('; ')?.find(row => row.startsWith('hub_user='))?.split('=')[1];

        (notebookPanel?.content.model?.sharedModel as any).awareness.setLocalStateField('user', { name: hubUser });
      }

      notebookTracker.forEach((notebookPanel: NotebookPanel) => {

        setAwareness(notebookPanel);
      });

      notebookTracker.widgetAdded.connect(async (sender: INotebookTracker, notebookPanel: NotebookPanel) => {

        setAwareness(notebookPanel);
      });

    })();
  }
};

export default plugin;
