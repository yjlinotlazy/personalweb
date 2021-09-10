from fastapi import FastAPI
from mangum import Mangum
from fillnull_server.routes import api
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware


def create_app() -> CORSMiddleware:
    """Create app wrapper to overcome middleware issues."""
    fastapi_app = FastAPI()
    fastapi_app.include_router(api)
    return CORSMiddleware(
        fastapi_app,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app = create_app()

handler = Mangum(app, enable_lifespan=False)
