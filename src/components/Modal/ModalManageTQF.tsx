import {
  Button,
  Input,
  Modal,
  Select,
  TextInput,
  Switch,
  List,
} from "@mantine/core";
import checkedTQF3Completed from "@/assets/icons/checkedTQF3Completed.svg?react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "../Icon";
import notCompleteIcon from "@/assets/icons/notComplete.svg?react";
import { IModelUser } from "@/models/ModelUser";
import { getCourse } from "@/services/course/course.service";
import { useAppSelector } from "@/store";
import { COURSE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { IModelCourse } from "@/models/ModelCourse";
import { useSearchParams } from "react-router-dom";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { getSection, getUserName } from "@/helpers/functions/function";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageTQF({ opened, onClose }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<IModelAcademicYear>();
  const academicYear = useAppSelector((state) => state.academicYear);
  const [checkedTQF3, setCheckedTQF3] = useState(true);
  const [checkedTQF5, setCheckedTQF5] = useState(false);
  const [notCompleteTQF3List, setnotCompleteTQF3List] = useState<any[]>([]);

  useEffect(() => {
    const yearId = params.get("term");
    const year = parseInt(params.get("year")!);
    const semester = parseInt(params.get("semester")!);
    if (
      yearId != term?.id &&
      year != term?.year &&
      semester != term?.semester
    ) {
      const acaYear = academicYear.find(
        (e) => e.id == yearId && e.semester == semester && e.year == year
      );
      if (acaYear) {
        setTerm(acaYear);
        setPayload({
          ...new CourseRequestDTO(),
          academicYear: acaYear.id,
        });
      }
    }
  }, [academicYear, params]);

  const fetchCourse = async () => {
    if (payload.academicYear) {
      payload.manage = true;
      const res = await getCourse({ ...payload });
      if (res.length) {
        const courseList: any[] = [];
        res.forEach((course: IModelCourse) => {
          if (!course.TQF3 || course.TQF3?.status !== TQF_STATUS.DONE) {
            if (course.type === COURSE_TYPE.SEL_TOPIC) {
              course.sections.forEach((section) => {
                courseList.push({
                  ...course,
                  ...section,
                  instructor: getUserName(section.instructor as IModelUser),
                });
              });
            } else {
              let temp = Array.from(
                new Set(
                  course.sections.map((section) =>
                    getUserName(section.instructor as IModelUser)
                  )
                )
              ).toString();

              courseList.push({ ...course, instructor: temp });
            }
          }
        });
        setnotCompleteTQF3List([...courseList]);
      }
    }
  };

  const onClickeToggleProcessTQF3 = (checked: any, index?: number) => {
    const updatedList = notCompleteTQF3List.map((item, idx) => {
      if (index === undefined || index === idx) {
        return {
          ...item,
          isProcessTQF3: checked,
          sections:
            item.type === COURSE_TYPE.SEL_TOPIC
              ? item.sections.map((section: any) => ({
                  ...section,
                  isProcessTQF3: checked,
                }))
              : item.sections,
        };
      }
      return item;
    });

    setnotCompleteTQF3List(updatedList);
  };

  const clickToggleTQF3 = (checked: any) => {
    setCheckedTQF3(checked);
    setCheckedTQF5(!checked);
    if (checked) {
      onClickeToggleProcessTQF3(true);
    } else {
      onClickeToggleProcessTQF3(false);
    }
  };

  const clickToggleTQF5 = (checked: any) => {
    setCheckedTQF5(checked);
    setCheckedTQF3(!checked);
  };

  useEffect(() => {
    if (opened) {
      setSearchValue("");
      fetchCourse();
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title="Management TQF"
      size="45vw"
      radius={"12px"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-fit ",
      }}
    >
      <div className="flex flex-col h-full    flex-1 ">
        <div className="flex flex-row w-full mb-4 items-end h-fit ">
          <div
            className="flex flex-col gap-3  p-3 px-3 w-full   bg-white border-[1px]  rounded-md"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex flex-col bg-[#F3F3F3] w-full rounded-xl overflow-clip">
              <div className="flex flex-row justify-between items-center px-5 py-3 w-full">
                <p className="font-semibold text-[14px] text-tertiary">
                  TQF 3 Edit
                </p>
                <Switch
                  color="#5C55E5"
                  size="lg"
                  onLabel="ON"
                  offLabel="OFF"
                  checked={checkedTQF3}
                  onChange={(event) =>
                    clickToggleTQF3(event.currentTarget.checked)
                  }
                />
              </div>
              <div className="flex flex-row justify-between items-center border-t-2 border-[#DADADA] px-5 py-3 w-full">
                <p className="font-semibold text-[14px] text-tertiary">
                  TQF 5 Edit
                </p>
                <Switch
                  color="#5C55E5"
                  size="lg"
                  onLabel="ON"
                  offLabel="OFF"
                  checked={checkedTQF5}
                  onChange={(event) =>
                    clickToggleTQF5(event.currentTarget.checked)
                  }
                />
              </div>
            </div>
            <div className="ml-4">
              <p className="font-semibold text-[13px] text-tertiary">
                Turn on TQF 5 edit
              </p>
              <List
                listStyleType="disc"
                className="ml-2 text-[12px] text-[#575757] "
              >
                <List.Item>
                  All CPE department course instructors will be able to edit TQF
                  5,
                </List.Item>
                <List.Item>
                  <span className="text-secondary">
                    TQF 3 edit will be automatically turn off.
                  </span>{" "}
                  As a result, instructors will not be able to edit TQF 3.
                </List.Item>
                <List.Item className="text-secondary">
                  Does not affect courses with no data or incomplete in TQF 3.
                  Instructors will still be able to edit TQF 3.
                </List.Item>
              </List>
            </div>
          </div>
        </div>

        <div
          className="w-full  flex flex-col bg-white border-secondary border-[1px]  rounded-md overflow-clip"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {!notCompleteTQF3List.length ? (
            <div className="bg-[#e6e9ff] flex items-center justify-between rounded-t-md  px-4 py-3 text-secondary font-semibold">
              <div className="flex items-center gap-2">
                <Icon
                  IconComponent={checkedTQF3Completed}
                  className="h-5 w-5"
                />
                <span>All courses have completed TQF 3</span>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-[#e6e9ff] flex items-center justify-between rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
                <div className="flex items-center gap-2">
                  <Icon IconComponent={notCompleteIcon} className="h-5 w-5" />
                  <span>List of Courses that are Incomplete TQF 3</span>
                </div>
                <p>
                  {`${notCompleteTQF3List.length} Course`}
                  {`${notCompleteTQF3List.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full h-[350px] p-4 overflow-y-hidden">
                <TextInput
                  leftSection={<TbSearch />}
                  placeholder="Course No, Course name "
                  size="xs"
                  value={searchValue}
                  onChange={(event: any) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  rightSectionPointerEvents="all"
                />
                <div className="flex flex-col gap-2 overflow-y-scroll p-1">
                  {notCompleteTQF3List.map((e, index) => (
                    <div
                      key={index}
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                      className="w-full items-center justify-between mt-2 py-3 px-4 rounded-md flex"
                    >
                      <div className="gap-3 flex items-center">
                        <div className="flex flex-col">
                          <p className="font-semibold text-[14px] text-secondary">
                            {e.courseNo}
                            {e.type === COURSE_TYPE.SEL_TOPIC &&
                              ` (Sec. ${getSection(e.sectionNo)})`}
                          </p>
                          <p className="text-[12px] font-normal text-[#4E5150]">
                            {e.type === COURSE_TYPE.SEL_TOPIC
                              ? e.topic
                              : e.courseName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between w-[50%]">
                        <p className="mr-1 text-[#4E5150] text-[12px] font-normal text-wrap">
                          {e.instructor}
                        </p>
                        {!checkedTQF3 && (
                          <Switch
                            color="#5C55E5"
                            size="lg"
                            onLabel="ON"
                            offLabel="OFF"
                            checked={e.isProcessTQF3}
                            onChange={(event) =>
                              onClickeToggleProcessTQF3(
                                event.currentTarget.checked,
                                index
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
