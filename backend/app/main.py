from fastapi import FastAPI

from app.api.routers import (
    users,
    universities,
    faculties,
    programs,
    exams,
    statements,
    recommendations,
    comparisons,
)


app = FastAPI(
    title="HSE Prospective Students API",
    version="1.0.0",
)

app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(universities.router, prefix="/api/universities", tags=["Universities"])
app.include_router(faculties.router, prefix="/api/faculties", tags=["Faculties"])
app.include_router(programs.router, prefix="/api/programs", tags=["Programs"])
app.include_router(exams.router, prefix="/api/exams", tags=["Exams"])
app.include_router(statements.router, prefix="/api/statements", tags=["Statements"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(comparisons.router, prefix="/api/comparisons", tags=["Comparisons"])


@app.get("/")
async def root():
    return {"message": "HSE Prospective Students API"}


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
