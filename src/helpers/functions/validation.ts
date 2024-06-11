import { RESPONSE_MESSAGE } from "@/helpers/constants/response.enum";

export const isValidResponse = (
  res: any
  // width: number = 530,
  // height: number = 180
) => {
  if (res.message === RESPONSE_MESSAGE.SUCCESS) {
    return res.data;
  } else {
    return res;
    // localStorage.setItem("isCheckError", JSON.stringify(res));
    // window.postMessage({
    //   type: "response",
    //   error: true,
    //   message: res,
    //   width: width,
    //   height: height,
    // });
  }
};

export const containsOnlyNumbers = (
  textString: any,
  min?: number,
  max?: number
): boolean => {
  if (typeof textString !== "string") {
    throw new Error("Input must be a string.");
  }

  const numericRegex = /^[0-9]+$/;
  if (!numericRegex.test(textString)) {
    return false;
  }

  const numberValue = parseInt(textString, 10);
  if (min !== undefined && numberValue < min) {
    return false;
  }
  if (max !== undefined && numberValue > max) {
    return false;
  }

  return true;
};

export const validateEmail = (email: string) => {
  const regex = /^\S+@cmu\.ac\.th$/i;
  return regex.test(email);
};