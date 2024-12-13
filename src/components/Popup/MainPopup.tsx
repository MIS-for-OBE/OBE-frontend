import { Button, Modal } from "@mantine/core";
import { ReactElement, ReactNode } from "react";
import Icon from "@/components/Icon";
import IconDelete from "@/assets/icons/delete.svg?react";
import IconWarning from "@/assets/icons/infoTri.svg?react";
import { useAppSelector } from "@/store";

type popupType = "delete" | "warning" | "unsaved";

type Props = {
  opened: boolean;
  onClose: () => void;
  action: () => void;
  type: popupType;
  title: ReactNode;
  message: ReactNode;
  labelButtonRight?: string;
  labelButtonLeft?: string;
  icon?: ReactElement;
};

export default function MainPopup({
  opened,
  onClose,
  action,
  title,
  message,
  labelButtonRight,
  labelButtonLeft,
  icon,
  type,
}: Props) {
  const titleClassName = () => {
    switch (type) {
      case "delete":
        return "text-[#FF4747]";
      case "warning":
        return "text-[#F58722]";
      case "unsaved":
        return "text-[#1f69f3]";
    }
  };
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title={
        <div className="flex items-center">
          {icon ? (
            icon
          ) : type == "delete" ? (
            <Icon IconComponent={IconDelete} className=" size-6 mr-2" />
          ) : type == "warning" ? (
            <Icon IconComponent={IconWarning} className=" size-6 mr-2" />
          ) : (
            <></>
          )}
          {title}
        </div>
      }
      size="auto"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: `${titleClassName()}`,
        content:
          "flex flex-col justify-start   font-medium leading-[24px] text-[14px] item-center  overflow-hidden max-w-[42vw] min-w-[32vw] w-fit",
      }}
    >
      <div className="flex flex-col">
        {message}
        <div className="flex gap-2 mt-5 justify-end">
          {type === "delete" ? (
            <>
              <Button
                variant="subtle"
                className="!text-[13px]"
                onClick={onClose}
                loading={loading}
              >
                Cancel
              </Button>
              <Button
                color="red"
                className="!text-[13px]"
                onClick={action}
                loading={loading}
              >
                {labelButtonRight}
              </Button>
            </>
          ) : type == "unsaved" ? (
            <>
              <Button
                variant="subtle"
                className="!text-[13px]"
                onClick={
                  labelButtonLeft === "Leave without saving" ? action : onClose
                }
              >
                {labelButtonLeft ? labelButtonLeft : "Cancel"}
              </Button>
              <Button
                color="#1f69f3"
                className="!text-[13px]"
                onClick={labelButtonRight === "Keep editing" ? onClose : action}
              >
                {labelButtonRight}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="subtle"
                className="!text-[13px]"
                onClick={
                  labelButtonLeft === "Leave without saving" ? action : onClose
                }
              >
                {labelButtonLeft ? labelButtonLeft : "Cancel"}
              </Button>
              <Button
                color="#F58722"
                className="!text-[13px]"
                onClick={labelButtonRight === "Keep editing" ? onClose : action}
              >
                {labelButtonRight}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
