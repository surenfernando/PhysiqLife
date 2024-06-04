from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class Workout(BaseModel):
    type: str
    duration: int

class Cardio(BaseModel):
    type: str
    duration: int

class Goals(BaseModel):
    short_term: str
    long_term: str

class Daily(BaseModel):
    date: date
    weight: float
    calories: int
    workout: Workout
    cardio: Cardio
    comment: Optional[str]

class Weekly(BaseModel):
    date: date
    workouts: List[Workout]
    cheat_meals: int
    cardio: List[Cardio]
    image: Optional[str]
    comment: Optional[str]
    daily_check: List[Daily]

class Client(BaseModel):
    first_name: str
    middle_names: Optional[List[str]]
    last_name: Optional[str]
    preferred_name: Optional[str]
    dob: date
    username: str
    image: Optional[str]
    daily_check_ins: List[Daily]
    weekly_check_ins: List[Weekly]
    goals: Goals
