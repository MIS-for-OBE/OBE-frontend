import { Button, Checkbox, Group, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import {
  getKeyPartTopicTQF3,
  PartTopicTQF3,
} from "@/helpers/constants/TQF3.enum";
import { genPdfTQF3 } from "@/services/tqf3/tqf3.service";
import { useAppSelector } from "@/store";
import { useParams } from "react-router-dom";
import { IModelTQF3 } from "@/models/ModelTQF3";
import noData from "@/assets/image/noData.jpg";
import IconPDF from "@/assets/icons/pdf.svg?react";
import IconFileExport from "@/assets/icons/fileExport.svg?react";
import Icon from "@/components/Icon";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalExportTQF3({ opened, onClose }: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const tqf3 = useAppSelector((state) => state.tqf3);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened) {
      const select: string[] = [];
      Object.keys(tqf3).forEach((part) => {
        if (
          part !== "part7" &&
          part.includes("part") &&
          (tqf3[part as keyof IModelTQF3] as any)?.updatedAt
        ) {
          select.push(part);
        }
      });
      setSelectedParts(select);
    }
  }, [opened]);

  const onCloseModal = () => {
    onClose();
    setSelectedParts([]);
  };

  const generatePDF = async () => {
    if (selectedParts.length === 0) {
      showNotifications(
        NOTI_TYPE.ERROR,
        "Error",
        "Please select at least one part to export."
      );
      return;
    }
    setLoading(true);

    const payload: any = {
      courseNo,
      academicYear: academicYear.year,
      academicTerm: academicYear.semester,
      tqf3: tqf3.id,
    };
    selectedParts.forEach((part) => (payload[part] = ""));

    const res = await genPdfTQF3(payload);
    if (res) {
      const contentType = res.headers["content-type"];
      const disposition = res.headers["content-disposition"];
      const filename = disposition
        ? disposition.split("filename=")[1]
        : `TQF3_Parts_${courseNo}_${academicYear.year}_${academicYear.semester}.zip`;
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename.replace(/"/g, "");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Export Success",
        `TQF3 exported successfully as ${filename}.`
      );
    }
    setLoading(false);
    onCloseModal();
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      closeOnClickOutside={true}
      title={
        <div className="flex flex-col gap-2">
          <p>Export TQF3</p>
          <p className="text-[12px] inline-flex items-center text-[#e13b3b] -mt-[6px]">
            File format:{" "}
            <Icon IconComponent={IconPDF} className="ml-1 stroke-[#e13b3b]" />
          </p>
        </div>
      }
      centered
      size="45vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      <div className="flex flex-col">
        {!tqf3.part1?.updatedAt ? (
          <div className="flex flex-col mt-3  items-center  ">
            <p className=" text-[14px] font-semibold">
              No parts of TQF3 are available for export.
            </p>
            <img
              className=" z-50  w-[320px] h-[220px] "
              src={noData}
              alt="loginImage"
            />
          </div>
        ) : (
          <Checkbox.Group
            label="Select part to export"
            classNames={{ label: "mb-1 font-semibold text-default" }}
            value={selectedParts}
            onChange={setSelectedParts}
          >
            {Object.values(PartTopicTQF3)
              .slice(0, 6)
              .filter(
                (item) => tqf3 && tqf3[getKeyPartTopicTQF3(item)!]?.updatedAt
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="flex p-1 mb-1 w-full h-full flex-col overflow-y-auto"
                >
                  <Checkbox.Card
                    className={`p-3 items-center px-4 flex  h-fit rounded-md w-full ${
                      selectedParts.includes(getKeyPartTopicTQF3(item)!) &&
                      "!border-[1px] !border-secondary "
                    }`}
                    style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.15)" }}
                    value={getKeyPartTopicTQF3(item)}
                  >
                    <Group
                      wrap="nowrap"
                      className="item-center flex"
                      align="flex-start"
                    >
                      <Checkbox.Indicator className="mt-1" />
                      <div className="text-default whitespace-break-spaces font-medium text-[13px]">
                        {item}
                      </div>
                    </Group>
                  </Checkbox.Card>
                </div>
              ))}
          </Checkbox.Group>
        )}
      </div>
      {tqf3.part1?.updatedAt && (
        <div className="flex justify-end mt-4 sticky w-full">
          <Group className="flex w-full gap-2 h-fit items-end justify-end">
            <Button onClick={onClose} variant="subtle">
              Cancel
            </Button>
            <Button
              loading={loading}
              rightSection={
                <Icon
                  IconComponent={IconFileExport}
                  className={` ${
                    !tqf3.part1?.updatedAt ? "text-[#adb5bd]" : "text-[#ffffff]"
                  } stroke-[2px] size-5 items-center`}
                />
              }
              onClick={generatePDF}
              disabled={!tqf3.part1?.updatedAt || selectedParts.length === 0}
            >
              Export TQF3
            </Button>
          </Group>
        </div>
      )}
    </Modal>
  );
}
