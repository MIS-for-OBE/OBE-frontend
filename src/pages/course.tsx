import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Menu } from "@mantine/core";
import {
  IconDots,
  IconPencilMinus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { IModelCourse } from "@/models/ModelCourse";
import { getOneCourse } from "@/services/course/course.service";
import { setCourseList } from "@/store/course";

export default function Course() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.course);
  const [course, setCourse] = useState<IModelCourse>();

  useEffect(() => {
    const fetchCourse = async () => {
      const term = academicYear.find(
        (e) =>
          e.year == parseInt(params.get("year")!) &&
          e.semester == parseInt(params.get("semester")!)
      );
      if (term) {
        const res = await getOneCourse({ academicYear: term.id, courseNo });
        dispatch(setCourseList([res]));
        setCourse(res);
      }
    };
    if (!courseList.length && params.get("year")) fetchCourse();

    if (!course && courseNo) {
      setCourse(courseList.find((e) => e.courseNo == parseInt(courseNo)));
    }
  }, [academicYear, courseList]);

  return (
    <div className="bg-[#F6F6F6] flex flex-col h-full w-full p-6 py-5 gap-3 overflow-hidden">
      <div className="flex flex-row  items-center justify-between">
        <p className="text-primary text-[16px] font-semibold">
          {course?.sections.length} Section
          {course?.sections.length! > 1 && "s"}
        </p>
        <div className="flex gap-5 items-center">
          <Button
            leftSection={<IconUpload className="h-5 w-5" />}
            color="#6869AD"
            className="rounded-[8px] text-[12px] font-medium h-8 px-2"
          >
            Upload and Assets
          </Button>
          <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
            <IconDots />
          </div>
        </div>
      </div>
      <div
        className="flex h-full w-full bg-white rounded-[5px] p-3 overflow-hidden"
        style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.50)" }}
      >
        <div className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-1">
          {course?.sections.map((item) => {
            return (
              <div
                key={item.id}
                className="card relative justify-between xl:h-[145px] md:h-[130px] cursor-pointer rounded-md hover:bg-[#F3F3F3]"
                style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)" }}
              >
                <div className="p-2.5 flex flex-col">
                  <p className="font-semibold">
                    Section {("000" + item.sectionNo).slice(-3)}
                  </p>
                  {course.addFirstTime && (
                    <Menu trigger="click" position="bottom-end" offset={2}>
                      <Menu.Target>
                        <IconDots className="absolute top-2 right-2 rounded-full hover:bg-gray-300" />
                      </Menu.Target>
                      <Menu.Dropdown
                        className="rounded-xl backdrop-blur-xl bg-white/70 "
                        style={{
                          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <Menu.Item className="text-[#3E3E3E] h-8 w-[200px] hover:bg-[#5768D5]/20">
                          <div className="flex items-center gap-2">
                            <IconPencilMinus stroke={1.5} className="h-5 w-5" />
                            <span>Edit Section</span>
                          </div>
                        </Menu.Item>
                        <Menu.Item
                          className="text-[#FF4747] h-8 w-[200px] hover:bg-[#d55757]/20"
                          // onClick={() => onClickDeleteCourse(item.id)}
                        >
                          <div className="flex items-center gap-2">
                            <IconTrash className="h-5 w-5" stroke={1.5} />
                            <span>Delete Section</span>
                          </div>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                </div>
                <div className="bg-primary flex h-8 items-center justify-between rounded-b-md">
                  <p className="p-2.5 text-white font-medium text-[12px]">
                    {item.assignments?.length} Assignment
                    {item.assignments?.length! > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
