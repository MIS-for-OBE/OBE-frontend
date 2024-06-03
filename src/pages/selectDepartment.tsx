import { useState } from "react";
import cmulogo from "@/assets/image/cmuLogo.png";
import { DEPARTMENT_EN } from "@/helpers/constants/department.enum";
import { Button, Checkbox } from "@mantine/core";
import { useSelector } from "react-redux";
import { IModelUser } from "@/models/ModelUser";
import { FACULTY_EN } from "@/helpers/constants/faculty.enum";
import { getEnumByKey, getEnumByValue } from "@/helpers/functions/function";

export default function SelectDepartment() {
  const user: IModelUser = useSelector((state: any) => state.user.value);
  const sortedKeys = Object.keys(DEPARTMENT_EN).sort((a: string, b: string) =>
    getEnumByKey(DEPARTMENT_EN, a).localeCompare(getEnumByKey(DEPARTMENT_EN, b))
  );
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCheckboxChange = (key: string) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [key]: !prevCheckedItems[key],
    }));
  };

  return (
    <div className=" custom-radial-gradient h-screen w-screen">
      <img
        src={cmulogo}
        alt="CMULogo"
        className=" absolute top-12 left-12 h-[24px]"
      />
      <div className="bg-[rgba(78,78,80,0.30)] h-screen w-screen flex justify-between px-36 items-center font-sf-pro">
        <div className="  text-white cursor-default">
          <div className=" text-[32px] translate-y-[-16px] font-medium">
            Welcome to Score OBE <span className=" text-[#FFCD1B]"> +</span>
          </div>
          <div className=" font-normal translate-y-[-4px] text-[22px]">
            {user.firstNameEN} {user.lastNameEN}
          </div>
          <div className=" font-light text-[16px]">
            {getEnumByValue(FACULTY_EN, user.facultyCode)}
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <div className="bg-[rgba(78,78,80,0.30)] rounded-[25px] mb-5  flex-col  p-6 h-[640px] scroll-smooth  font-sf-pro">
            <div className="text-white font-medium text-[20px] cursor-default">
              Select department
            </div>
            <div className="text-[#FFB876] font-normal mb-6 cursor-default">
              Select up to 2 departments
            </div>

            <div className="flex flex-1 flex-col overflow-y-scroll h-[515px] gap-4 text-white ">
              {sortedKeys.map((key) => {
                const isChecked = checkedItems[key];
                return (
                  <div
                    key={key}
                    className={`w-[540px] min-h-[55px] cursor-default text-[16px] font-medium rounded-[10px] pl-4 py-4 scroll-auto items-center flex ${
                      isChecked
                        ? "bg-[rgba(136,145,205,0.56)]"
                        : "bg-[rgba(181,181,181,0.40)]"
                    }`}
                  >
                    <Checkbox
                      classNames={{
                        input:
                          "bg-black bg-opacity-0 border-[1.5px] border-white cursor-pointer",
                        body: "mr-3",
                      }}
                      color="#5768D5"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(key)}
                    />
                    {getEnumByKey(DEPARTMENT_EN, key)} ({key.replace("_", "-")})
                  </div>
                );
              })}
            </div>
          </div>
          <Button className="rounded-[15px] text-[#6C67A5]   h-12 font-sf-pro text-[16px] border-none bg-[#ffffff] bg-opacity-75 hover:bg-opacity-90 hover:bg-[#ffffff] hover:text-[#6C67A5] hover:border-none">
            Get Start
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              className=" ml-3 "
            >
              <path
                d="M0.9375 8.4373L12.0563 8.4373L8.65312 12.5248C8.49399 12.7163 8.41744 12.9631 8.44029 13.211C8.46315 13.4589 8.58355 13.6875 8.775 13.8467C8.96645 14.0058 9.21328 14.0824 9.46118 14.0595C9.70908 14.0367 9.93775 13.9163 10.0969 13.7248L14.7844 8.0998C14.8159 8.05506 14.8441 8.00806 14.8688 7.95918C14.8688 7.9123 14.8687 7.88418 14.9344 7.8373C14.9769 7.72981 14.9991 7.61539 15 7.4998C14.9991 7.38422 14.9769 7.2698 14.9344 7.1623C14.9344 7.11543 14.9344 7.0873 14.8688 7.04043C14.8441 6.99155 14.8159 6.94454 14.7844 6.8998L10.0969 1.2748C10.0087 1.16898 9.89835 1.08387 9.77358 1.02554C9.64882 0.967205 9.51273 0.937079 9.375 0.937304C9.15595 0.936875 8.94367 1.01316 8.775 1.15293C8.68007 1.23163 8.6016 1.32829 8.54408 1.43736C8.48656 1.54644 8.45113 1.66579 8.43981 1.78858C8.42849 1.91137 8.4415 2.03519 8.47811 2.15294C8.51471 2.27069 8.57419 2.38007 8.65312 2.4748L12.0563 6.5623L0.9375 6.5623C0.68886 6.5623 0.450402 6.66108 0.274587 6.83689C0.0987711 7.01271 0 7.25116 0 7.4998C0 7.74844 0.0987711 7.9869 0.274587 8.16272C0.450402 8.33853 0.68886 8.4373 0.9375 8.4373Z"
                fill="#6C67A5"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
