from fastapi import APIRouter, Depends, HTTPException
from ..database import get_db
from .models import Client, Daily, Weekly
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List

router = APIRouter()

@router.post("/clients/", response_model=Client)
async def create_client(client: Client, db: AsyncIOMotorClient = Depends(get_db)):
    result = await db["clients"].insert_one(client.dict())
    if result.inserted_id:
        client.id = str(result.inserted_id)
        return client
    raise HTTPException(status_code=400, detail="Client creation failed")

@router.get("/clients/", response_model=List[Client])
async def read_clients(skip: int = 0, limit: int = 10, db: AsyncIOMotorClient = Depends(get_db)):
    clients = await db["clients"].find().skip(skip).limit(limit).to_list(length=limit)
    return clients

@router.get("/clients/{client_id}", response_model=Client)
async def read_client(client_id: str, db: AsyncIOMotorClient = Depends(get_db)):
    client = await db["clients"].find_one({"_id": client_id})
    if client:
        return client
    raise HTTPException(status_code=404, detail="Client not found")

@router.put("/clients/{client_id}", response_model=Client)
async def update_client(client_id: str, client: Client, db: AsyncIOMotorClient = Depends(get_db)):
    result = await db["clients"].update_one({"_id": client_id}, {"$ &#8203;:citation[oaicite:0]{index=0}&#8203"})
