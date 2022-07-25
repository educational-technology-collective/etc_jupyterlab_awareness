import json
import os

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
        # self.finish(json.dumps({
        #     "data": "This is /etc-jupyterlab-awareness/get_example endpoint!"
        # }))

        try:
            self.set_header('Content-Type', 'application/json')
            
            if resource == 'version':
                self.finish(json.dumps(_fetchVersion()))
            elif resource == 'config':
                self.finish(json.dumps(self.config))
            elif resource == 'environ':
                self.finish(json.dumps({k:v for k, v in os.environ.items()}))
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
