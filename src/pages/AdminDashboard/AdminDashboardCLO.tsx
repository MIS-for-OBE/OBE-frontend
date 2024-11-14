import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Select, Table, Tabs } from "@mantine/core";
import Icon from "@/components/Icon";
import IconExcel from "@/assets/icons/excel.svg?react";
import { useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.jpg";
import Loading from "@/components/Loading/Loading";
import { setLoading } from "@/store/loading";
import { setShowSidebar } from "@/store/showSidebar";
import { setShowNavbar } from "@/store/showNavbar";
import { addLoadMoreAllCourse, setAllCourseList } from "@/store/allCourse";
import { getUniqueTopicsWithTQF } from "@/helpers/functions/function";
import { COURSE_TYPE } from "@/helpers/constants/enum";
import { IModelCourse } from "@/models/ModelCourse";

export default function AdminDashboardCLO() {
  const loading = useAppSelector((state) => state.loading.loading);
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
    const uniqueTopic = getUniqueTopicsWithTQF(course.sections!);
    return course.type == COURSE_TYPE.SEL_TOPIC.en ? (
      uniqueTopic.map((sec) => {
        return (
          <Table.Tr key={`${index}-${sec.topic}`}>
            <Table.Td>
              <div>
                <p>{course.courseNo}</p>
                <p>{course.courseName}</p>
                {sec && <p>({sec.topic})</p>}
              </div>
            </Table.Td>
            <Table.Td>
              <div>
                {sec.TQF3?.part2 ? (
                  sec.TQF3?.part2!.clo.map(({ no }) => <p key={no}>CLO {no}</p>)
                ) : (
                  <p>TQF 3 {sec.TQF3?.status}</p>
                )}
              </div>
            </Table.Td>
          </Table.Tr>
        );
      })
    ) : (
      <Table.Tr key={index}>
        <Table.Td>
          <div>
            <p>{course.courseNo}</p>
            <p>{course.courseName}</p>
          </div>
        </Table.Td>
        <Table.Td>
          <div>
            {course.TQF3?.part2 ? (
              course.TQF3?.part2.clo.map(({ no }) => <p key={no}>CLO {no}</p>)
            ) : (
              <p>TQF 3 {course.TQF3?.status}</p>
            )}
          </div>
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
                In CPE Department{" "}
                {courseList.courses.length === 0 ? (
                  <span>Course is currently empty</span>
                ) : (
                  <span>
                    have{" "}
                    <span className="text-[#1f69f3] font-semibold">
                      {courseList.total} Course
                      {courseList.total > 1 ? "s " : " "}
                    </span>
                    on this semester.
                  </span>
                )}
              </p>
            )}
          </div>
        
          <div className="flex gap-3 flex-wrap">
            <Select data={["Avg. PLO +", "Score PLO"]} size="xs" className="w-[8vw]" classNames={{ input: "!h-[32px]"}} />
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
        <Tabs
          classNames={{
            root: "overflow-hidden flex -mt-1 px-6 flex-col max-h-full",
          }}
          defaultValue="cpe"
          // value={tab}
          // onChange={setTab}
        >
          <Tabs.List className="mb-2">
            <Tabs.Tab value="engr">ENGR</Tabs.Tab>{" "}
            <Tabs.Tab value="cpe">CPE</Tabs.Tab>{" "}
            <Tabs.Tab value="isne">ISNE</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel className="overflow-hidden flex" value="engr">
            <div className="overflow-y-auto max-h-[502px] gap-3">engr</div>
          </Tabs.Panel>
          <Tabs.Panel
            className="flex flex-col overflow-auto gap-1"
            value="cpe"
          >
             <div className="flex h-full w-full pb-5 pt-2 overflow-hidden">
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
              <Table stickyHeader striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Course</Table.Th>
                    <Table.Th>CLO</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="text-default font-medium text-[13px]">
                  {courseList.courses.map((course, index) =>
                    courseTable(index, course)
                  )}
                </Table.Tbody>
              </Table>
            </InfiniteScroll>
          ) : (
            <div className=" flex flex-row px-[75px] flex-1 justify-between">
              <div className="h-full  justify-center flex flex-col">
                <p className="text-secondary text-[22px] font-semibold">
                  {courseList.search.length
                    ? `No results for "${courseList.search}" `
                    : "No Course Found"}
                </p>
                <br />
                <p className=" -mt-4 mb-6 text-b2 font-medium break-words leading-relaxed">
                  {courseList.search.length ? (
                    <>Check the spelling or try a new search.</>
                  ) : (
                    <>It looks like you haven't added any courses yet.</>
                  )}
                </p>
              </div>
              <div className="h-full  w-[24vw] justify-center flex flex-col">
                <img src={notFoundImage} alt="notFound"></img>
              </div>
            </div>
          )}
        </div>
          </Tabs.Panel>
          <Tabs.Panel className="overflow-hidden flex" value="isne">
            <div className="overflow-y-auto max-h-[502px] gap-3">isne</div>
          </Tabs.Panel>
        </Tabs>
       
      </div>
    </>
  );
}