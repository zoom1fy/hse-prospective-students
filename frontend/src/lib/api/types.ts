export interface ApiToken {
  access_token: string;
  token_type: string;
}

export interface ApiDiplomaType {
  id: number;
  name: string;
}

export interface ApiDiploma {
  id: number;
  id_user: number;
  id_diploma_type: number;
  type_name: string;
  name: string;
  institution: string;
  year: number;
  average_score: number | null;
  created_at: string;
}

export interface ApiAchievement {
  id: number;
  id_user: number;
  name: string;
  id_category: number;
  category_name: string;
}

export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  email: string;
  is_admin: boolean;
  education: string | null;
  id_region: number | null;
  diplomas: ApiDiploma[];
  achievements: ApiAchievement[];
}

export interface ApiReference {
  id: number;
  name: string;
}

export interface ApiMaterialSection {
  heading: string;
  paragraphs: string[];
}

export interface ApiMaterial {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  read_time: string;
  is_published: boolean;
  sections: ApiMaterialSection[];
  created_at: string;
  updated_at: string;
}

export interface ApiMaterialInput {
  slug: string;
  title: string;
  description: string;
  icon: string;
  read_time: string;
  is_published: boolean;
  sections: ApiMaterialSection[];
}

export interface ApiAdminStatement {
  id: number;
  id_user: number;
  user_name: string;
  id_program: number;
  program_name: string;
  id_status: number;
  status_name: string;
  created_at: string;
  updated_at: string;
}

export interface ApiUniversityInput {
  name: string;
  email?: string | null;
  short_name?: string | null;
  description?: string | null;
  official_url?: string | null;
  logo?: string | null;
  id_region: number;
}

export interface ApiFacultyInput {
  name: string;
  short_name?: string | null;
  official_url?: string | null;
  id_university: number;
}

export interface ApiProgramInput {
  name: string;
  code: string;
  description?: string | null;
  official_url?: string | null;
  duration_years: number;
  budget_places: number;
  paid_places: number;
  tuition_price?: number | null;
  is_active: boolean;
  id_type_study: number;
  id_education_level: number;
  id_faculty: number;
}

export interface ApiDiplomaCreate {
  id_diploma_type: number;
  name: string;
  institution: string;
  year: number;
  average_score: number | null;
}

export interface ApiUserUpdate {
  first_name?: string;
  last_name?: string;
  patronymic?: string | null;
  email?: string;
  education?: string | null;
  id_region?: number | null;
}

export interface ApiUniversity {
  id: number;
  name: string;
  short_name: string | null;
  description: string | null;
  official_url: string | null;
  email: string | null;
  logo: string | null;
  id_region: number;
}

export interface ApiFaculty {
  id: number;
  name: string;
  short_name: string | null;
  official_url: string | null;
  id_university: number;
}

export interface ApiProgram {
  id: number;
  name: string;
  code: string;
  description: string | null;
  official_url: string | null;
  duration_years: number;
  budget_places: number;
  paid_places: number;
  tuition_price: string | null;
  is_active: boolean;
  id_type_study: number;
  id_education_level: number;
  id_faculty: number;
}

export interface ApiExam {
  id: number;
  name: string;
}

export interface ApiStatement {
  id: number;
  id_user: number;
  id_program: number;
  id_status: number;
  created_at: string;
  updated_at: string;
}

export interface ApiStatementTreeProgram {
  id: number;
  name: string | null;
  official_url: string | null;
  status: string;
}

export interface ApiStatementTreeFaculty {
  id: number;
  name: string;
  official_url: string | null;
  programs: ApiStatementTreeProgram[];
}

export interface ApiStatementTreeUniversity {
  id: number;
  name: string;
  official_url: string | null;
  faculties: ApiStatementTreeFaculty[];
}

export interface ApiStatementTreeResponse {
  universities: ApiStatementTreeUniversity[];
}

export interface ApiRecommendation {
  id: number;
  id_user: number;
  id_program: number;
  rank: number;
  explanation: string | null;
  created_at: string;
}

export interface ApiComparison {
  id: number;
  id_user: number;
  id_program_1: number;
  id_program_2: number;
  selected_program_id: number;
  explanation: string | null;
  created_at: string;
}