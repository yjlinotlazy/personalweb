from fillnull_server.models import (
    DeleteImagesRequest,
    DeleteImagesResponse,
    UploadImageRequest,
    UploadImageResponse,
)
from fillnull_server import image_handler as handler
from fastapi import APIRouter, Request

image_router = APIRouter()


@image_router.post("/upload", operation_id="uploadImage", response_model=UploadImageResponse)
async def upload_image(request: Request):
    return await handler.upload_image(request)


@image_router.post("/delete", operation_id="deleteImages", response_model=DeleteImagesResponse)
async def delete_images(request: DeleteImagesRequest):
    return await handler.delete_images(request)
