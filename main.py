import os

from dotenv import load_dotenv
from pyairtable import Api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session, select
from sqlalchemy.orm import selectinload

from models.models import Base, BasePublicWithTables

load_dotenv()

api = Api(os.getenv("AIRTABLE_API"))

engine = create_engine("sqlite:///database.db")

SQLModel.metadata.create_all(engine)


def model_dump():
    with Session(engine) as session:
        statement = select(Base).options(selectinload(Base.tables))
        results = session.exec(statement).all()
        resp = []
        for base in results:
            json_base = base.model_dump(by_alias=True)
            json_base["tables"] = [
                table.model_dump(by_alias=True) for table in base.tables
            ]
            resp.append(json_base)

        return resp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/bases", response_model=list[BasePublicWithTables])
async def read_bases():
    return model_dump()
