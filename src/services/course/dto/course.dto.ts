export class CourseRequestDTO {
  year: number = 2567;
  semester: number = 1;
  manage: boolean = false;
  orderBy: string = "courseNo";
  orderType: string = "asc";
  search: string = "";
  page: number = 1;
  limit: number = 20;
  ignorePage?: boolean = false;
  curriculum?: string[] = [];
  tqf3?: string[] = [];
  tqf5?: string[] = [];
  ploRequire: boolean = false;
}
