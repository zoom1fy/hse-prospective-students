from app.models.references import EducationLevel, Region, TypeStudy
from app.models.user import User
from app.models.university import University
from app.models.faculty import Faculty
from app.models.program import Program
from app.models.exam import Exam, ProgramExam, UserExam
from app.models.achievement import Achievement, AchievementCategory
from app.models.diploma import Diploma, DiplomaType
from app.models.statement import Statement, StatementStatus
from app.models.favorite import UserProgram
from app.models.recommendation import RecommendationProgramUser
from app.models.comparison import Comparison

__all__ = [
    "User",
    "Region",
    "University",
    "Faculty",
    "Program",
    "Exam",
    "ProgramExam",
    "UserExam",
    "Achievement",
    "AchievementCategory",
    "Diploma",
    "DiplomaType",
    "TypeStudy",
    "EducationLevel",
    "Statement",
    "StatementStatus",
    "UserProgram",
    "RecommendationProgramUser",
    "Comparison",
]
