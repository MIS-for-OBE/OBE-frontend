import { Button, Checkbox, Group, Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { useAppDispatch, useAppSelector } from "@/store";
import { useParams } from "react-router-dom";
import Icon from "../../Icon";
import IconExcel from "@/assets/icons/excel.svg?react";
import IconFileExport from "@/assets/icons/fileExport.svg?react";
import { setLoadingOverlay } from "@/store/loading";
import { getSectionNo } from "@/helpers/functions/function";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalExportScore({ opened, onClose }: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [selectedSecToExport, setSelectedSecToExport] = useState<string[]>([]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );

  // useEffect(() => {
  //   if (opened) {
  //   }
  // }, [opened]);

  useEffect(() => {
    if (selectedSecToExport) {
      console.log(selectedSecToExport);
    }
  }, [selectedSecToExport]);

  const onCloseModal = () => {
    onClose();
    setSelectedSecToExport([]);
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      closeOnClickOutside={true}
      title={
        <div className="flex flex-col gap-2 acerSwift:max-macair133:!text-b1">
          <p>Export score {courseNo}</p>
          <p className="text-b4 acerSwift:max-macair133:!text-b5 inline-flex items-center text-[#20884f] ">
            File format:{" "}
            <Icon IconComponent={IconExcel} className="ml-1 size-4" />
          </p>
        </div>
      }
      centered
      size="30vw"
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col overflow-hidden max-h-full h-fit",
      }}
    >
      {/* <div className="flex flex-col">
        <Checkbox.Group
          label={`Select section to export`}
          classNames={{
            label:
              "mb-1 font-semibold text-default acerSwift:max-macair133:!text-b4",
          }}
          value={selectedSecToExport}
          onChange={setSelectedSecToExport}
        >
          {course?.sections.map((sec, index) => {
            return (
              <div
                key={index}
                className="flex p-1 mb-1 w-full h-full flex-col overflow-y-auto"
              >
                <Checkbox.Card
                  className="p-3 items-center px-4 flex border-none h-fit rounded-md w-full"
                  style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }}
                  value={sec.sectionNo?.toString()}
                >
                  <Group
                    wrap="nowrap"
                    className="items-center flex"
                    align="flex-start"
                  >
                    <Checkbox.Indicator />
                    <div className="text-default whitespace-break-spaces font-medium text-b3 acerSwift:max-macair133:!text-b4">
                      Section {getSectionNo(sec.sectionNo)}
                    </div>
                  </Group>
                </Checkbox.Card>
              </div>
            );
          })}
        </Checkbox.Group>
      </div>
      <div className="flex justify-end mt-2 acerSwift:max-macair133:mt-4 sticky w-full">
        <Group className="flex w-full gap-2 h-fit items-end justify-end">
          <Button
            onClick={onClose}
            variant="subtle"
            className=" acerSwift:max-macair133:!text-b5"
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            rightSection={
              <Icon
                IconComponent={IconFileExport}
                className={`${
                  selectedSecToExport.length === 0
                    ? "text-[#adb5bd]"
                    : "text-[#ffffff]"
                } size-5 items-center stroke-[2px]`}
              />
            }
            className="acerSwift:max-macair133:!text-b5"
            // onClick={generatePDF}
            disabled={selectedSecToExport.length === 0}
          >
            Export Score
          </Button>
        </Group>
      </div> */}

      <div className="h-full items-start justify-center flex flex-col">
        <p className=" mb-7 mt-1 text-b2 break-words text-[#777777] font-medium leading-relaxed">
          Available in February 2025
        </p>
      </div>
      {/* <img className=" z-50  w-[25vw]  " src={maintenace} alt="loginImage" /> */}
      <Button onClick={onClose} className="!w-full">
        OK
      </Button>
    </Modal>
  );
}
