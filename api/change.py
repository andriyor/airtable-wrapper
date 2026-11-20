import os

from fastapi import APIRouter
from pydantic import BaseModel
from pyairtable import Api

from api.base import SessionDep
from db.utils import get_or_create
from models.models import Base, Table
from move import copy_table
from sqlmodel import delete

API_KEY = os.getenv("AIRTABLE_API", "")
api = Api(API_KEY)

router = APIRouter()


class Change(BaseModel):
    sourceBaseAirtableId: str
    sourceTableId: int
    sourceTableName: str
    destinationBaseId: int
    destinationBaseAirtableId: str


def change_airtable_base(item: Change):
    copy_table(api, item.sourceBaseAirtableId, item.sourceTableName, item.destinationBaseAirtableId)


def update_table(item: Change, session: SessionDep):
    source_table = session.get(Table, item.sourceTableId)
    source_table.base_id = item.destinationBaseId
    session.commit()
    session.refresh(source_table)


@router.post("/change")
async def change(item: Change, session: SessionDep):
    update_table(item, session)
    change_airtable_base(item)
    return


@router.post("/refetch")
def refetch(session: SessionDep):
    # TODO: check this
    session.exec(delete(Base))
    session.exec(delete(Table))
    session.commit()

    for airtable_base in api.bases():
        sql_base, _exist = get_or_create(
            session,
            Base,
            name=airtable_base.name,
            base_id=airtable_base.id,
        )

        for airtable_table in airtable_base.tables():
            get_or_create(
                session,
                Table,
                name=airtable_table.name,
                base_id=sql_base.id,
                table_id=airtable_table.id,
            )

    return
