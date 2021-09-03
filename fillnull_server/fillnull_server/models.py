from pydantic import BaseModel
from typing import Dict, List

class PingResponse(BaseModel):
    pong: bool = True


class AuthenticationResponse(BaseModel):
    code: int


class CreateArticleRequest(BaseModel):
    category: str = "words"
    title: str
    filename: str = None
    content: str
    attachments: List = []
    user: str


class CreateArticleResponse(BaseModel):
    articleId: int
    filepath: str

class UpdateArticleRequest(BaseModel):
    articleId: int
    title: str
    content: str
    attachments: List = []


class UpdateArticleResponse(CreateArticleResponse):
    pass


class DeleteArticleResponse(BaseModel):
    articleId: int


class GetArticleResponse(BaseModel):
    articleId: str
    title: str
    filename: str
    user: str
    category: str
    created: str
    attachments: List

    class Config:
        orm_mode = True


class GetArticlesResponse(BaseModel):
    articles: List[Dict]


class UploadImageRequest(BaseModel):
    user: str
    filename: str
    content: str
    fileType: str


class UploadImageResponse(BaseModel):
    imageId: int
    filename: str


class DeleteImagesRequest(BaseModel):
    user: str
    images: List


class DeleteImagesResponse(BaseModel):
    images: List
