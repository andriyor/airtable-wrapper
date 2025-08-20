import os

from dotenv import load_dotenv
from pyairtable import Api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session, select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

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


class Change(BaseModel):
    sourceBaseId: str
    sourceTableName: str
    destinationBaseId: str


def change_airtable_base(item: Change):
    ƒromTable = api.table(item.sourceBaseId, item.sourceTableName)
    fields = ƒromTable.schema().fields
    serializedFields = [{"name": field.name, "type": field.type} for field in fields]

    toBase = api.base(item.destinationBaseId)
    createdTable = toBase.create_table(ƒromTable.name, fields=serializedFields)
    createdTable.batch_create([record["fields"] for record in ƒromTable.all()])


@app.post("/change")
async def change(item: Change):
    return change_airtable_base(item)
