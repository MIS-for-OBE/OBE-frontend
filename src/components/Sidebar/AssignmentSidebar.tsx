import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import Icon from "@/components/Icon";
import IconLogout from "@/assets/icons/logout.svg?react";
import IconList from "@/assets/icons/list.svg?react";
import IconHistogram from "@/assets/icons/histogram.svg?react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { IModelSection } from "@/models/ModelCourse";
import Loading from "../Loading/Loading";

type Props = {
  onClickLeaveCourse: () => void;
};

export default function AssignmentSidebar({ onClickLeaveCourse }: Props) {
  const { courseNo, sectionNo } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const path = useLocation().pathname;
  const prefix = `${ROUTE_PATH.COURSE}/${courseNo}/${ROUTE_PATH.SECTION}/${sectionNo}`;
  const user = useAppSelector((state) => state.user);
  const courseList = useAppSelector((state) => state.course.courses);
  const loading = useAppSelector((state) => state.loading.loading);
  const dispatch = useAppDispatch();
  const [course, setCourse] = useState<IModelCourse>();
  const [section, setSection] = useState<Partial<IModelSection>>();

  useEffect(() => {
    if (courseList.length) {
      const findCourse = courseList.find((e) => e.courseNo == courseNo);
      const findSection = findCourse?.sections.find(
        (sec) => sec.sectionNo == parseInt(sectionNo!)
      );
      setCourse(findCourse);
      setSection(findSection);
    }
  }, [courseList, courseNo]);

  const gotoPage = (newPath: string) => {
    navigate({
      pathname: path.replace(path.split("/")[5], newPath),
      search: "?" + params.toString(),
    });
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex text-white flex-col h-full  gap-[26px]">
      <div className="flex flex-col gap-5 ">
        <div className="flex flex-col flex-1 font-bold gap-1 ">
          <p className="text-lg acerSwift:max-macair133:!text-b1">
            {courseNo} ({course?.semester}/{course?.year.toString().slice(-2)})
          </p>
          <p className="text-lg acerSwift:max-macair133:!text-b1 -mt-1">
            Section {getSectionNo(sectionNo)}
          </p>
          <p className="text-b3   acerSwift:max-macair133:!text-b4 font-semibold text-pretty max-w-full">
            {course?.courseName}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => gotoPage(ROUTE_PATH.EVALUATION)}
            leftSection={
              <Icon
                IconComponent={IconList}
                className=" acerSwift:max-macair133:!size-5"
              />
            }
            className={`!w-full !text-b3 acerSwift:max-macair133:!text-b4 acerSwift:max-macair133:!h-[30px] flex justify-start items-center transition-colors duration-300 focus:border-none group
              ${
                path.includes(ROUTE_PATH.EVALUATION)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
          >
            Evaluation
          </Button>
          <Button
            onClick={() => gotoPage(ROUTE_PATH.HISTOGRAM)}
            leftSection={
              <Icon
                IconComponent={IconHistogram}
                className="pb-1 pl-[2px] size-[22px]  acerSwift:max-macair133:!size-5"
              />
            }
            className={`!w-full !text-b3 acerSwift:max-macair133:!text-b4 acerSwift:max-macair133:!h-[30px] flex justify-start items-center transition-colors duration-300 focus:border-none group
                 ${
                   path.includes(ROUTE_PATH.HISTOGRAM)
                     ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                     : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                 }`}
          >
            <p className="pl-[3px]">Charts</p>
          </Button>
        </div>
      </div>

      <div className="flex  flex-col gap-2 mt-5">
        <p className="text-b2 acerSwift:max-macair133:!text-b3 font-bold mb-1">
          Owner section
        </p>
        <div className="max-h-[120px] flex flex-col gap-1 overflow-y-auto">
          <p className="text-pretty font-medium text-b4 acerSwift:max-macair133:!text-b5">
            {getUserName(section?.instructor as IModelUser, 1)}
          </p>
        </div>
      </div>
      {!!section?.coInstructors?.length && (
        <div className="flex  flex-col gap-2">
          <p className="text-b2 acerSwift:max-macair133:!text-b3 font-bold mb-1">
            Co-Instructor
          </p>
          <div className="max-h-[140px] gap-1 flex flex-col  overflow-y-auto">
            {section.coInstructors.map((item, index) => {
              return (
                <p
                  key={index}
                  className="text-pretty font-medium text-b4 acerSwift:max-macair133:!text-b5"
                >
                  {getUserName(item, 1)}
                </p>
              );
            })}
          </div>
        </div>
      )}
      {course &&
        !course?.sections.find(
          (sec: any) => sec.instructor.email === user.email
        ) && (
          <div className="flex  w-full gap-2 justify-end flex-col flex-1">
            <p className="text-b2 acerSwift:max-macair133:!text-b3 text-white font-bold">
              Course Action
            </p>
            <Button
              onClick={onClickLeaveCourse}
              leftSection={
                <Icon
                  IconComponent={IconLogout}
                  className="size-5 stroke-[2px] acerSwift:max-macair133:size-4"
                />
              }
              className="text-[#ffffff] bg-transparent hover:bg-[#d55757] !w-full !h-9 acerSwift:max-macair133:!h-8 flex justify-start items-center transition-colors duration-300 focus:border-none group"
            >
              <div className="flex flex-col justify-start w-full items-start gap-[7px] ">
                <p className="font-medium text-b3 acerSwift:max-macair133:text-b4">
                  Leave from Course
                </p>
              </div>
            </Button>
          </div>
        )}
    </div>
  );
}
