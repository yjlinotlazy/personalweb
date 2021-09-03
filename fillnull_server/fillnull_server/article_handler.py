import logging
import uuid
from fastapi import HTTPException
from datetime import datetime
from fillnull_server import sql_client as sql
from fillnull_server import ftp_client as ftp
from fillnull_server.models import (
    CreateArticleRequest,
    CreateArticleResponse,
    GetArticleResponse,
    GetArticlesResponse,
    DeleteArticleResponse,
    UpdateArticleResponse,
    UpdateArticleRequest,
)

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


async def create_article(request: CreateArticleRequest) -> CreateArticleResponse:
    logger.info(request)
    date = datetime.now().strftime("%Y-%m-%d")
    filename = request.filename or uuid.uuid4().hex
    _verify_filename(user=request.user, filename=filename)
    query = f"""
    insert into article (category, title, filename, created, status, user)
    values
    ('{request.category}', '{request.title}', '{filename}', '{date}', 'active', '{request.user}')
    """
    sql.run_query(query, commit=True)

    # Transfer file content
    ftp.transfer_article(
        user=request.user,
        category=request.category,
        content=request.content,
        filename=filename,
    )
    result = _get_article_by_filename(request.user, filename)

    # Attach images
    _attach_images(request.attachments, results[0]["article_id"])
    return CreateArticleResponse(articleId=result[0]["article_id"], filepath=f"{request.user}/{request.category}/{filename}.txt")


async def update_article(request: UpdateArticleRequest):
    """Update article by updating both the db entry and stored file"""
    query = f"""
    update article
    set title = '{request.title}'
    where article_id={request.articleId}
    """
    sql.run_query(query, fetch=False, commit=True)
    print(request.attachments)
    _attach_images(request.attachments, request.articleId)
    article = _get_article_by_id(request.articleId)
    ftp.transfer_article(
        user=article["user"],
        category=article["category"],
        content=request.content,
        filename=article["filename"]
    )
    return UpdateArticleResponse(articleId=request.articleId, filepath=f"{article['user']}/{article['category']}/{article['filename']}.txt")


async def get_articles(category: str, user: str) -> GetArticlesResponse:
    query = f"""
    select * from article
    where category = '{category}'
    and user = '{user}'
    order by created desc, article_id desc
    """
    results = sql.run_query(query, fetch=True, commit=False)
    return GetArticlesResponse(articles=results)


async def get_article(article_id: str) -> GetArticleResponse:
    result = _get_article_by_id(article_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"article {article_id} not found")
    att_query = f"""
    select image_id as imageId, filename
    from image
    where article_id = {article_id}
    """
    att_result = sql.run_query(att_query, fetch=True, commit=False)
    return GetArticleResponse(
        articleId=result["article_id"],
        title=result["title"],
        filename=result["filename"],
        user=result["user"],
        category=result["category"],
        attachments=att_result,
        created=result["created"].strftime("%Y%m%d"),
    )


async def delete_article(article_id: int) -> DeleteArticleResponse:
    query = f"""
    update article
    set status = 'deleted'
    where article_id = {article_id}
    """
    sql.run_query(query, fetch=False, commit=True)
    article = _get_article_by_id(article_id)
    ftp.delete_file(article["user"], article["category"], article["filename"])
    return DeleteArticleResponse(articleId=article_id)


def _attach_images(attachments, article_id) -> None:
    for img in attachments:
        query = f"""
        update image
        set status = 'attached',
        article_id = {article_id}
        where image_id = {img['imageId']}
        """
        sql.run_query(query, fetch=False, commit=True)


def _verify_filename(user, filename):
    result = _get_article_by_filename(user, filename)
    if result:
        raise HTTPException(status_code=400, detail=f"filename {filename} exists for {user}")


def _get_article_by_filename(user: str, filename: str):
    query = f"""
    select *
    from article
    where filename = '{filename}' and user = '{user}'
    """
    return sql.run_query(query, fetch=True, commit=False)


def _get_article_by_id(article_id: int):
    query = f"""
    select *
    from article where article_id = {article_id}
    """
    result = sql.run_query(query, fetch=True, commit=False)
    if result:
        return result[0]
    else:
        return []
