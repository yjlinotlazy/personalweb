from fillnull_server.models import (
    DeleteImagesRequest,
    DeleteImagesResponse,
    UploadImageRequest,
    UploadImageResponse,
)
from datetime import datetime
from fillnull_server import sql_client as sql
from fillnull_server import ftp_client as ftp
from fastapi import HTTPException


async def upload_image(request):
    headers = _parse_headers(request["headers"])
    user = headers["user"]
    file_type = headers["type"]
    extension = file_type.split("/")[-1]
    filename = f"{headers['name']}.{extension}"
    contents = await _retrieve_bytes(request._receive)
    # Upload via FTP
    ftp.transfer_image(user, contents, filename)

    # Create database entry
    date = datetime.now().strftime("%Y-%m-%d")
    query = f"""
    insert into image (user, filename, status, uploaded, filetype)
    values
    ('{user}', '{filename}', 'detached', '{date}', '{extension}')
    """
    sql.run_query(query, commit=True, fetch=False)
    entry = _get_image_by_filename(user, filename)[0]
    return UploadImageResponse(imageId=entry["image_id"], filename=filename)

async def delete_images(request: DeleteImagesRequest) -> DeleteImagesResponse:
    if not request.images:
        return DeleteImagesResponse(images=[])
    delete_list = [str(img["imageId"]) for img in request.images]
    condition = f"image_id in ({','.join(delete_list)})"
    # Remove from database
    query = f"""
    delete from `image`
    where {condition};
    """
    sql.run_query(query, commit=True, fetch=False)
    # Remove from ftp
    ftp.delete_images(request.user, [img["filename"] for img in request.images])


async def _retrieve_bytes(callback):
    contents = None
    has_more = True
    while has_more:
        received = await callback()
        if not contents:
            contents = received["body"]
        else:
            contents += received["body"]
        has_more = received["more_body"]
    return contents


def _parse_headers(headers):
    d = {}
    for item in headers:
        try:
            d[item[0].decode("utf-8")] = item[1].decode("utf-8")
        except Exception:
            pass
    return d


def _get_image_by_filename(user: str, filename: str):
    query = f"""
    select *
    from image
    where filename = '{filename}' and user = '{user}'
    """
    return sql.run_query(query, fetch=True, commit=False)
