from fastapi import APIRouter
from sqlalchemy.orm import selectinload
from sqlmodel import select

from db.utils import SessionDep
from models.models import (
    Base,
    BasePublicWithTables,
    Table,
    TablePublicWithBase,
)

router = APIRouter()

@router.get("/bases", response_model=list[BasePublicWithTables])
async def read_bases(session: SessionDep):
    statement = select(Base).options(selectinload(Base.tables))
    results = session.exec(statement).all()
    resp = []
    for base in results:
        json_base = base.model_dump(by_alias=True)
        json_base["tables"] = [table.model_dump(by_alias=True) for table in base.tables]
        resp.append(json_base)

    return resp


@router.get("/tables")
def read_tables(session: SessionDep) -> list[TablePublicWithBase]:
    statement = select(Table).options(selectinload(Table.base))
    tables = session.exec(statement).all()
    return tables
