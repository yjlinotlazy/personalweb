from fillnull_server.models import (
    CreateArticleRequest,
    CreateArticleResponse,
    DeleteArticleResponse,
    GetArticlesResponse,
    GetArticleResponse,
    UpdateArticleRequest,
    UpdateArticleResponse,
)
from fillnull_server import article_handler as handler
from fastapi import APIRouter

article_router = APIRouter()

@article_router.post("/create", operation_id="createArticle", response_model=CreateArticleResponse)
async def create_article(request: CreateArticleRequest):
    return await handler.create_article(request)


@article_router.get("/{article_id}", operation_id="getArticle", response_model=GetArticleResponse)
async def get_article(article_id: str):
    return await handler.get_article(article_id=article_id)


@article_router.post("/update", operation_id="updateArticle", response_model=UpdateArticleResponse)
async def update_article(request: UpdateArticleRequest):
    return await handler.update_article(request)


@article_router.get("/category/{user}/{category}", operation_id="getArticles", response_model=GetArticlesResponse)
async def get_articles(category: str, user: str):
    return await handler.get_articles(category=category, user=user)


@article_router.get("/delete/{article_id}", operation_id="deleteArticle", response_model=DeleteArticleResponse)
async def delete_article(article_id: int):
    return await handler.delete_article(article_id)
