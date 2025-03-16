import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.jpg";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { COURSE_TYPE, ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { setLoading } from "@/store/loading";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { isMobile } from "@/helpers/functions/function";
import {
  addLoadMoreCourseSyllabus,
  setCourseSyllabus,
  setSeachCourseSyllabus,
} from "@/store/courseSyllabus";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { Alert, Select } from "@mantine/core";
import { SearchInput } from "@/components/SearchInput";

export default function CourseSyllabusDashboard() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseSyllabus = useAppSelector((state) => state.courseSyllabus);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const termOption = academicYear.map((e) => ({
    label: `${e.semester}/${e.year}`,
    value: e.id,
    year: e.year,
    semester: e.semester,
  }));
  const [term, setTerm] = useState<
    Partial<IModelAcademicYear & { value: string; label: string }>
  >({});

  useEffect(() => {
    dispatch(setShowNavbar(true));
    dispatch(setShowSidebar(!!user.id));
    if (user.id) {
      dispatch(setDashboard(ROLE.STUDENT));
      localStorage.setItem("dashboard", ROLE.STUDENT);
    }
  }, [user]);

  useEffect(() => {
    const year = parseInt(params.get("year")!);
    const semester = parseInt(params.get("semester")!);
    if (termOption.length) {
      const acaYear =
        termOption.find((e) => e.semester == semester && e.year == year) ??
        termOption[0];
      if (acaYear && acaYear.value != term.value) {
        if (!user.id) {
          setParams({
            year: acaYear.year.toString(),
            semester: acaYear.semester.toString(),
          });
        }
        setTerm(acaYear);
        if (courseSyllabus.search.length) {
          dispatch(setSeachCourseSyllabus(""));
        }
      }
    }
  }, [termOption, term, params]);

  useEffect(() => {
    if (term.value && courseSyllabus.search.length) {
      fetchCourse();
    } else {
      dispatch(setCourseSyllabus({ totalCount: 0, search: "", courses: [] }));
    }
  }, [courseSyllabus.search]);

  const initialPayload = () => {
    return {
      ...new CourseRequestDTO(),
      courseSyllabus: true,
      ignorePage: true,
      year: term.year!,
      semester: term.semester!,
      search: courseSyllabus.search,
      hasMore: courseSyllabus.total
        ? courseSyllabus.total >= payload?.limit
        : true,
    };
  };

  const fetchCourse = async () => {
    dispatch(setLoading(true));
    const payloadCourse = initialPayload();
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setCourseSyllabus(res));
      setPayload({
        ...payloadCourse,
        hasMore: res.totalCount >= payloadCourse.limit!,
      });
    }
    dispatch(setLoading(false));
  };

  const onShowMore = async () => {
    if (payload.year && payload.semester) {
      const res = await getCourse({ ...payload, page: payload.page + 1 });
      if (res.length) {
        dispatch(addLoadMoreCourseSyllabus(res));
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

  const goToCourse = (courseNo: string, topic: string | undefined) => {
    window.open(
      `${window.location.origin}${
        ROUTE_PATH.COURSE_SYLLABUS
      }/${courseNo}?${params.toString()}${topic ? `&topic=${topic}` : ""}`
    );
  };

  return (
    <>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="sm:px-6 p-4 flex gap-5 items-end">
          {!user.id && (
            <Select
              label="Semester"
              data={termOption}
              value={term.value}
              onChange={(_, option) => setTerm(option)}
              allowDeselect={false}
              withCheckIcon={false}
              size="xs"
              classNames={{
                label: "font-medium mb-1",
                input: "text-primary font-medium rounded-md",
                option: "hover:bg-[#DDDDF6] text-primary font-medium",
              }}
            />
          )}
          <SearchInput
            value={courseSyllabus.search}
            onSearch={(value) => dispatch(setSeachCourseSyllabus(value))}
            placeholder="Course No / Course Name"
          />
        </div>
        <Alert
          radius="md"
          variant="light"
          classNames={{
            body: " flex justify-center",
          }}
          className="mx-4"
          color="orange"
          title={
            <div className="flex items-center gap-2">
              <Icon IconComponent={IconInfo2} className="mr-2" />
              <p>
                Course Specifications Feature is currently in its development
                (beta) phase. You may encounter unstable features or bugs.
              </p>
            </div>
          }
        ></Alert>
        {loading ? (
          <Loading />
        ) : courseSyllabus.total ? (
          <div className="flex flex-col h-full w-full overflow-hidden">
            <InfiniteScroll
              dataLength={courseSyllabus.courses.length}
              next={onShowMore}
              height={"100%"}
              loader={<Loading />}
              hasMore={false}
              className="overflow-y-auto w-full h-fit iphone:max-sm:grid-cols-1 sm:px-6 p-4 max-h-full grid grid-cols-2 sm:grid-cols-3 acerSwift:grid-cols-4 pb-5 gap-4"
              style={{ height: "fit-content", maxHeight: "100%" }}
            >
              {courseSyllabus.courses.map((item) => {
                return (
                  <div
                    key={`${item.id}${item.sections[0].topic ?? ""}`}
                    className="card relative justify-between h-[125px] macair133:h-[135px] sm:h-[128px] cursor-pointer rounded-[4px] hover:bg-[#f3f3f3]"
                    onClick={() =>
                      goToCourse(item.courseNo, item.sections[0].topic)
                    }
                  >
                    <div className="p-2.5 flex flex-col">
                      <p className="font-bold text-sm acerSwift:max-macair133:text-b3">
                        {item.courseNo}
                      </p>
                      <p className="text-xs acerSwift:max-macair133:text-b5 font-medium text-gray-600">
                        {item.courseName}
                      </p>
                      {item.type == COURSE_TYPE.SEL_TOPIC.en && (
                        <p className="text-xs acerSwift:max-macair133:text-b5 font-medium text-gray-600">
                          {item.sections[0].topic}
                        </p>
                      )}
                    </div>
                    <div className="bg-[#e7f0ff] flex h-8 items-center justify-between rounded-b-[4px]">
                      <p className="p-2.5 text-secondary font-[700] text-[12px]">
                        {item.type}
                      </p>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        ) : (
          <div className=" flex flex-row flex-1 px-[95px] iphone:max-sm:px-16 sm:max-ipad11:px-[70px] justify-between">
            <div className="h-full iphone:max-sm:items-center iphone:max-sm:justify-center iphone:max-sm:text-center justify-center flex flex-col">
              <p className="text-secondary text-[22px] sm:max-ipad11:text-[20px] font-semibold">
                {courseSyllabus.search.length
                  ? `No results for "${courseSyllabus.search}" `
                  : "Search Course"}
              </p>
              <br />
              <p className=" -mt-4 mb-6 sm:max-ipad11:mb-2 text-b2 break-words font-medium leading-relaxed">
                {courseSyllabus.search.length ? (
                  <>
                    Check the spelling or try a new search or courses haven't
                    finished TQF 3.
                  </>
                ) : (
                  <>Search courses by course number or course name.</>
                )}
              </p>
            </div>
            {!isMobile && (
              <div className="h-full  w-[24vw] justify-center flex flex-col">
                <img src={notFoundImage} alt="notFound"></img>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
