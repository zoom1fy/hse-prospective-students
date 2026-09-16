FROM python:3.13.15-alpine3.24


WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# CMD ["/bin/sh"]
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# ENTRYPOINT ["/entrypoint.sh"]

# CMD ["/bin/sh"]
ENV PYTHONPATH=/app

CMD ["sh", "-c", "export PYTHONPATH=$PYTHONPATH:. && uvicorn app.main:app --host 0.0.0.0 --port 8000"]