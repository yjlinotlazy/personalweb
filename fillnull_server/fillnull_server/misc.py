from fillnull_server.models import PingResponse, AuthenticationResponse
from fastapi import APIRouter
from fillnull_server import sql_client as sql

misc_router = APIRouter()

@misc_router.get("/ping", operation_id="ping", response_model=PingResponse)
def ping():
    return PingResponse(pong=True)


@misc_router.get("/{user_id}", operation_id="getUserCode", response_model=AuthenticationResponse)
def get_user(user_id: str):
    query = f"""
    select code
    from user
    where user_id = '{user_id}'
    """
    result = sql.run_query(query, fetch=True, commit=False)
    return AuthenticationResponse(code=result[0].get("code", -1))
