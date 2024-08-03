import { notifications } from "@mantine/notifications";
import { TQF_STATUS } from "../constants/enum";

export const sortData = (
  data: any[],
  key: string,
  typeKey: string = "number",
  typeSort: string = "asc"
) => {
  data.sort((a, b) => {
    if (typeKey === "number") {
      if (["asc", "ASC"].includes(typeSort)) {
        if (!a[key] && a[key] != 0) return -1;
        else if (!b[key] && b[key] != 0) return 1;
        else return a[key] - b[key];
      } else {
        if (!b[key] && b[key] != 0) return -1;
        else if (!a[key] && a[key] != 0) return 1;
        else return b[key] - a[key];
      }
    } else {
      if (["asc", "ASC"].includes(typeSort)) {
        if (!a[key]) return -1;
        else if (!b[key]) return 1;
        else if (a[key] < b[key]) return -1;
        else return 1;
      } else {
        if (!b[key]) return -1;
        else if (!a[key]) return 1;
        else if (b[key] < a[key]) return -1;
        else return 1;
      }
    }
  });
};

export function getEnumByKey(Enum: any, key: string): string {
  return Enum[key as keyof typeof Enum] ?? "";
}

export function getEnumByValue(Enum: any, value: string): string {
  return Object.keys(Enum)[Object.values(Enum).indexOf(value)] ?? "";
}

export const statusColor = (
  status: TQF_STATUS | undefined,
  bg: boolean = false
): string => {
  const done = "tqf-done";
  const inProgress = "tqf-in-progress";
  const noData = "tqf-no-data";
  let className = "";
  switch (status) {
    case TQF_STATUS.DONE:
      className = done;
      break;
    case TQF_STATUS.IN_PROGRESS:
      className = inProgress;
      break;
    default:
      className = noData;
      break;
  }
  if (bg) {
    className += ` ${className}-with-bg`;
  }
  return className;
};

export const showNotifications = (
  type: string,
  title: string,
  message: string
) => {
  let className, color;
  switch (type) {
    case "success":
      // className = "bg-green-500 bg-opacity-50 rounded-md";
      color = "green";
      break;
    case "error":
      // className = "bg-red-500 bg-opacity-75 rounded-md";
      color = "red";
      break;
    default:
      break;
  }
  notifications.show({
    title,
    message,
    autoClose: 3000,
    className,
    color,
    // classNames: {
    //   title: "text-white",
    //   description: "text-gray-200 font-normal",
    // },
  });
};
