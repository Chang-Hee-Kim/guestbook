FROM python:3.9-slim-buster

WORKDIR /app/backend

COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

COPY templates/ /app/templates/

EXPOSE 5001

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:${PORT}"]
