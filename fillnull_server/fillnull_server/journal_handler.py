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
