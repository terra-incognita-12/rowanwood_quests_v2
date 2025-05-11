FROM python:3.12

WORKDIR /backend

COPY backend/requirements.txt ./requirements.txt

RUN apt-get update && apt-get install -y netcat-openbsd

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

COPY backend/ .

ENTRYPOINT ["sh", "./entrypoint.sh"]