import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { IStateDB } from '@jupyterlab/statedb';

import { requestAPI } from './handler';

/**
 * Initialization data for the @educational-technology-collective/etc_jupyterlab_awareness extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@educational-technology-collective/etc_jupyterlab_awareness:plugin',
  autoStart: true,
  requires: [ISettingRegistry, INotebookTracker, IStateDB],
  activate: async (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null, notebookTracker: INotebookTracker, stateDB: IStateDB) => {
    console.log('JupyterLab extension @educational-technology-collective/etc_jupyterlab_awareness is activated!');

    let env = await requestAPI<any>('get_example');
    console.log('env', env);
    let hub_user = env['os.environ']['JUPYTERHUB_USER'];
    console.log('hub_user', hub_user);

    await app.restored;
    
    let user = stateDB.fetch('hub_user');

    if (!user) {
      stateDB.save('hub_user', hub_user);
      document.cookie = `hub_user=${hub_user}; path='/';`;
    }

    notebookTracker.widgetAdded.connect(async (sender: INotebookTracker, notebookPanel: NotebookPanel) => {

      await notebookPanel.revealed;
      await notebookPanel.sessionContext.ready;

      let hub_user = document?.cookie?.split('; ')?.find(row => row.startsWith('hub_user='))?.split('=')[1]

      console.log('hub_user', hub_user);

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

      (notebookPanel?.content.model?.sharedModel as any).awareness.setLocalStateField('user', { name: hub_user});


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
