import { ROLE } from "@/helpers/constants/enum";
import { IModelCourse } from "./ModelCourse";

export interface IModelUser {
  id: string;
  studentId?: string;
  firstNameTH: string;
  lastNameTH: string;
  firstNameEN: string;
  lastNameEN: string;
  email: string;
  facultyCode: string;
  role: ROLE;
  curriculums?: string[];
  termsOfService?: boolean;
  enrollCourses?: {
    year: number;
    semester: number;
    courses: {
      course: IModelCourse;
      section: number;
    }[];
  }[];
}
