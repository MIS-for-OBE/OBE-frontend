import { IModelUser } from "./ModelUser";

export interface IModelSection {
  id: string;
  sectionNo: number;
  topic?: string;
  semester?: number[];
  openThisTerm?: boolean;
  instructor: IModelUser | string;
  coInstructors: IModelUser[] | any[];
  isActive?: boolean;
  assignments: any[];
  isProcessTQF3: boolean;
  // TQF3: TQF;
  // TQF5: TQF;
  TQF3?: any;
  TQF5?: any;
}
