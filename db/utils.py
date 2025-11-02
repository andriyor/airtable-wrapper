from sqlalchemy import ClauseElement
from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, select

from db.engine import engine


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


# https://stackoverflow.com/questions/2546207/does-sqlalchemy-have-an-equivalent-of-djangos-get-or-create
def get_or_create(session, model, defaults=None, **kwargs):
    statement = select(model).filter_by(**kwargs)
    instance = session.exec(statement).one_or_none()
    if instance:
        return instance, False
    else:
        params = {k: v for k, v in kwargs.items() if not isinstance(v, ClauseElement)}
        params.update(defaults or {})
        instance = model(**params)
        try:
            session.add(instance)
            session.commit()
        except (
            Exception
        ):  # The actual exception depends on the specific database so we catch all exceptions. This is similar to the official documentation: https://docs.sqlalchemy.org/en/latest/orm/session_transaction.html
            session.rollback()
            statement = select(model).filter_by(**kwargs)
            instance = session.exec(statement).one_or_none()
            return instance, False
        else:
            return instance, True
