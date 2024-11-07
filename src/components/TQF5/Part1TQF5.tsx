import { Button, Table } from "@mantine/core";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import Icon from "../Icon";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part1TQF5({ setForm }: Props) {
  const studentData = [
    {
      section: "001",
      a: "3",
      bplus: "3",
      b: "2",
      cplus: "2",
      c: "2",
      dplus: "2",
      d: "2",
      f: "1",
      w: "0",
      s: "0",
      u: "0",
      p: "0",
      total: "17",
      avg: "3.14",
    },
    {
      section: "002",
      a: "5",
      bplus: "2",
      b: "1",
      cplus: "8",
      c: "2",
      dplus: "0",
      d: "1",
      f: "3",
      w: "0",
      s: "0",
      u: "0",
      p: "0",
      total: "22",
      avg: "2.99",
    },
    {
      section: "701",
      a: "0",
      bplus: "2",
      b: "8",
      cplus: "6",
      c: "1",
      dplus: "5",
      d: "6",
      f: "2",
      w: "0",
      s: "0",
      u: "0",
      p: "0",
      total: "30",
      avg: "2.74",
    },
    {
      section: "801",
      a: "4",
      bplus: "8",
      b: "4",
      cplus: "2",
      c: "9",
      dplus: "6",
      d: "3",
      f: "1",
      w: "0",
      s: "0",
      u: "0",
      p: "0",
      total: "37",
      avg: "2.88",
    },
  ];
  const rows = studentData.map((element) => (
    <Table.Tr
      className="font-medium text-default text-[13px]"
      key={element.section}
    >
      <Table.Td>{element.section}</Table.Td>
      <Table.Td>{element.a}</Table.Td>
      <Table.Td>{element.bplus}</Table.Td>
      <Table.Td>{element.b}</Table.Td>
      <Table.Td>{element.cplus}</Table.Td>
      <Table.Td>{element.c}</Table.Td>
      <Table.Td>{element.dplus}</Table.Td>
      <Table.Td>{element.d}</Table.Td>
      <Table.Td>{element.f}</Table.Td>
      <Table.Td>{element.w}</Table.Td>
      <Table.Td>{element.s}</Table.Td>
      <Table.Td>{element.u}</Table.Td>
      <Table.Td>{element.p}</Table.Td>
      <Table.Td>{element.total}</Table.Td>
      <Table.Td>{element.avg}</Table.Td>
    </Table.Tr>
  ));
  const gradedata = [
    {
      grade: "A",
      scoreRange: "80.00 to 100.00",
    },
    {
      grade: "A",
      scoreRange: "80.00 to 100.00",
    },
    {
      grade: "A",
      scoreRange: "80.00 to 100.00",
    },
    {
      grade: "A",
      scoreRange: "80.00 to 100.00",
    },
    {
      grade: "A",
      scoreRange: "80.00 to 100.00",
    },
    {
      grade: "A",
      scoreRange: "80.00 to 100.00",
    },
    {
      grade: "A",
      scoreRange: "80.00 to 100.00",
    },
  ];
  const rows2 = gradedata.map((element) => (
    <Table.Tr
      className="font-medium text-default text-[13px]"
      key={element.grade}
    >
      <Table.Td>{element.grade}</Table.Td>
      <Table.Td>{element.scoreRange}</Table.Td>
    </Table.Tr>
  ));
  return (
    <div className="flex w-full flex-col text-[15px] max-h-full gap-2  text-default ">
      <div className="flex text-secondary gap-4  w-full border-b-[1px] border-[#e6e6e6] pb-6 flex-col">
        <div className="flex text-secondary items-center justify-between flex-row gap-1  text-[15px]">
          <p className="font-bold">
            Student grading<span className="ml-1 text-red-500">*</span>
          </p>
          <Button
            leftSection={<Icon IconComponent={IconUpload} className="size-4" />}
            className="font-bold"
          >
            Upload Grade Sheet
          </Button>
        </div>
        <div
          className="w-full h-fit bg max-h-full border flex flex-col rounded-lg border-secondary"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
            height: "fit-content",
          }}
        >
          <Table striped>
            <Table.Thead>
              {/* First row of headers */}
              <Table.Tr className="bg-[#e5e7f6] border-b-[1px] border-secondary">
                <Table.Th
                  className="!rounded-tl-[8px] items-center justify-center  text-center !rounded-tr-[8px] w-full"
                  colSpan={15}
                >
                  จำนวนนักศึกษา (Number of Students)
                </Table.Th>
              </Table.Tr>

              {/* Second row of headers */}
              <Table.Tr className="bg-[#e5e7f6]">
                <Table.Th className=" w-[10%]">Section</Table.Th>
                <Table.Th className=" w-[6%]">A</Table.Th>
                <Table.Th className=" w-[6%]">B+</Table.Th>
                <Table.Th className=" w-[6%]">B</Table.Th>
                <Table.Th className=" w-[6%]">C+</Table.Th>
                <Table.Th className=" w-[6%]">C</Table.Th>
                <Table.Th className=" w-[6%]">D+</Table.Th>
                <Table.Th className=" w-[6%]">D</Table.Th>
                <Table.Th className=" w-[6%]">F</Table.Th>
                <Table.Th className=" w-[6%]">W</Table.Th>
                <Table.Th className=" w-[6%]">S</Table.Th>
                <Table.Th className=" w-[6%]">U</Table.Th>
                <Table.Th className=" w-[6%]">P</Table.Th>
                <Table.Th className=" w-[9%]">Total</Table.Th>
                <Table.Th className=" w-[9%]">Avg</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>{rows}</Table.Tbody>
            <Table.Tfoot className=" !bg-bgTableHeader  !border-t-[1px] border-secondary sticky bottom-0">
              <Table.Tr className="border-none text-secondary font-semibold">
                <Table.Th className="rounded-bl-[8px] w-[10%]">Total</Table.Th>
                <Table.Th className=" w-[6%]">12</Table.Th>
                <Table.Th className=" w-[6%]">15</Table.Th>
                <Table.Th className=" w-[6%]">15</Table.Th>
                <Table.Th className=" w-[6%]">18</Table.Th>
                <Table.Th className=" w-[6%]">14</Table.Th>
                <Table.Th className=" w-[6%]">13</Table.Th>
                <Table.Th className=" w-[6%]">12</Table.Th>
                <Table.Th className=" w-[6%]">7</Table.Th>
                <Table.Th className=" w-[6%]">0</Table.Th>
                <Table.Th className=" w-[6%]">0</Table.Th>
                <Table.Th className=" w-[6%]">0</Table.Th>
                <Table.Th className=" w-[6%]">0</Table.Th>
                <Table.Th className=" w-[9%]">106</Table.Th>
                <Table.Th className="!rounded-br-[8px] w-[9%]">2.94</Table.Th>
              </Table.Tr>
            </Table.Tfoot>
          </Table>
        </div>
      </div>
      <div className="flex text-secondary gap-4 items-center justify-center  w-full border-b-[1px] border-[#e6e6e6] pb-6 flex-col">
        <div className="flex text-secondary items-center w-full justify-between flex-row gap-1 mt-2 text-[15px]">
          <p className="font-bold">
            Grading criteria<span className="ml-1 text-red-500">*</span>
          </p>
          <Button
            leftSection={<Icon IconComponent={IconEdit} className="size-4" />}
            className="font-bold"
            color="#ee933e"
          >
            Edit Grade criteria
          </Button>
        </div>
        <div
          className="w-[50%] h-fit bg max-h-full border items-center justify-center flex flex-col rounded-lg border-secondary"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
            height: "fit-content",
          }}
        >
          <Table striped className=" w-full">
            <Table.Thead>
              {/* First row of headers */}
              <Table.Tr className="bg-[#e5e7f6] border-b-[1px] border-secondary">
                <Table.Th className="!rounded-tl-[8px] items-center justify-center  text-center  w-[25%]">
                  Grade
                </Table.Th>
                <Table.Th className="items-center justify-center  text-center !rounded-tr-[8px] w-[25%]">
                  Score range
                </Table.Th>
              </Table.Tr>

              {/* Second row of headers */}
              {/* <Table.Tr className="bg-[#e5e7f6]">
                <Table.Th className=" w-[10%]">Section</Table.Th>
                <Table.Th className=" w-[6%]">A</Table.Th>
                <Table.Th className=" w-[6%]">B+</Table.Th>
                <Table.Th className=" w-[6%]">B</Table.Th>
                <Table.Th className=" w-[6%]">C+</Table.Th>
                <Table.Th className=" w-[6%]">C</Table.Th>
                <Table.Th className=" w-[6%]">D+</Table.Th>
                <Table.Th className=" w-[6%]">D</Table.Th>
                <Table.Th className=" w-[6%]">F</Table.Th>
                <Table.Th className=" w-[6%]">W</Table.Th>
                <Table.Th className=" w-[6%]">S</Table.Th>
                <Table.Th className=" w-[6%]">U</Table.Th>
                <Table.Th className=" w-[6%]">P</Table.Th>
                <Table.Th className=" w-[9%]">Total</Table.Th>
                <Table.Th className=" w-[9%]">Avg</Table.Th>
              </Table.Tr> */}
            </Table.Thead>

            <Table.Tbody className="  justify-center items-center text-center ">{rows2}</Table.Tbody>
            {/* <Table.Tfoot className=" !bg-bgTableHeader  !border-t-[1px] border-secondary sticky bottom-0">
              <Table.Tr className="border-none text-secondary font-semibold">
                <Table.Th className="rounded-bl-[8px] w-[10%]">Total</Table.Th>
                <Table.Th className=" w-[6%]">12</Table.Th>
                <Table.Th className=" w-[6%]">15</Table.Th>
                <Table.Th className=" w-[6%]">15</Table.Th>
                <Table.Th className=" w-[6%]">18</Table.Th>
                <Table.Th className=" w-[6%]">14</Table.Th>
                <Table.Th className=" w-[6%]">13</Table.Th>
                <Table.Th className=" w-[6%]">12</Table.Th>
                <Table.Th className=" w-[6%]">7</Table.Th>
                <Table.Th className=" w-[6%]">0</Table.Th>
                <Table.Th className=" w-[6%]">0</Table.Th>
                <Table.Th className=" w-[6%]">0</Table.Th>
                <Table.Th className=" w-[6%]">0</Table.Th>
                <Table.Th className=" w-[9%]">106</Table.Th>
                <Table.Th className="!rounded-br-[8px] w-[9%]">2.94</Table.Th>
              </Table.Tr>
            </Table.Tfoot> */}
          </Table>
        </div>
      </div>
    </div>
  );
}