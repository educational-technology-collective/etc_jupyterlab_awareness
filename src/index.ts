import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { requestAPI } from './handler';

/**
 * Initialization data for the @educational-technology-collective/etc_jupyterlab_awareness extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@educational-technology-collective/etc_jupyterlab_awareness:plugin',
  autoStart: true,
  optional: [ISettingRegistry, INotebookTracker],
  activate: async (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null, notebookTracker: INotebookTracker,) => {
    console.log('JupyterLab extension @educational-technology-collective/etc_jupyterlab_awareness is activated!');

    notebookTracker.widgetAdded.connect(async (sender: INotebookTracker, notebookPanel: NotebookPanel) => {

      await notebookPanel.revealed;
      await notebookPanel.sessionContext.ready;

      requestAPI<any>('get_example')
        .then(data => {
          console.log('os.getenv()', data);
        })
        .catch(reason => {
          console.error(
            `The etc_jupyterlab_awareness server extension appears to be missing.\n${reason}`
          );
        });

      console.log(document.cookie);

      (notebookPanel?.content.model?.sharedModel as any).awareness.setLocalStateField('user', { name: Date.now().toString() });
      
    });

    notebookTracker.currentChanged.connect(async (sender: INotebookTracker, notebookPanel: NotebookPanel | null) => {


    })

    // if (settingRegistry) {
    //   settingRegistry
    //     .load(plugin.id)
    //     .then(settings => {
    //       console.log('@educational-technology-collective/etc_jupyterlab_awareness settings loaded:', settings.composite);
    //     })
    //     .catch(reason => {
    //       console.error('Failed to load settings for @educational-technology-collective/etc_jupyterlab_awareness.', reason);
    //     });
    // }



  }
};

export default plugin;
