import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import maintenace from "@/assets/image/maintenance.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import { ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { RadarChart } from "@mantine/charts";
import { Button, Table, Tabs } from "@mantine/core";
import DrawerPLOdes from "@/components/DrawerPLO";
import Icon from "@/components/Icon";
import { log } from "console";
import { IModelPLO } from "@/models/ModelPLO";
import { getOnePLO } from "@/services/plo/plo.service";

export default function StdOverallPLO() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const [activeTab, setActiveTab] = useState<string | null>("curriculum");
  const [departmentPLO, setDepartmentPLO] = useState<Partial<IModelPLO>>({});
  const user = useAppSelector((state) => state.user);
  const term = useAppSelector((state) =>
    state.academicYear.find(
      (term) =>
        term.year == parseInt(params.get("year") || "") &&
        term.semester == parseInt(params.get("semester") || "")
    )
  );

  const fetchPLO = async () => {
    const departmentCode = user?.departmentCode?.[0];

    const resPloCol = await getOnePLO({
      year: term?.year,
      semester: term?.semester,
      codeEN: departmentCode,
    });
    if (resPloCol) {
      setDepartmentPLO(resPloCol);
    }
  };

  const dispatch = useAppDispatch();
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);
  const [test, setTest] = useState(true);

  useEffect(() => {
    console.log(user);
  });

  useEffect(() => {
    if (user) {
      fetchPLO();
    }
  }, [user]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  const data = [
    {
      product: "PLO 1",
      ผลการประเมินเฉลี่ยรวม: 1,
    },
    {
      product: "PLO 2",
      ผลการประเมินเฉลี่ยรวม: 4,
    },
    {
      product: "PLO 3",
      ผลการประเมินเฉลี่ยรวม: 3,
    },
    {
      product: "PLO 4",
      ผลการประเมินเฉลี่ยรวม: 2,
    },
    {
      product: "PLO 5",
      ผลการประเมินเฉลี่ยรวม: 4,
    },
    {
      product: "PLO 6",
      ผลการประเมินเฉลี่ยรวม: 2,
    },
    {
      product: "PLO 7",
      ผลการประเมินเฉลี่ยรวม: 4,
    },
  ];

  type Course = {
    id: number;
    code: string;
    name: string;
    data: any;
  };

  const courses: Course[] = [
    { id: 1, code: "261101", name: "Introduction to Programming", data: [] },
    { id: 2, code: "261102", name: "Object-Oriented Programming", data: [] },
    { id: 3, code: "261103", name: "Data Structures", data: [] },
    { id: 4, code: "261104", name: "Algorithms", data: [] },
    { id: 5, code: "261105", name: "Database Systems", data: [] },
    { id: 6, code: "261106", name: "Operating Systems", data: [] },
    { id: 7, code: "261107", name: "Computer Networks", data: [] },
    { id: 8, code: "261108", name: "Software Engineering", data: [] },
    { id: 9, code: "261109", name: "Web Development", data: [] },
    {
      id: 10,
      code: "261110",
      name: "Mobile Application Development",
      data: [],
    },
    { id: 11, code: "261111", name: "Machine Learning", data: [] },
    { id: 12, code: "261112", name: "Artificial Intelligence", data: [] },
  ];

  return (
    <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3">
      {loading ? (
        <Loading />
      ) : (
        <>
          {departmentPLO && (
            <DrawerPLOdes
              opened={openDrawerPLOdes}
              onClose={() => setOpenDrawerPLOdes(false)}
              data={departmentPLO}
              department={user.departmentCode[0]}
            />
          )}
          {/* 
          <div className="flex flex-row -mt-2 items-center justify-between">
            {test ? (
              // <p className="text-secondary text-[16px] font-semibold">
              //   ผลการเรียนรู้ของผู้เรียน
              //   <span className="">ตลอดหลักสูตร</span> อ้างอิงตามเกณฑ์ของ ABET
              //   <br />
              //   Overall Program Learning Outcome
              // </p>
              <div className="flex flex-col">
                <p className="text-secondary text-[18px] font-semibold ">
                  Hi there, {user.firstNameEN}
                </p>
                <p className="text-[#575757] text-[14px]">
                  You have completed{" "}
                  <span className="text-[#1f69f3] font-semibold">
                    12 Courses{" "}
                  </span>
                  In CPE curriculum
                </p>
              </div>
            ) : (
              <></>
            )}
            <Button
              className="text-center px-4"
              onClick={() => setOpenDrawerPLOdes(true)}
            >
              <div className="flex gap-2 acerSwift:max-macair133:!text-b5">
                <Icon
                  IconComponent={IconPLO}
                  className="acerSwift:max-macair133:!size-3"
                />
                PLO Description
              </div>
            </Button>
          </div>

          <Tabs
            classNames={{
              root: "overflow-hidden -mt-0.5 flex flex-col h-full",
            }}
            value={activeTab}
            onChange={setActiveTab}
          >
            <Tabs.List className="mb-2">
              <Tabs.Tab value="curriculum">Curriculum</Tabs.Tab>
              <Tabs.Tab value="course">Course</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel
              className="flex flex-col gap-1 h-full"
              value="curriculum"
            >
              <div className="flex px-24 h-full items-center border rounded-lg mt-2">
                <div className="flex flex-col justify-center items-center w-[50%] -mt-8">
                  <RadarChart
                    h={500}
                    data={data}
                    dataKey="product"
                    series={[
                      {
                        name: "ผลการประเมินเฉลี่ยรวม",
                        color: "blue",
                        strokeColor: "blue",
                      },
                    ]}
                    gridColor="#C5C5DA"
                    textColor="#000000"
                    polarAngleAxisProps={{}}
                    withPolarRadiusAxis
                    className="w-full"
                  />
                  <div className="flex gap-2 items-center -mt-8">
                    <div className="bg-blue-600 h-3 w-3 rounded-full"></div>
                    <p> ผลการประเมินเฉลี่ยรวม </p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-[50%] ">
                  <div className="overflow-y-auto flex overflow-x-auto w-80 h-fit max-h-full border rounded-lg border-secondary">
                    <Table stickyHeader>
                      <Table.Thead>
                        <Table.Tr className="bg-[#e5e7f6]">
                          <Table.Th>PLO</Table.Th>
                          <Table.Th>Score</Table.Th>
                          <Table.Th>Evaluation</Table.Th>
                        </Table.Tr>
                      </Table.Thead>

                      <Table.Tbody className="text-default sm:max-macair133:text-b4 font-medium text-[13px] ">
                        {data.map((Item, index) => {
                          return (
                            <Table.Tr key={index}>
                              <Table.Td>PLO {index + 1}</Table.Td>
                              <Table.Td>
                                <p>4</p>
                              </Table.Td>
                              <Table.Td>
                                <p>Excellent</p>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel
              className="flex flex-col gap-1 overflow-y-auto mb-12"
              value="course"
            >
              <div className="grid grid-cols-3 gap-4 mt-2 h-full">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border rounded-lg text-b2 shadow-sm flex flex-col gap-4"
                  >
                    <div className="px-4 pt-4">
                      <p className="font-bold">{course.code}</p>
                      <p className="text-b4 text-[#4b5563]">{course.name}</p>
                    </div>
                    <RadarChart
                      h={320}
                      data={data}
                      dataKey="product"
                      series={[
                        {
                          name: "ผลการประเมินเฉลี่ยรวม",
                          color: "blue",
                          strokeColor: "blue",
                        },
                      ]}
                      gridColor="#C5C5DA"
                      textColor="#000000"
                      // polarAngleAxisProps={{}}
                      withPolarRadiusAxis
                      className=""
                    />
                  </div>
                ))}
              </div>
            </Tabs.Panel>
          </Tabs> */}

          <div className=" flex flex-col h-full w-full  overflow-hidden">
            <div className="flex flex-row px-6 pt-3   items-center justify-between">
              <div className="flex flex-col">
                <p className="text-secondary text-[18px] font-semibold "></p>
              </div>
            </div>

            <div className="flex items-center  !h-full !w-full justify-between px-16">
              <div className="h-full  translate-y-2  justify-center flex flex-col">
                <p className="text-secondary text-[21px] font-semibold">
                  Overall PLO is coming soon to{" "}
                  <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    ScoreOBE +{" "}
                  </span>{" "}
                </p>
                <br />
                <p className=" -mt-4 mb-6 text-b2 break-words font-medium leading-relaxed">
                  Overall PLO will be available for students February 2025.
                </p>
              </div>
              <div className="h-full  w-[25vw] justify-center flex flex-col">
                <img src={maintenace} alt="notFound"></img>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
