import os

from fastapi import APIRouter
from pydantic import BaseModel
from pyairtable import Api

api = Api(os.getenv("AIRTABLE_API"))

router = APIRouter()


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


@router.post("/change")
async def change(item: Change):
    return change_airtable_base(item)
