FROM python:alpine

COPY requirements.txt /app/

RUN pip3 install  --no-cache-dir -r /app/requirements.txt

COPY ./ /app/web
WORKDIR /app/web

EXPOSE 3000

CMD gunicorn -b :8000 app:app