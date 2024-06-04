from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI

def init_db(app: FastAPI):
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    app.mongodb_client = client
    app.mongodb = client["yourdbname"]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
