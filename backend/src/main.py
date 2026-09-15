from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def root():
    return {"Yo": "peples"}

@app.get("/api/users/get")
def get_user():
    return {"User": "Get"}

@app.get("/api/universities/get")
def get_user():
    return {"universities": "Get"}

@app.get("/api/faculties/get")
def get_user():
    return {"faculties": "Get"}

@app.get("/api/programs/get")
def get_user():
    return {"programs": "Get"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)