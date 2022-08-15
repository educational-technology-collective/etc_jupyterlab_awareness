import json
import os
import requests

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
from ._version import _fetchVersion


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self, resource):

        try:
            self.set_header('Content-Type', 'application/json')
            
            if resource == 'version':
                self.finish(json.dumps(_fetchVersion()))
            if resource == 'hub_user':
                try:
                    jupyterhub_api_url = os.getenv('JUPYTERHUB_API_URL')
                    token = self.request.headers['authorization']
                    headers = {'authorization': f'{token}', 'accept': 'application/json'}
                    response = requests.get(f'{jupyterhub_api_url}/user', headers=headers)
                    response.raise_for_status()
                    response = response.json()    
                    self.finish(response['name'])
                except Exception as e:
                    self.set_status(404)
                    self.finish(json.dumps(str(e)))
            else:
                self.set_status(404)

        except Exception as e:
            self.set_status(500)
            self.finish(json.dumps(str(e)))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "etc-jupyterlab-awareness", "(.*)")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
