from fastapi import APIRouter
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

from db.engine import engine
from models.models import Base, BasePublicWithTables


router = APIRouter()


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


@router.get("/bases", response_model=list[BasePublicWithTables])
async def read_bases():
    return model_dump()
