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
  type: "school" | "bachelor" | "specialist" | "master" | "postgraduate";
  title: string;
  institution: string;
  year: number;
  averageScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  level: "international" | "national" | "regional" | "university";
  year: number;
  points: number;
}

export interface OtherEducation {
  id: string;
  title: string;
  institution: string;
  year: number;
}

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  fullName: {
    last: string;
    first: string;
    middle: string;
  };
  passport: {
    series: string;
    number: string;
    issuedBy: string;
    issuedAt: string;
    departmentCode: string;
  };
  snils: string;
  education: OtherEducation[];
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
