import os
from distutils.core import setup

with open('requirements.txt') as f:
    required_pkgs = f.read().splitlines()

setup (
    name="fillnull_server",
    version="0.1",
    packages=["fillnull_server"],
    install_requires=required_pkgs,
    entry_points={},
)
