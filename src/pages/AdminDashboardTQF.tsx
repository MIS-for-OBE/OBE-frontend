import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Table } from "@mantine/core";
import Icon from "@/components/Icon";
import IconAdjustmentsHorizontal from "@/assets/icons/horizontalAdjustments.svg?react";
import IconExcel from "@/assets/icons/excel.svg?react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.png";
import { COURSE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import Loading from "@/components/Loading";
import { setLoading } from "@/store/loading";
import { setShowSidebar } from "@/store/showSidebar";
import { setShowNavbar } from "@/store/showNavbar";
import { addLoadMoreAllCourse, setAllCourseList } from "@/store/allCourse";
import {
  getUniqueInstructors,
  getUniqueTopicsWithTQF,
} from "@/helpers/functions/function";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelSection } from "@/models/ModelSection";

export default function AdminDashboardTQF() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.allCourse);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  useEffect(() => {
    const year = parseInt(params.get("year")!);
    const semester = parseInt(params.get("semester")!);
    if (academicYear.length) {
      const acaYear = academicYear.find(
        (e) => e.semester == semester && e.year == year
      );
      if (acaYear && acaYear.id != term.id) {
        setTerm(acaYear);
      }
    }
  }, [academicYear, term, params]);

  useEffect(() => {
    if (term) {
      setPayload({
        ...new CourseRequestDTO(),
        manage: true,
        year: term.year,
        semester: term.semester,
        search: courseList.search,
        hasMore: courseList.total >= payload?.limit,
      });
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  const fetchCourse = async (year: number, semester: number) => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
    const payloadCourse = { ...new CourseRequestDTO(), year, semester };
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setAllCourseList(res));
      setPayload({
        ...payloadCourse,
        hasMore: res.totalCount >= payload.limit,
      });
    }
    dispatch(setLoading(false));
  };

  const onShowMore = async () => {
    if (payload.year && payload.semester) {
      const res = await getCourse({ ...payload, page: payload.page + 1 });
      if (res.length) {
        dispatch(addLoadMoreAllCourse(res));
        setPayload({
          ...payload,
          page: payload.page + 1,
          hasMore: res.length >= payload.limit,
        });
      } else {
        setPayload({ ...payload, hasMore: false });
      }
    }
  };

  const courseTable = (index: number, course: Partial<IModelCourse>) => {
    const insList = getUniqueInstructors(course.sections!);
    const uniqueTopic = getUniqueTopicsWithTQF(course.sections!);
    return course.type == COURSE_TYPE.SEL_TOPIC.en ? (
      uniqueTopic.map((sec, indexSec) => {
        return (
          <Table.Tr key={index}>
            {indexSec == 0 && (
              <Table.Td
                className="border-r !border-[#cecece]"
                rowSpan={uniqueTopic.length}
              >
                {course.courseNo}
              </Table.Td>
            )}
            <Table.Td>
              <div>
                <p>{course.courseName}</p>
                {sec && <p>({sec.topic})</p>}
              </div>
            </Table.Td>
            <Table.Td>
              {insList.map((ins) => {
                return (
                  <div key={ins} className="flex flex-col">
                    <p>{ins}</p>
                  </div>
                );
              })}
            </Table.Td>
            <Table.Td>
              <Button
                // color={
                //   statusTqf3 == TQF_STATUS.NO_DATA
                //     ? "#d8d8dd"
                //     : statusTqf3 == TQF_STATUS.IN_PROGRESS
                //     ? "#eedbb5"
                //     : "#bbe3e3"
                // }
                className="tag-tqf text-center"
                tqf-status={sec ? sec.TQF3?.status : course.TQF3?.status}
              >
                {sec ? sec.TQF3?.status : course.TQF3?.status}
              </Button>
            </Table.Td>
            <Table.Td>
              <Button
                className="tag-tqf text-center"
                tqf-status={sec ? sec.TQF5?.status : course.TQF5?.status}
              >
                {sec ? sec.TQF5?.status : course.TQF5?.status}
              </Button>
            </Table.Td>
          </Table.Tr>
        );
      })
    ) : (
      <Table.Tr key={index}>
        <Table.Td className="border-r !border-[#cecece]">
          {course.courseNo}
        </Table.Td>
        <Table.Td>{course.courseName}</Table.Td>
        <Table.Td>
          {insList.map((ins) => {
            return (
              <div key={ins} className="flex flex-col">
                <p>{ins}</p>
              </div>
            );
          })}
        </Table.Td>
        <Table.Td>
          <Button
            // color={
            //   statusTqf3 == TQF_STATUS.NO_DATA
            //     ? "#d8d8dd"
            //     : statusTqf3 == TQF_STATUS.IN_PROGRESS
            //     ? "#eedbb5"
            //     : "#bbe3e3"
            // }
            className="tag-tqf text-center"
            tqf-status={course.TQF3?.status}
          >
            {course.TQF3?.status}
          </Button>
        </Table.Td>
        <Table.Td>
          <Button
            className="tag-tqf text-center"
            tqf-status={course.TQF5?.status}
          >
            {course.TQF5?.status}
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  };

  return (
    <>
      <div className=" flex flex-col h-full w-full gap-2 overflow-hidden">
        <div className="flex flex-row px-6 pt-3 items-center justify-between">
          <div className="flex flex-col">
            <p className="text-secondary text-[18px] font-semibold ">
              Hi there, {user.firstNameEN}
            </p>
            {courseList.search.length ? (
              <p className="text-[#575757] text-[14px]">
                {courseList.total} result{courseList.total > 1 ? "s " : " "}{" "}
                found
              </p>
            ) : (
              <p className="text-[#575757] text-[14px]">
                In semester {term?.semester ?? ""}, {term?.year ?? ""}!{" "}
                {courseList.courses.length === 0 ? (
                  <span>Your course card is currently empty</span>
                ) : (
                  <span>
                    You have{" "}
                    <span className="text-[#5768D5] font-semibold">
                      {courseList.total} Course
                      {courseList.total > 1 ? "s " : " "}
                    </span>
                    on your plate.
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="text-center px-4"
              leftSection={<Icon IconComponent={IconAdjustmentsHorizontal} />}
            >
              Filter
            </Button>
            <Button
              className="text-center px-4"
              leftSection={
                <Icon IconComponent={IconExcel} className="size-4" />
              }
            >
              Export PLO
            </Button>
          </div>
        </div>
        <div className="flex h-full w-full px-6 pb-3 overflow-hidden">
          {loading ? (
            <Loading />
          ) : courseList.courses.length ? (
            <InfiniteScroll
              dataLength={courseList.courses.length}
              next={onShowMore}
              height={"100%"}
              hasMore={payload?.hasMore}
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
              style={{ height: "fit-content" }}
              loader={<Loading />}
            >
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-r !border-[#cecece]">
                      Course No.
                    </Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Instructor</Table.Th>
                    <Table.Th>TQF 3</Table.Th>
                    <Table.Th>TQF 5</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {courseList.courses.map((course, index) =>
                    courseTable(index, course)
                  )}
                </Table.Tbody>
              </Table>
            </InfiniteScroll>
          ) : (
            <div className=" flex flex-row flex-1 justify-between">
              <div className="h-full px-[60px] justify-center flex flex-col">
                <p className="text-secondary text-[22px] font-semibold">
                  {courseList.search.length
                    ? `No results for "${courseList.search}" `
                    : "No course found"}
                </p>
                <br />
                <p className=" -mt-4 mb-6 text-b2 break-words font-400 leading-relaxed">
                  {courseList.search.length ? (
                    <>Check the spelling or try a new search.</>
                  ) : (
                    <>It looks like you haven't added any courses yet.</>
                  )}
                </p>
              </div>
              <div className="h-full px-[60px] bg-slate-300  justify-center flex flex-col">
                <img src={notFoundImage} alt="notFound"></img>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}