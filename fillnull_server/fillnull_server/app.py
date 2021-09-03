from fastapi import FastAPI
from mangum import Mangum
from fillnull_server.routes import api
from starlette.middleware.cors import CORSMiddleware
app = FastAPI(title="Website Server")

origins = [
    "http://0.0.0.0:3000",
    "http://localhost:3000",
    "http://0.0.0.0:8000",
    "http://localhost:8000",
    "http://demo.fillnull.com",
    "http://fillnull.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api)

@app.get("/")
async def main():
    return {"message": "Hello World"}


handler = Mangum(app, enable_lifespan=False)
