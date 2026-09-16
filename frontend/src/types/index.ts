export type Degree = "bachelor" | "specialist" | "master" | "postgraduate";

export type StudyForm = "full-time" | "part-time" | "evening" | "online";

export type ApplicationStatus =
  "draft" | "submitted" | "under-review" | "invited" | "enrolled" | "rejected";

export interface Faculty {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  about: string;
}

export interface Program {
  id: string;
  slug: string;
  name: string;
  about: string;
  degree: Degree;
  form: StudyForm;
  durationYears: number;
  budgetPlaces: number;
  paidPlaces: number;
  tuitionPerYear: number;
  minScore: number;
  deadline: string;
  languages: string[];
  exams: string[];
  career: string[];
  universityId: string;
  facultyId: string;
}

export interface University {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  logo?: string;
  city: string;
  founded: number;
  ranking: number;
  rating: number;
  students: number;
  about: string;
  tags: string[];
  website: string;
  facultyIds: string[];
}

export interface Diploma {
  id: string;
  typeId: number;
  typeName: string;
  name: string;
  institution: string;
  year: number;
  averageScore: number | null;
}

export interface Achievement {
  id: string;
  name: string;
  category: string | null;
}

export interface DiplomaType {
  id: number;
  name: string;
}

export interface UserProfile {
  id: string;
  isAdmin: boolean;
  email: string;
  phone: string | null;
  region: string | null;
  education: string | null;
  fullName: {
    last: string;
    first: string;
    middle: string | null;
  };
  diplomas: Diploma[];
  achievements: Achievement[];
}

export interface ProgramRecommendation {
  program: ProgramWithContext;
  score: number;
  reasons: string[];
}

export interface ApplicationProgramNode {
  id: string;
  programSlug: string;
  programName: string;
  status: ApplicationStatus;
  priority: number;
  submittedAt: string;
}

export interface ApplicationFacultyNode {
  id: string;
  facultySlug: string;
  facultyName: string;
  programs: ApplicationProgramNode[];
}

export interface ApplicationUniversityNode {
  id: string;
  universitySlug: string;
  universityName: string;
  universityShortName: string;
  city: string;
  faculties: ApplicationFacultyNode[];
}

export interface ProgramWithContext extends Program {
  university: University;
  faculty: Faculty;
}
