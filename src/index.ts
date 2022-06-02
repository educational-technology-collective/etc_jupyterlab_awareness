import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { IStateDB } from '@jupyterlab/statedb';

// import { requestAPI } from './handler';

const PLUGIN_ID = '@educational-technology-collective/etc_jupyterlab_awareness:plugin';
/**
 * Initialization data for the @educational-technology-collective/etc_jupyterlab_awareness extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [
    ISettingRegistry, 
    INotebookTracker, 
    IStateDB
  ],
  activate: (
    app: JupyterFrontEnd, 
    settingRegistry: ISettingRegistry | null, 
    notebookTracker: INotebookTracker, 
    stateDB: IStateDB
    ) => {

    (async () => {
      console.log('JupyterLab extension @educational-technology-collective/etc_jupyterlab_awareness is activated!');

      await app.restored;

      console.log('document.cookie1', document.cookie)

      // let env = await requestAPI<any>('get_example');
      // console.log('env', env);

      // let hubUser = env['os.environ']['JUPYTERHUB_USER'];
      // console.log('hub_user', hubUser);

      // if (!document?.cookie?.split('; ')?.find(row => row.startsWith('hub_user='))) {

      //   document.cookie = `hub_user=${hubUser}; domain=mentoracademy.org; path=/; max-age=${60*60*24*365};`;
      // }

      // console.log('document.cookie2', document.cookie);

      notebookTracker.forEach((notebookPanel: NotebookPanel) => {
        console.log('forEach');

        console.log('document.cookie', document.cookie);

        let hubUser = document?.cookie?.split('; ')?.find(row => row.startsWith('hub_user='))?.split('=')[1];

        (notebookPanel?.content.model?.sharedModel as any).awareness.setLocalStateField('user', { name: hubUser });
      });


      notebookTracker.widgetAdded.connect(async (sender: INotebookTracker, notebookPanel: NotebookPanel) => {
        console.log('notebookTracker.widgetAdded');

        await notebookPanel.revealed;
        await notebookPanel.sessionContext.ready;

        console.log('document.cookie', document.cookie);

        let hubUser = document?.cookie?.split('; ')?.find(row => row.startsWith('hub_user='))?.split('=')[1];

        (notebookPanel?.content.model?.sharedModel as any).awareness.setLocalStateField('user', { name: hubUser });

        console.log('hub_user', hubUser);
      });

      notebookTracker.currentChanged.connect(async (sender: INotebookTracker, notebookPanel: NotebookPanel | null) => {
        console.log('notebookTracker.currentChanged')

      })


      notebookTracker.widgetUpdated.connect(async (sender: INotebookTracker, notebookPanel: NotebookPanel) => {
        console.log('notebookTracker.widgetUpdated');

      });

      // requestAPI<any>('get_example')
      //   .then(data => {
      //     console.log('os.getenv()', data);
      //   })
      //   .catch(reason => {
      //     console.error(
      //       `The etc_jupyterlab_awareness server extension appears to be missing.\n${reason}`
      //     );
      //   });

      // console.log(document.cookie);

      // (notebookPanel?.content.model?.sharedModel as any).awareness.setLocalStateField('user', { name: Date.now().toString() });


      // if (settingRegistry) {
      //   settingRegistry
      //     .load(plugin.id)
      //     .then(settings => {
      //       settings.user
      //       console.log('@educational-technology-collective/etc_jupyterlab_awareness settings loaded:', settings.composite);
      //     })
      //     .catch(reason => {
      //       console.error('Failed to load settings for @educational-technology-collective/etc_jupyterlab_awareness.', reason);
      //     });
      // }

    })();
  }
};

export default plugin;
