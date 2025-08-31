FROM python:3.9
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /code

COPY . /code

RUN uv sync --locked

CMD ["uv", "run",  "fastapi", "run", "main.py", "--port", "80"]
