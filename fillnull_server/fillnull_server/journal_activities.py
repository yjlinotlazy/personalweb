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

from fillnull_server import journal_handler as handler
from fastapi import APIRouter

journal_router = APIRouter()

@journal_router.get("/calender/{user}/{date}", operation_id="getJournal", response_model=GetJournalResponse)
async def get_journal(date: str, user: str):
    return await handler.get_journal(user=user, date=date)

@journal_router.post("/calender/{user}/{date}", operation_id="createJournal", response_model=CreateJournalResponse)
async def create_journal(date: str, user: str):
    return await handler.create_journal(date=date, user=user)

@journal_router.get("/timetable/{journal_id}", operation_id="getTimetable", response_model=GetTimetableItemsResponse)
async def get_timetable(journal_id: int):
    return await handler.get_timetable(journal_id)

@journal_router.post("/timetable", operation_id="addTimetable", response_model=AddTimetableItemResponse)
async def add_timetable(request: AddTimetableItemRequest):
    return await handler.add_timetable(request)

@journal_router.delete("/timetable/{timetable_id}", operation_id="deleteTimetable", response_model=DeleteTimetableItemResponse)
async def delete_timetable(timetable_id: int):
    return await handler.delete_timetable(timetable_id)
