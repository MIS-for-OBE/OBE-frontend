import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Modal, Table, Tabs } from "@mantine/core";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading/Loading";
import { calStat } from "@/helpers/functions/score";
import { ROLE } from "@/helpers/constants/enum";
import ModalQuestionChart from "@/components/Modal/ModalQuestionChart";
import Icon from "@/components/Icon";
import IconChart from "@/assets/icons/histogram.svg?react";
import ChartContainer from "@/components/Chart/ChartContainer";

export default function Overall() {
  const { courseNo, sectionNo, name } = useParams();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const section = course?.sections.find(
    (sec) => parseInt(sectionNo!) === sec.sectionNo
  );
  const assignment = section?.assignments?.find((item) => item.name == name);
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [selectQuestion, setSelectQuestion] = useState<any>();
  const [openModalQuestionChart, setOpenModalQuestionChart] = useState(false);
  const [openModalChart, setOpenModalChart] = useState(false);

  const [items, setItems] = useState<any[]>([
    {
      title: "Your Course",
      path: `${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    {
      title: `Evaluation Section ${getSectionNo(sectionNo)}`,
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }/${sectionNo}/${ROUTE_PATH.EVALUATION}?${params.toString()}`,
    },
    { title: `${name}` },
  ]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.INSTRUCTOR));
    localStorage.setItem("dashboard", ROLE.INSTRUCTOR);
  }, []);

  const fullScore =
    assignment?.questions.reduce((a, { fullScore }) => a + fullScore, 0) || 0;
  const scores = section?.students
    ?.map(({ scores }) =>
      scores
        .find(({ assignmentName }) => assignmentName == name)
        ?.questions?.filter(({ score }) => score >= 0)
        .reduce((sum, { score }) => sum + score, 0)
    )
    .filter((item) => item != undefined)
    .sort((a, b) => a - b) || [0];
  const totalStudent =
    section?.students?.filter((item) =>
      item.scores.find(({ assignmentName }) => assignmentName == name)
    ).length || 0;
  const { mean, sd, median, maxScore, minScore, q1, q3 } = calStat(
    scores,
    totalStudent
  );
  const k = Math.log2(totalStudent) + 1;
  const binWidth = (maxScore - minScore) / k;
  const scoresData = Array.from({ length: k }, (_, index) => {
    const start = minScore + index * binWidth;
    const end = start + binWidth;
    return {
      range: `${start.toFixed(2)} - ${end.toFixed(2)}`,
      start,
      end,
      Students: 0,
    };
  });
  scores.forEach((score) => {
    const binIndex = scoresData.findIndex(
      (item) => item.start <= score && item.end >= score
    );
    if (binIndex !== -1) {
      scoresData[binIndex].Students += 1;
    }
  });

  return (
    <>
      <Modal
        opened={openModalChart}
        onClose={() => setOpenModalChart(false)}
        centered
        size="80vw"
        title={`Chart - ${name} (${fullScore?.toFixed(2)} Points)`}
        transitionProps={{ transition: "pop" }}
        classNames={{
          content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
          body: "flex flex-col gap-4 overflow-hidden max-h-full h-fit",
          title: "acerSwift:max-macair133:!text-b1",
        }}
      >
        <div className="-mt-2">
          <Tabs
            classNames={{
              root: "overflow-hidden mt-1 mx-3 flex flex-col max-h-full",
            }}
            defaultValue="bellCurve"
          >
            <Tabs.List className="mb-2">
              <Tabs.Tab value="bellCurve" className="custom-tab-class">
                Distribution
              </Tabs.Tab>
              <Tabs.Tab value="histogram" className="custom-tab-class">
                Histogram
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel className="flex flex-col gap-1" value="histogram">
              {assignment ? (
                <ChartContainer
                  type="histogram"
                  data={assignment}
                  inEval={true}
                  students={section?.students || []}
                />
              ) : (
                <p className="text-center text-gray-500">No data available</p>
              )}
            </Tabs.Panel>
            <Tabs.Panel
              className="flex flex-col justify-center items-center acerSwift:max-macair133:ml-12"
              value="bellCurve"
            >
              {assignment ? (
                <>
                  <ChartContainer
                    type="curve"
                    data={assignment}
                    inEval={true}
                    students={section?.students || []}
                  />
                  <p className="text-b6 mb-2">
                    Score distribution powered by Andrew C. Myers (Cornell
                    University)
                  </p>
                </>
              ) : (
                <p className="text-center text-gray-500">No data available</p>
              )}
            </Tabs.Panel>
          </Tabs>
        </div>
      </Modal>
      <ModalQuestionChart
        opened={openModalQuestionChart}
        onClose={() => setOpenModalQuestionChart(false)}
        question={selectQuestion}
      />
      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            <div className="flex flex-col pt-2 pb-3 items-start gap-4 text-start">
              <div className="flex justify-between w-full px-2 items-center">
                <div className="flex flex-col py-1">
                  <div className="flex gap-1">
                    <p className="text-[#3f4474] font-semibold text-b1 acerSwift:max-macair133:!size-b2">
                      {name}
                    </p>
                    <div
                      className="p-1 rounded-full w-6 h-6 bg-deemphasize/10 hover:bg-deemphasize/20"
                      onClick={() => setOpenModalChart(true)}
                    >
                      <Icon
                        IconComponent={IconChart}
                        className="size-3 acerSwift:max-macair133:size-3 text-[#3f4474] cursor-pointer"
                      />
                    </div>
                  </div>
                  <p className="text-secondary text-h1 acerSwift:max-macair133:!text-h2 font-semibold">
                    {fullScore?.toFixed(2)}{" "}
                    <span className="text-b1 acerSwift:max-macair133:!size-b2 ">
                      pts.
                    </span>
                  </p>
                </div>
                <p className="text-[#3f4474] mb-1 font-semibold sm:max-macair133:text-b2 text-b1 acerSwift:max-macair133:!size-b2">
                  {totalStudent} Students
                </p>
              </div>
              <div className="flex px-10 flex-row justify-between w-full">
                <div className="flex flex-col">
                  <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                    Mean
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                    {mean.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                    SD
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                    {sd.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                    Median
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                    {median.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col px-1.5">
                  <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                    Max
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                    {maxScore.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col px-1.5">
                  <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                    Min
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                    {minScore.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                    Q3
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                    {q3.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                    Q1
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                    {q1 ? q1.toFixed(2) : "-"}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="relative overflow-auto mt-2 border rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
              }}
            >
              <Table className="sticky top-0 z-[1]">
                <Table.Thead>
                  <Table.Tr className="bg-[#dfebff]">
                    <Table.Th className="w-[12%] acerSwift:max-macair133:!text-b3">
                      Question
                    </Table.Th>
                    <Table.Th className="text-end pr-[50px] w-[14%] acerSwift:max-macair133:!text-b3">
                      Full Score
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b3">
                      Mean
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b3">
                      SD
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b3">
                      Median
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b3">
                      Max
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b3">
                      Q3
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b3">
                      Q1
                    </Table.Th>
                    {/* <Table.Th className="text-end pr-[70px] w-[8%]"></Table.Th> */}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="text-default">
                  {assignment?.questions.map((ques, index) => {
                    const dataScores =
                      section?.students
                        ?.flatMap(({ scores }) =>
                          scores
                            .filter((item) => item.assignmentName === name)
                            .flatMap((item) =>
                              item.questions.filter((q) => q.name === ques.name)
                            )
                            .map((question) => question.score)
                            .filter((e) => e >= 0)
                        )
                        .sort((a, b) => a - b) || [];
                    const stat = calStat(dataScores, scores?.length);
                    return (
                      <Table.Tr
                        key={index}
                        className={`hover:bg-[#F3F3F3] text-[13px] font-normal py-[14px] w-full cursor-pointer ${
                          index % 2 === 0 && "bg-[#F8F9FA]"
                        }`}
                        onClick={() => {
                          setSelectQuestion({
                            assignment,
                            ...ques,
                            scores,
                            students: section?.students,
                          });
                          setOpenModalQuestionChart(true);
                        }}
                      >
                        <Table.Td className="text-start w-[12%] acerSwift:max-macair133:!text-b4">
                          {ques.name}
                        </Table.Td>
                        <Table.Td className="text-end pr-[50px] w-[14%] acerSwift:max-macair133:!text-b4">
                          {ques.fullScore}
                        </Table.Td>
                        <Table.Td className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b4">
                          {stat.mean.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b4">
                          {stat.sd.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b4">
                          {stat.median.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-[70px]  w-[11%] acerSwift:max-macair133:!text-b4">
                          {stat.maxScore.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b4">
                          {stat.q3.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-[70px] w-[11%] acerSwift:max-macair133:!text-b4">
                          {stat.q1 ? stat.q1.toFixed(2) : "-"}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>
          </>
        ) : (
          <div className="flex px-16  flex-row items-center justify-between h-full">
            <div className="flex justify-center  h-full items-start gap-2 flex-col">
              <p className="   text-secondary font-semibold text-[22px]">
                You need access
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px]">
                You're not listed as a Co-Instructor. <br /> Please contact the
                Owner section for access.
              </p>
            </div>
            <img
              className=" z-50  size-[460px] "
              src={needAccess}
              alt="loginImage"
            />
          </div>
        )}
      </div>
    </>
  );
}
