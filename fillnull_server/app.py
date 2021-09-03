import logging

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

from fillnull_server.app import handler
