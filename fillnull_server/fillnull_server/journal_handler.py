import logging
import uuid
from fastapi import HTTPException
from datetime import datetime
from fillnull_server import sql_client as sql
from fillnull_server import ftp_client as ftp
from datetime import datetime

from fillnull_server.models import (
    AddTimetableItemRequest,
    AddTimetableItemResponse,
    DeleteTimetableItemResponse,
    CreateJournalResponse,
    UpdateJournalRequest,
    GetJournalResponse,
    GetTimetableItemsResponse,
    AddTodoItemRequest,
    UpdateTodoItemRequest,
    AddTodoItemResponse,
    GetTodoItemsResponse,
    DeleteTodoResponse,
    ToggleTodoResponse,
)


logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

async def get_journal(date: str, user: str) -> GetJournalResponse:
    query = f"""
    select * from journal
    where user = '{user}' and date='{date}'
    """
    results = sql.run_query(query, fetch=True, commit=False)
    if results:
        return GetJournalResponse(journalId=results[0]["journal_id"], journalInfo=results[0])
    else:
        return GetJournalResponse(journalId=-1, journalInfo={})

async def create_journal(date: str, user: str) -> CreateJournalResponse:
    # check existing journal. Return journalId if exists
    existing = await get_journal(date, user)
    if existing.journalInfo:
        return CreateJournalResponse(journalId=existing.journalId)
    else:
        query = f"""
        insert into journal (user, date)
        values
        ('{user}', '{date}')
        """
        sql.run_query(query, commit=True)
    new_entry = await get_journal(date, user)
    return CreateJournalResponse(journalId=new_entry.journalId)


async def get_timetable(journal_id: int) -> GetTimetableItemsResponse:
    query = f"""
    select * from timetable
    where journal_id = {journal_id}
    """
    results = sql.run_query(query, fetch=True)
    return GetTimetableItemsResponse(items=results)

async def add_timetable(request: AddTimetableItemRequest) -> AddTimetableItemResponse:
    query = f"""
    insert into timetable
    (date, time, title, description, user, journal_id)
    values
    ('{request.date}', '{request.time}', '{request.title}',
     '{request.description}', '{request.user}', {request.journalId})
    """
    try:
        sql.run_query(query, commit=True)
        return AddTimetableItemResponse(success=True)
    except Exception as e:
        logger.error(e)
        return AddTimetableItemResponse(False)


async def delete_timetable(timetable_id: int) -> DeleteTimetableItemResponse:
    query = f"""
    delete from timetable
    where timetable_id = {timetable_id}
    """
    try:
        sql.run_query(query, commit=True)
        return DeleteTimetableItemResponse(success=True)
    except Exception as e:
        logger.error(e)
        return DeleteTimetableItemResponse(success=False)


async def get_todos(user: str, journal_id: int) -> GetTodoItemsResponse:
    """Get a list of all incomplete todos, and completed todo for
    the given journalId"""
    query = f"""
    select *
    from todo
    where user = '{user}' and ((completed is null) or (journal_id = {journal_id}))
    order by completed, created
    """
    results = sql.run_query(query, fetch=True)
    return GetTodoItemsResponse(items=results)


async def add_todo(request: AddTodoItemRequest) -> AddTodoItemResponse:
    created = request.created or datetime.now().strftime("%Y-%m-%d")
    query = f"""
    insert into todo
    (created, title, description, user, journal_id, completed)
    values
    ('{created}', '{request.title}', '{request.description}',
    '{request.user}', {request.journalId}, ''
    )
    """
    try:
        sql.run_query(query, commit=True)
        return AddTodoItemResponse(success=True)
    except Exception as e:
        return AddTodoItemResponse(success=False, error=str(e))


async def update_todo(request: UpdateTodoItemRequest) -> AddTodoItemResponse:
    query = f"""
    update todo
    completed = '{request.completed}',
    title='{request.title}'
    description='{request.description}'
    where todo_id = {request.todo_id}
    """
    try:
        sql.run_query(query, commit=True)
        return AddTodoItemResponse(success=True)
    except Exception as e:
        return AddTodoItemResponse(success=False, error=str(e))


async def delete_todo(todo_id: int) -> DeleteTodoResponse:
    query = f"""
    delete from todo
    where todo_id = {todo_id}
    """
    try:
        sql.run_query(query, commit=True)
        return DeleteTodoResponse(success=True)
    except Exception as e:
        return DeleteTodoResponse(success=False, error=str(e))


async def toggle_todo(todo_id: int) -> ToggleTodoResponse:
    query = f"""
    select completed from todo where todo_id = {todo_id}
    """
    result = sql.run_query(query, fetch=True)[0]

    completed = datetime.now().strftime("%Y-%m-%d") if result["completed"] == "0000-00-00" else ""
    print(result, completed, not result["completed"])
    query = f"""
    update todo
    set completed = '{completed}'
    where todo_id = {todo_id}
    """
    sql.run_query(query, commit=True)
    return ToggleTodoResponse(completed=completed)
