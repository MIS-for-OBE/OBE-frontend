import { Alert, Button, Modal, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateSAdmin } from "@/services/user/user.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { setUser } from "@/store/user";
import { getUserName } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { isEqual } from "lodash";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconUserCicle from "@/assets/icons/userCircle.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { setLoadingOverlay } from "@/store/loading";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalChangeSupremeAdmin({ opened, onClose }: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<any[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);
  const [openSetSAdminModal, setOpenSetSAdminModal] = useState(false);
  const [supremeAdmin, setSupremeAdmin] = useState<Partial<IModelUser>>({});
  const [textActivate, setTextActivate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (opened) {
      setSearchValue("");
      setTextActivate("");
      fetchIns();
    }
  }, [opened]);

  useEffect(() => {
    setAdminFilter(
      adminList.filter(
        (admin) =>
          `${getUserName(admin, 2)}`.includes(searchValue.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  const fetchIns = async () => {
    const res = await getInstructor();
    if (res) {
      const list = res.filter((e: IModelUser) => {
        if (e.id !== user.id && e.role === ROLE.ADMIN) {
          return {
            id: e.id,
            firstNameEN: e.firstNameEN,
            lastNameEN: e.lastNameEN,
            email: e.email,
          };
        }
      });
      setAdminList(list);
      setAdminFilter(list);
    }
  };

  const editSAdmin = async (id: string) => {
    dispatch(setLoadingOverlay(true));
    const res = await updateSAdmin({ id });
    dispatch(setLoadingOverlay(false));
    if (res) {
      const name = res.newSAdmin.firstNameEN?.length
        ? getUserName(res.newSAdmin, 1)
        : res.newSAdmin.email;
      dispatch(setUser(res.user));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Supreme Admin Changed Successfully",
        `${name} is an supreme admin.`
      );
      onClose();
      localStorage.removeItem("token");
      dispatch(setUser({}));
      navigate(ROUTE_PATH.LOGIN);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        closeOnClickOutside={true}
        title="Supreme Admin Management"
        size="43vw"
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          content:
            "flex flex-col  justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden ",
        }}
      >
        <Alert
          radius="md"
          icon={
            <Icon IconComponent={IconExclamationCircle} className="size-6" />
          }
          variant="light"
          color="red"
          className="mb-2"
          classNames={{
            body: " flex justify-center",
          }}
          title={
            <p>
              Changing the Supreme Admin
              <span className=" font-extrabold underline">
                {" "}
                will revoke{" "}
              </span>{" "}
              your current role
            </p>
          }
        ></Alert>
        <Alert
          radius="md"
          icon={<Icon IconComponent={IconInfo2} className="size-6" />}
          variant="light"
          color="blue"
          className="mb-4"
          classNames={{
            body: " flex justify-center",
          }}
          title={
            <p>
              You can only change the Supreme Admin who currently holds an admin
              role.
            </p>
          }
        ></Alert>
        <div
          className=" max-h-[500px] sm:max-macair133:max-h-[320px]  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Show List Of Admin */}
          <div className="flex  flex-col gap-2  flex-1  p-4  overflow-y-hidden">
            <TextInput
              leftSection={<TbSearch />}
              placeholder="Name / CMU account"
              value={searchValue}
              size="xs"
              onChange={(event: any) =>
                setSearchValue(event.currentTarget.value)
              }
              rightSectionPointerEvents="all"
            />

            {/* List of Admin */}
            <div className="flex flex-1 flex-col gap-2 sm:max-macair133:h-[300px] macair133:h-[400px] h-[250px] overflow-y-auto">
              {adminFilter.map((admin) => (
                <div
                  key={admin.id}
                  className="flex flex-1 items-center justify-between last:border-none border-b-[1px]  p-3 "
                >
                  <div className="gap-3 flex items-center">
                    <Icon
                      IconComponent={IconUserCicle}
                      className=" size-8 stoke-1"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-[14px] text-tertiary">
                        {getUserName(admin, 1)}
                      </p>
                      <p className="text-secondary text-[12px] font-normal">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSupremeAdmin(admin);
                      onClose();
                      setOpenSetSAdminModal(true);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        opened={openSetSAdminModal}
        closeOnClickOutside={false}
        size="47vw"
        title="Change Supreme Admin"
        transitionProps={{ transition: "pop" }}
        centered
        onClose={() => setOpenSetSAdminModal(false)}
      >
        <Alert
          variant="light"
          color="blue"
          title={`After you change Supreme Admin, your role will automatically switch to an admin role`}
          icon={<Icon IconComponent={IconInfo2} className="size-6" />}
          className="mb-5"
        ></Alert>
        <TextInput
          label={`To confirm, type "${supremeAdmin?.firstNameEN}${supremeAdmin?.lastNameEN}"`}
          value={textActivate}
          classNames={{ label: "select-none" }}
          onChange={(event) => setTextActivate(event.target.value)}
        ></TextInput>
        <Button
          disabled={
            !isEqual(
              `${supremeAdmin?.firstNameEN}${supremeAdmin?.lastNameEN}`,
              textActivate
            )
          }
          onClick={() => editSAdmin(supremeAdmin.id!)}
          loading={loading}
          className="mt-4 min-w-fit !h-[36px] !w-full"
        >
          Change Supreme Admin, Log Out
        </Button>
      </Modal>
    </>
  );
}
