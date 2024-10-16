import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import {
  Accordion,
  Alert,
  Button,
  Menu,
  Modal,
  Pill,
  Table,
} from "@mantine/core";
import eyePublish from "@/assets/icons/eyePublish.svg?react";
import publish from "@/assets/icons/publish.svg?react";
import publishEach from "@/assets/icons/publishEach.svg?react";
import publishAll from "@/assets/icons/publishAll.svg?react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading";
import { BarChart } from "@mantine/charts";

export default function Overall() {
  const { courseNo, sectionNo, name } = useParams();
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const section = course?.sections.find(
    (sec) => parseInt(sectionNo!) === sec.sectionNo
  );
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any[]>([
    {
      title: "Your Course",
      path: `${ROUTE_PATH.DASHBOARD_INS}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    {
      title: `Assignment Section ${getSectionNo(sectionNo)}`,
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }/${sectionNo}/${ROUTE_PATH.ASSIGNMENT}?${params.toString()}`,
    },
    { title: `${name}` },
  ]);
  const [openAllPublishModal, setOpenAllPublishModal] = useState(false);

  const data = [
    { month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
    { month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
    { month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
    { month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
    { month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
    { month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
  ];

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  console.log("Overall");

  return (
    <>
      <div className="bg-white flex flex-col h-full w-full p-6 pb-3 pt-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {/* <Breadcrumbs /> */}
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            <div className="flex flex-col border-b-2 border-nodata py-2 items-start gap-5 text-start">
              <p className="text-secondary text-[18px] font-semibold">
                {name} - 5.0 Points
              </p>
              <div className="flex px-16 flex-row justify-between w-full">
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Mean
                  </p>
                  <p className="font-bold text-[28px] text-secondary">2.0</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">SD</p>
                  <p className="font-bold text-[28px] text-secondary">2.15</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Median
                  </p>
                  <p className="font-bold text-[28px] text-default">1.5</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Max
                  </p>
                  <p className="font-bold text-[28px] text-default">4.5</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Min
                  </p>
                  <p className="font-bold text-[28px] text-default">0</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q3</p>
                  <p className="font-bold text-[28px] text-default">3.75</p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q1</p>
                  <p className="font-bold text-[28px] text-default">1.75</p>
                </div>
              </div>
            </div>
            {/* Table */}
            <div
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader className="sticky top-0 bg-white z-10">
                <Table.Thead>
                  <Table.Tr className="bg-[#e5e7f6]">
                    <Table.Th className="w-[220px]">Question</Table.Th>
                    <Table.Th className="text-end pr-10 w-[130px]">
                      Points
                    </Table.Th>
                    <Table.Th className="text-end pr-10 w-[130px]">
                      Mean
                    </Table.Th>
                    <Table.Th className="text-end pr-10 w-[130px]">SD</Table.Th>
                    <Table.Th className="text-end pr-10 w-[130px]">
                      Median
                    </Table.Th>
                    <Table.Th className="text-end pr-10 w-[130px]">
                      Max
                    </Table.Th>
                    <Table.Th className="text-end pr-10 w-[130px]">Q3</Table.Th>
                    <Table.Th className="text-end pr-10 w-[130px]">Q1</Table.Th>
                    <Table.Th className="text-end pr-10"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
              </Table>
              <Table>
                <Table.Tbody className="text-default text-b3">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Accordion
                      key={index}
                      variant="default"
                      multiple={false}
                      className={`hover:bg-[#F3F3F3] ${
                        index % 2 === 0 ? "bg-[#F8F9FA]" : ""
                      }`}
                    >
                      <Accordion.Item value={`${index + 1}`} key={index}>
                        <Accordion.Control
                          className="pl-0 pr-12 hover:bg-[#F3F3F3]"
                          classNames={{
                            label: `py-2`,
                          }}
                        >
                          {/* Entire Table Row as Control */}
                          <Table.Tr className="text-[12px] font-normal py-[14px] w-full">
                            <Table.Td className="w-[220px]">
                              No. {index + 1}
                            </Table.Td>
                            <Table.Td className="text-end pr-10 w-[130px]">
                              5.0
                            </Table.Td>
                            <Table.Td className="text-end pr-10 w-[130px]">
                              2.0
                            </Table.Td>
                            <Table.Td className="text-end pr-10 w-[130px]">
                              10.0
                            </Table.Td>
                            <Table.Td className="text-end pr-10 w-[130px]">
                              25
                            </Table.Td>
                            <Table.Td className="text-end pr-10 w-[130px]">
                              5.0
                            </Table.Td>
                            <Table.Td className="text-end pr-10 w-[130px]">
                              2.0
                            </Table.Td>
                            <Table.Td className="text-end pr-10 w-[130px]">
                              10.0
                            </Table.Td>
                          </Table.Tr>
                        </Accordion.Control>

                        <Accordion.Panel className="pb-4">
                          <div className="flex justify-between px-20 pb-4">
                            <p className="text-secondary text-[16px] font-semibold">
                              No. {index + 1} - 5.0 Points
                            </p>
                            <p className="text-secondary text-[16px] font-semibold">
                              120 Students
                            </p>
                          </div>

                          <div className="h-full w-full px-20 ">
                            <BarChart
                              h={300}
                              tickLine="x"
                              data={data}
                              dataKey="month"
                              series={[
                                { name: "Smartphones", color: "violet.6" },
                                { name: "Laptops", color: "blue.6" },
                                { name: "Tablets", color: "teal.6" },
                              ]}
                            />
                          </div>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  ))}
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