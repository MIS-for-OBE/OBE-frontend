import { validateTextInput } from "@/helpers/functions/validation";
import { IModelTQF3Part6 } from "@/models/ModelTQF3";
import course from "@/store/course";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Textarea,
  TextInput,
  NumberInput,
  NumberInputHandlers,
  Select,
  Tooltip,
  CheckboxCard,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowRight,
  IconFileExport,
  IconMinus,
  IconPdf,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { log } from "console";
import { upperFirst } from "lodash";
import { useEffect, useState } from "react";
import AddIcon from "@/assets/icons/plus.svg?react";
import Icon from "@/components/Icon";
import {
  getKeyEnumByValue,
  showNotifications,
} from "@/helpers/functions/function";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import SaveTQFbar, { partLabel, partType } from "@/components/SaveTQFBar";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalExportTQF3({ opened, onClose }: Props) {
  const [tqf3Part, setTqf3Part] = useState<string | null>(
    Object.keys(partLabel)[0]
  );
  const [value, setValue] = useState<string[]>([]);

  const form = useForm({
    mode: "controlled",
    initialValues: {} as any,
    validate: {
      topic: (value) => !value?.length && "Topic is required",
      detail: (value) => validateTextInput(value, "Description", 1000, false),
    },
  });

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.reset();
    }, 300);
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
                <Group wrap="nowrap" className="item-center flex" align="flex-start">
                  <Checkbox.Indicator className="mt-1" />
                  <div className=" text-default whitespace-break-spaces font-medium text-[13px]">{item}</div>
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
          >
            Export TQF3
          </Button>
        </Group>
      </div>
    </Modal>
  );
}