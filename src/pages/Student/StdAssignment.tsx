import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import notFoundImage from "@/assets/image/notFound.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { Table } from "@mantine/core";
import { calStat } from "@/helpers/functions/score";
import { isMobile } from "@/helpers/functions/function";
import IconChevron from "@/assets/icons/chevronRight.svg?react";
import Icon from "@/components/Icon";

export default function StdAssignment() {
  const { courseNo } = useParams();
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
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

  const goToAssignment = (name: string) => {
    navigate({
      pathname: `${path}/${name}`,
      search: "?" + params.toString(),
    });
  };

  return (
    <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:px-3 iphone:max-sm:py-3 sm:py-5 gap-3 overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <>
          {course?.section?.assignments?.length !== 0 && (
            <div className="flex flex-row  py-1  items-center justify-between">
              <p className="text-secondary text-b1 acerSwift:max-macair133:text-b2 mb-2 font-semibold">
                {course?.section?.assignments?.length} Evaluation
                {course?.section?.assignments?.length! > 1 && "s"}
              </p>
            </div>
          )}

          {course?.section?.assignments?.length !== 0 ? (
            !isMobile ? (
              <div
                className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full  border flex flex-col rounded-lg border-secondary"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                  height: "fit-content",
                }}
              >
                <Table stickyHeader>
                  <Table.Thead>
                    <Table.Tr className="bg-[#e5e7f6]">
                      <Table.Th className="w-[10%]">Question</Table.Th>
                      <Table.Th className="text-end w-[10%]">
                        Your Score
                      </Table.Th>
                      <Table.Th className="text-end w-[10%]">Mean</Table.Th>
                      <Table.Th className="text-end w-[10%]">SD</Table.Th>
                      <Table.Th className="text-end w-[10%]">Median</Table.Th>
                      <Table.Th className="text-end w-[10%]">Max</Table.Th>
                      <Table.Th className="text-end w-[10%]">Q3</Table.Th>
                      <Table.Th className="text-end w-[10%] pr-[30px]">
                        Q1
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody className="text-default sm:max-macair133:text-b4 font-medium text-[13px] ">
                    {course?.section?.assignments?.map((assignment, index) => {
                      const totalStudent = assignment.scores.length;
                      const stat = calStat(assignment.scores, totalStudent);
                      return (
                        <Table.Tr
                          key={index}
                          className={`hover:bg-[#F3F3F3] cursor-pointer ${
                            index % 2 === 0 && "bg-[#F8F9FA]"
                          }`}
                          onClick={() => goToAssignment(`${assignment.name}`)}
                        >
                          <Table.Td>{assignment.name}</Table.Td>

                          <Table.Td className="text-end ">
                            {course?.scores
                              .find(
                                ({ assignmentName }) =>
                                  assignmentName == assignment.name
                              )
                              ?.questions.filter(({ score }) => score >= 0)
                              .reduce((a, { score }) => a + score, 0)
                              .toFixed(2)}{" "}
                            /{" "}
                            {assignment.questions
                              .reduce((a, { fullScore }) => a + fullScore, 0)
                              .toFixed(2)}
                          </Table.Td>

                          <Table.Td className="text-end">
                            {stat.mean.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end">
                            {stat.sd.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end">
                            {stat.median.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end">
                            {stat.maxScore.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end">
                            {stat.q3.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end  pr-[30px]">
                            {stat.q1 ? stat.q1.toFixed(2) : "-"}
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto h-full ">
                {" "}
                {course?.section?.assignments?.map((assignment, index) => {
                  const totalStudent = assignment.scores.length;
                  const stat = calStat(assignment.scores, totalStudent);
                  return (
                    <div
                      key={index}
                      className={`border flex flex-col hover:bg-slate-50 justify-between rounded-md p-3 `}
                      onClick={() => goToAssignment(`${assignment.name}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className=" font-semibold text-default text-[14px]">
                            {assignment.name}
                          </div>

                          <div className="font-semibold text-secondary text-[14px] ">
                            {course?.scores
                              .find(
                                ({ assignmentName }) =>
                                  assignmentName == assignment.name
                              )
                              ?.questions.filter(({ score }) => score >= 0)
                              .reduce((a, { score }) => a + score, 0)
                              .toFixed(2)}{" "}
                            /{" "}
                            {assignment.questions
                              .reduce((a, { fullScore }) => a + fullScore, 0)
                              .toFixed(2)}
                          </div>
                        </div>
                        <Icon IconComponent={IconChevron} />
                      </div>
                      <div className="mt-2 text-[12px] border-t flex flex-col ">
                        {" "}
                        <div className="grid grid-cols-2 p-2 mt-1  rounded-t-md">
                          <div className="flex flex-col">
                            <div className="text-start">Mean</div>
                            <p className="text-[13px] font-semibold">
                              {stat.mean.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <div className="text-start">SD</div>
                            <p className="text-[13px] font-semibold">
                              {" "}
                              {stat.sd.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 p-2  ">
                          <div className="flex flex-col">
                            <div className="text-start">Median</div>
                            <p className="text-[13px] font-semibold">
                              {stat.median.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <div className="text-start">Max</div>
                            <p className="text-[13px] font-semibold">
                              {stat.maxScore.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 p-2  rounded-b-md">
                          <div className="flex flex-col">
                            <div className="text-start">Q3</div>
                            <p className="text-[13px] font-semibold">
                              {stat.q3.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <div className="text-start ">Q1</div>
                            <p className="text-[13px] font-semibold">
                              {stat.q1 ? stat.q1.toFixed(2) : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="flex items-center  !h-full !w-full justify-between  sm:px-16">
              <div className="flex flex-col gap-3 iphone:max-sm:text-center sm:text-start">
                <p className="!h-full text-[20px] text-secondary font-semibold">
                  No Evaluation
                </p>
                <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                  The evaluation will show when your score is published <br />{" "}
                  by the instructor or co-instructor.
                </p>
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
        </>
      )}
    </div>
  );
}
