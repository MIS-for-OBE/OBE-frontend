import { Button, Checkbox, Group, Modal } from "@mantine/core";
import { IconFileExport, IconPdf } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  getKeyEnumByValue,
  showNotifications,
} from "@/helpers/functions/function";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";
import { genPdfTQF3 } from "@/services/tqf3/tqf3.service";
import { useAppSelector } from "@/store";
import { useParams } from "react-router-dom";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalExportTQF3({ opened, onClose }: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [value, setValue] = useState<string[]>([]);

  const onCloseModal = () => {
    onClose();
    setValue([]);
  };

  const generatePDF = async () => {
    const res = await genPdfTQF3({
      courseNo,
      academicYear: academicYear.year,
      academicTerm: academicYear.semester,
      tqf3: "66d91fded3dbd0f70f1b2133",
      part1: "",
    });
    if (res) {
      const contentType = res.headers["content-type"];
      const disposition = res.headers["content-disposition"];
      const fileType = contentType === "application/zip" ? "zip" : "pdf";
      const filename = disposition
        ? disposition.split("filename=")[1]
        : `TQF3.${fileType}`;
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename.replace(/"/g, "");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      closeOnClickOutside={false}
      title={
        <div className="flex flex-col gap-2">
          <p>Export TQF3</p>
          <p className=" text-[12px] inline-flex items-center text-[#e13b3b] -mt-[6px]">
            File format: <IconPdf className="ml-1" color="#e13b3b"></IconPdf>
          </p>
        </div>
      }
      centered
      size="45vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
        body: `flex flex-col overflow-hidden max-h-full h-fit`,
      }}
    >
      <div className="flex flex-col ">
        <Checkbox.Group
          label="Select part to export"
          classNames={{ label: "mb-1 font-semibold text-default" }}
          value={value}
          onChange={setValue}
        >
          {Object.values(PartTopicTQF3).map((item, index) => (
            <div className="flex p-1 mb-1 w-full h-full flex-col overflow-y-auto ">
              <Checkbox.Card
                key={index}
                value={getKeyEnumByValue(PartTopicTQF3, item)}
                className="p-3  items-center px-4 flex border-none h-fit rounded-md w-full"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Group
                  wrap="nowrap"
                  className="item-center flex"
                  align="flex-start"
                >
                  <Checkbox.Indicator className="mt-1" />
                  <div className=" text-default whitespace-break-spaces font-medium text-[13px]">
                    {item}
                  </div>
                </Group>
              </Checkbox.Card>
            </div>
          ))}
        </Checkbox.Group>
      </div>
      <div className="flex justify-end mt-2 sticky w-full">
        <Group className="flex w-full gap-2 h-fit items-end justify-end">
          <Button onClick={onClose} variant="subtle">
            Cancel
          </Button>

          <Button
            rightSection={
              <IconFileExport
                color="#ffffff"
                className="size-5 items-center"
                stroke={2}
                size={20}
              />
            }
            onClick={generatePDF}
          >
            Export TQF3
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
