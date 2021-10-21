from pydantic import BaseModel
from typing import Dict, List

class PingResponse(BaseModel):
    pong: bool = True


class AuthenticationResponse(BaseModel):
    code: int


class CreateArticleRequest(BaseModel):
    category: str = "words"
    subcategoryId: str
    title: str
    filename: str = None
    thumb: str = None
    content: str
    attachments: List = []
    user: str
    created: str = None


class CreateArticleResponse(BaseModel):
    articleId: int
    filepath: str

class UpdateArticleRequest(BaseModel):
    articleId: int
    title: str
    content: str
    thumb: str = None
    subcategoryId: str
    attachments: List = []
    created: str = None


class UpdateArticleResponse(CreateArticleResponse):
    pass


class DeleteArticleResponse(BaseModel):
    articleId: int


class GetSubCategoriesResponse(BaseModel):
    subcategories: List


class GetArticleResponse(BaseModel):
    articleId: str
    title: str
    filename: str
    user: str
    thumb: str = None
    category: str
    subcategoryId: str
    created: str
    attachments: List

    class Config:
        orm_mode = True


class GetArticlesResponse(BaseModel):
    articles: List[Dict]
    subcategories: List


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


class GetJournalResponse(BaseModel):
    journalId: int
    journalInfo: Dict = None


class CreateJournalResponse(BaseModel):
    journalId: int


class UpdateJournalRequest(BaseModel):
    journalId: int


class AddTimetableItemRequest(BaseModel):
    journalId: int
    date: str
    time: str
    title: str
    description: str = None
    user: str


class AddTimetableItemResponse(BaseModel):
    success: bool


class DeleteTimetableItemResponse(BaseModel):
    success: bool


class GetTimetableItemsResponse(BaseModel):
    items: List[Dict] = []
