import Profile from "./Profile";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import course, { setCourseList } from "@/store/course";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { getCourse } from "@/services/course/course.service";
import scoreobe from "@/assets/image/scoreOBElogobold.png";
import { SearchInput } from "./SearchInput";
import { setAllCourseList } from "@/store/allCourse";
import cpeLogoRed from "@/assets/image/cpeLogoRed.png";
import { ROLE, TQF_STATUS } from "@/helpers/constants/enum";
import { Button, CopyButton, Tooltip } from "@mantine/core";
import Icon from "./Icon";
import IconFeedback from "@/assets/icons/feedback.svg?react";
import { isMobile } from "@/helpers/functions/function";
import { HiCheck, HiOutlineClipboardCopy } from "react-icons/hi";

export default function Navbar() {
  const { name, courseNo } = useParams();
  const location = useLocation().pathname;
  const user = useAppSelector((state) => state.user);
  const showButtonLogin = useAppSelector(
    (state) => state.config.showButtonLogin
  );
  const [params, setParams] = useSearchParams();
  const tqf3 = useAppSelector((state) => state.tqf3);
  const tqf3Topic = useAppSelector((state) => state.tqf3.topic);
  const tqf5Topic = useAppSelector((state) => state.tqf5.topic);
  const dispatch = useAppDispatch();

  const searchCourse = async (searchValue: string, reset?: boolean) => {
    const path = "/" + location.split("/")[1];
    let res;
    let payloadCourse: any = {};
    if (reset) payloadCourse.search = "";
    else payloadCourse.search = searchValue;
    switch (path) {
      case ROUTE_PATH.INS_DASHBOARD:
      case ROUTE_PATH.ADMIN_DASHBOARD:
        payloadCourse = {
          ...new CourseRequestDTO(),
          ...payloadCourse,
          manage: path.includes(ROUTE_PATH.ADMIN_DASHBOARD),
        };
        payloadCourse.year = parseInt(params.get("year") ?? "");
        payloadCourse.semester = parseInt(params.get("semester") ?? "");
        res = await getCourse(payloadCourse);
        if (res) {
          res.search = payloadCourse.search;
          if (path.includes(ROUTE_PATH.ADMIN_DASHBOARD)) {
            dispatch(setAllCourseList(res));
          } else {
            dispatch(setCourseList(res));
          }
        }
        break;
      default:
        break;
    }
    localStorage.setItem("search", "true");
  };

  const topicPath = () => {
    const path = "/" + location.split("/")[1];
    const semester = params.get("semester") || "Unknown Semester";
    const year = params.get("year") ? params.get("year")?.slice(-2) : "??";
    switch (path) {
      case ROUTE_PATH.INS_DASHBOARD:
        return "Your Courses";
      case ROUTE_PATH.STD_DASHBOARD:
        if (location.includes(ROUTE_PATH.EVALUATION)) return `Evaluations`;
        else if (location.includes(ROUTE_PATH.HISTOGRAM)) return `Chart`;
        else if (location.includes(ROUTE_PATH.CLO)) return `CLO`;
        else if (location.includes(ROUTE_PATH.PLO) && /\d/.test(location))
          return `PLO`;
        else if (location.includes(ROUTE_PATH.PLO)) return `Overall PLO`;
        // else if (location.includes(ROUTE_PATH.SKILLS)) return `Skills`;
        return "Dashboard";
      case ROUTE_PATH.ADMIN_DASHBOARD:
        if (location.includes(ROUTE_PATH.TQF)) return `TQF ${semester}/${year}`;
        else if (location.includes(ROUTE_PATH.CLO))
          return `CLO ${semester}/${year}`;
        else return `PLO ${semester}/${year}`;
      case ROUTE_PATH.COURSE:
        if (location.includes(ROUTE_PATH.TQF3))
          return `TQF 3${tqf3Topic ? ` - ${tqf3Topic}` : ""}`;
        else if (location.includes(ROUTE_PATH.TQF5))
          return `TQF 5${tqf5Topic ? ` - ${tqf5Topic}` : ""}`;
        else if (location.includes(ROUTE_PATH.SCORE)) return `${name}`;
        else if (location.includes(ROUTE_PATH.ROSTER)) return `Course Roster`;
        // else if (location.includes(ROUTE_PATH.SKILLS)) return "Skills";
        else if (location.includes(ROUTE_PATH.STUDENTS)) return `${name}`;
        else if (location.includes(ROUTE_PATH.EVALUATION)) return "Evaluations";
        else if (location.includes(ROUTE_PATH.HISTOGRAM)) return "Chart";
        else return "Section";
      default:
        return;
    }
  };

  const ButtonLogin = () => {
    return (
      <a href={import.meta.env.VITE_CMU_ENTRAID_URL} className="hidden sm:flex">
        <Button size="xs" variant="light" className="!text-[12px]">
          Sign in CMU account
        </Button>
      </a>
    );
  };

  const feedback = () => {
    return (
      <a
        href={
          [ROLE.STUDENT, ROLE.TA].includes(user.role)
            ? "https://docs.google.com/forms/d/e/1FAIpQLSfstqyy0ijNp8u0JU0a7bBU_x0HGPhJ5V7flAD0ZymzD9cZqA/viewform"
            : "https://forms.gle/HwxjaAZAJs99v8aDA"
        }
        target="_blank"
      >
        <Button variant="light">
          <div className="flex items-center gap-1  acerSwift:max-macair133:text-b5">
            <Icon
              className="size-5  acerSwift:max-macair133:size-4"
              IconComponent={IconFeedback}
            />
            <span>Feedback</span>
          </div>
        </Button>
      </a>
    );
  };

  return (
    <>
      <div
        className={`min-h-14  acerSwift:max-macair133:min-h-[50px] acerSwift:max-macair133:py-1 bg-[#fafafa] border-b border-[#e0e0e0] text-secondary sm:px-6 iphone:max-sm:px-3 inline-flex flex-wrap justify-between items-center z-50 ${
          [ROUTE_PATH.LOGIN].includes(location)
            ? "border-none min-h-14 acerSwift:max-macair133:min-h-12 items-center"
            : ""
        }`}
        style={
          ![ROUTE_PATH.LOGIN].includes(location)
            ? { boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }
            : {}
        }
      >
        <div className="flex w-fit gap-3 items-center">
          <p
            className={`font-semibold sm:text-h2 iphone:max-sm:text-[16px] acerSwift:max-macair133:text-b1 ${
              location.includes(ROUTE_PATH.TQF3 || ROUTE_PATH.TQF5)
                ? ""
                : "md:w-fit w-full"
            }`}
          >
            {topicPath()}
          </p>
          {location.includes(ROUTE_PATH.TQF3) &&
            tqf3.status == TQF_STATUS.DONE && (
              <CopyButton
                value={`${window.location.origin.toString()}${
                  ROUTE_PATH.COURSE_SYLLABUS
                }/${tqf3.id}?courseNo=${courseNo}&year=${params.get(
                  "year"
                )}&semester=${params.get("semester")}`}
                timeout={2000}
              >
                {({ copied, copy }) => (
                  <Tooltip
                    withArrow
                    arrowPosition="side"
                    arrowOffset={50}
                    arrowSize={7}
                    position="bottom-end"
                    label={
                      <div className="text-default font-semibold text-[13px] p-1">
                        Course Syllabus
                      </div>
                    }
                    color="#FCFCFC"
                  >
                    <Button
                      variant="light"
                      className="tag-tqf !px-3 !rounded-full text-center"
                      onClick={copy}
                    >
                      {copied ? (
                        <HiCheck size={20} />
                      ) : (
                        <HiOutlineClipboardCopy size={20} />
                      )}
                    </Button>
                  </Tooltip>
                )}
              </CopyButton>
            )}
        </div>
        {[ROUTE_PATH.INS_DASHBOARD, ROUTE_PATH.ADMIN_DASHBOARD].some((path) =>
          location.includes(path)
        ) &&
          !isMobile && (
            <SearchInput
              onSearch={searchCourse}
              placeholder="Course No / Course Name"
            />
          )}
        {[ROUTE_PATH.LOGIN].includes(location) && (
          <div className="bg-[#fafafa] sm:px-12 px-2 overflow-hidden items-center !w-full !h-full justify-between flex">
            <div className="flex gap-2 items-center">
              <img
                src={scoreobe}
                alt="cpeLogo"
                className=" sm:h-[28px] h-[22px] "
              />
              <span className="font-[600] sm:text-[18px] text-[14px] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                ScoreOBE+
              </span>
            </div>
            <div className="py-5 flex items-end gap-5 justify-end h-full">
              {showButtonLogin && ButtonLogin()}
              <img
                src={cpeLogoRed}
                alt="cpeLogo"
                className="sm:h-[36px] h-[26px]"
              />
            </div>
          </div>
        )}
        {![ROUTE_PATH.LOGIN].includes(location) && (
          <div className="flex gap-2 items-center">
            {!isMobile && feedback()}
            <Profile />
          </div>
        )}
      </div>
    </>
  );
}
