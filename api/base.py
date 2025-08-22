from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

from db.engine import engine
from models.models import (
    Base,
    BasePublicWithTables,
    Table,
    TablePublicWithBase,
)


router = APIRouter()


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


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


@router.get("/tables/")
def read_tables(session: SessionDep) -> list[TablePublicWithBase]:
    statement = select(Table).options(selectinload(Table.base))
    tables = session.exec(statement).all()
    return tables
