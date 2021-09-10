from fastapi import APIRouter
from starlette.responses import JSONResponse
from fillnull_server.misc import misc_router
from fillnull_server.article_activities import article_router
from fillnull_server.image_activities import image_router


api = APIRouter(default_response_class=JSONResponse)
api.include_router(misc_router, prefix="/misc")
api.include_router(article_router, prefix="/article")
api.include_router(image_router, prefix="/image")
