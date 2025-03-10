import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import notFoundImage from "@/assets/image/notFound.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { CLO_EVAL, ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { Alert, Button, Table, Tooltip } from "@mantine/core";
import Icon from "@/components/Icon";
import IconBulb from "@/assets/icons/bulb.svg?react";
import { isMobile } from "@/helpers/functions/function";

export default function StdCLO() {
  const { courseNo } = useParams();
  const loading = useAppSelector((state) => state.loading.loading);
  const course = useAppSelector((state) =>
    state.enrollCourse.courses.find((c) => c.courseNo == courseNo)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  return (
    <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:px-3 iphone:max-sm:py-3 sm:py-5 gap-3 overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col   overflow-y-auto overflow-x-hidden max-w-full h-full">
          <div className="flex flex-row  py-1   items-center justify-between">
            {course?.clos.length !== 0 ? (
              <p className="text-secondary sm:text-[16px] iphone:max-sm:text-[14px] mb-[18px] -mt-1 font-semibold">
                ผลลัพธ์การเรียนรู้ของกระบวนวิชา
                <br />
                Course Learning Outcome
              </p>
            ) : (
              <></>
            )}
          </div>
          {course?.clos.length !== 0 ? (
            <div className=" flex flex-col gap-2 -mt-2">
              <Alert
                variant="light"
                className="mb-3"
                title={` What is CLO? `}
                icon={<Icon IconComponent={IconBulb} className="size-6 " />}
                classNames={{ title: "acerSwift:max-macair133:!text-b3" }}
              >
                <p className="font-normal -mt-1 sm:leading-[22px] iphone:max-sm:leading-[20px] iphone:max-sm:text-[12px] sm:text-[13px]">
                  <span className="font-bold">
                    {" "}
                    Course Learning Outcome (CLO)
                  </span>{" "}
                  refers to{" "}
                  <span className="font-bold">
                    what students should be able to know, understand, and do{" "}
                  </span>{" "}
                  after completing a course. It serves as a guideline for both
                  instructors and students to ensure that learning objectives
                  are met effectively. CLOs are typically designed to be
                  measurable and specific, focusing on different aspects of
                  learning, such as:{" "}
                  <span className="font-bold"> Knowledge</span> (understanding
                  theories, concepts, and principles),{" "}
                  <span className="font-bold"> Skills</span> (applying knowledge
                  to solve problems or perform tasks),{" "}
                  <span className="font-bold"> Attitudes and Values</span>{" "}
                  (developing ethical perspectives, teamwork, or communication
                  skills)
                </p>
              </Alert>
              {!isMobile ? (
                <div
                  className="overflow-y-auto overflow-x-auto w-full  h-fit max-h-full  border flex flex-col rounded-lg border-secondary"
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                  }}
                >
                  <Table stickyHeader>
                    <Table.Thead>
                      <Table.Tr className="bg-[#e5e7f6]">
                        <Table.Th>CLO No.</Table.Th>
                        <Table.Th>CLO Description</Table.Th>
                        <Table.Th>Score</Table.Th>
                        <Table.Th>Evaluation</Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody className="text-default sm:max-macair133:text-b4 font-medium text-[13px] ">
                      {course?.clos.map(({ clo, score }, index) => {
                        return (
                          <Table.Tr key={index}>
                            <Table.Td>{clo.no}</Table.Td>
                            <Table.Td>
                              <p>{clo.descTH}</p>
                              <p>{clo.descEN}</p>
                            </Table.Td>
                            <Table.Td>{score}</Table.Td>
                            <Table.Td>
                              {score != "-" ? CLO_EVAL[score] : "-"}
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {course?.clos.map(({ clo, score }, index) => {
                    return (
                      <div
                        className="flex flex-col border gap-3 rounded-md p-3 text-[13px]"
                        key={index}
                      >
                        <div className="font-semibold text-secondary">CLO-{clo.no}</div>
                        <div>
                          <p>{clo.descTH}</p>
                          <p className="mt-1">{clo.descEN}</p>
                        </div>
                        <div>Score: {score}</div>
                        <div>Evaluation: {score != "-" ? CLO_EVAL[score] : "-"}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center  !h-full !w-full justify-between -mt-[8px]  sm:px-16">
              <div className="flex flex-col gap-3 iphone:max-sm:text-center sm:text-start">
                <p className="!h-full text-[20px] text-secondary font-semibold">
                  No CLO
                </p>
                <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                  The CLO will show when the TQF 3 (Course Specification) is
                  submitted <br /> by the instructor or co-instructor.
                </p>
                {!isMobile && (
                  <Tooltip
                    arrowOffset={125}
                    arrowSize={8}
                    arrowRadius={1}
                    events={{ hover: true, focus: true, touch: true }}
                    transitionProps={{
                      transition: "fade",
                      duration: 300,
                    }}
                    multiline
                    withArrow
                    label={
                      <div className=" text-default text-b3 acerSwift:max-macair133:text-b4 p-2 flex flex-col gap-1 w-[40vw]">
                        <p className="text-secondary font-bold">What is CLO?</p>

                        <p className="font-normal text-b3 acerSwift:max-macair133:text-b4  ">
                          <span className="font-bold">
                            {" "}
                            Course Learning Outcome (CLO)
                          </span>{" "}
                          refers to{" "}
                          <span className="font-bold">
                            what students should be able to know, understand,
                            and do{" "}
                          </span>{" "}
                          after completing a course. It serves as a guideline
                          for both instructors and students to ensure that
                          learning objectives are met effectively. CLOs are
                          typically designed to be measurable and specific,
                          focusing on different aspects of learning, such as:{" "}
                          <span className="font-bold"> Knowledge</span>{" "}
                          (understanding theories, concepts, and principles),{" "}
                          <span className="font-bold"> Skills</span> (applying
                          knowledge to solve problems or perform tasks),{" "}
                          <span className="font-bold">
                            {" "}
                            Attitudes and Values
                          </span>{" "}
                          (developing ethical perspectives, teamwork, or
                          communication skills)
                        </p>
                      </div>
                    }
                    color="#FCFCFC"
                    className="w-fit border rounded-md sm:max-acerSwift:!-ml-2"
                    position="bottom-start"
                  >
                    <Button
                      className="mt-3 flex justify-center items-center"
                      variant="light"
                      leftSection={
                        <Icon
                          IconComponent={IconBulb}
                          className="size-[20px] stroke-[1.5px] -mt-[2px]  items-center"
                        />
                      }
                    >
                      What is CLO?
                    </Button>
                  </Tooltip>
                )}
              </div>
              {!isMobile && (
                <div className=" items-center justify-center flex">
                  <img
                    src={notFoundImage}
                    className="h-full items-center  w-[24vw] justify-center flex flex-col"
                    alt="notFound"
                  ></img>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
