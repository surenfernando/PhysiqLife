from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .crud import models, views
from .database import init_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db(app)

app.include_router(views.router)
