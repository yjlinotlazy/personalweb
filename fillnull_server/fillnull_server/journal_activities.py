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

@journal_router.delete("/todo/{todo_id}", operation_id="deleteTodoItem", response_model=DeleteTodoResponse)
async def delete_todo(todo_id: int):
    return await handler.delete_todo(todo_id)


@journal_router.get("/todo/{user}/{journal_id}", operation_id="getTodos", response_model=GetTodoItemsResponse)
async def get_todos(user: str, journal_id: int):
    return await handler.get_todos(user, journal_id)


@journal_router.post("/todo/create", operation_id="addTodo", response_model=AddTodoItemResponse)
async def add_todo(request: AddTodoItemRequest):
    return await handler.add_todo(request)


@journal_router.post("/todo/update", operation_id="updateTodo", response_model=AddTodoItemResponse)
async def update_todo(todo_id, request: UpdateTodoItemRequest):
    return await handler.update_todo(todo_id, request)

@journal_router.post("/todo/toggle/{todo_id}", operation_id="switchTodo", response_model=ToggleTodoResponse)
async def switch_todo(todo_id: int):
    return await handler.toggle_todo(todo_id)
