FROM jupyter/scipy-notebook:latest

ARG JUPYTERHUB_VERSION=1.4.2

RUN pip3 install --no-cache jupyterhub==$JUPYTERHUB_VERSION

RUN pip3 install jupyterlab-link-share

ARG DATE

COPY etc_jupyterlab_awareness /tmp/etc_jupyterlab_awareness

RUN python3 -m pip install /tmp/etc_jupyterlab_awareness/dist/etc_jupyterlab_awareness-0.1.0.tar.gz

CMD ["jupyter-labhub"]