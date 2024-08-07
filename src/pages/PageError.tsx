import { ROLE } from "@/helpers/constants/enum";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setErrorResponse } from "@/store/errorResponse";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function PageError() {
  const error = useAppSelector((state) => state.errorResponse);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const goDashboard = () => {
    if (localStorage.getItem("token")) {
      dispatch(setErrorResponse({}));
      navigate(
        user.role == ROLE.STUDENT
          ? ROUTE_PATH.DASHBOARD_STD
          : ROUTE_PATH.DASHBOARD_INS
      );
    } else {
      navigate(ROUTE_PATH.LOGIN);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen gap-10 -rounded font-extrabold justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <p className="text-9xl font-bold">{error.statusCode}</p>
        <p className="text-3xl font-bold">{error.error}</p>
        <p className="text-xl font-bold">{error.message}</p>
      </div>
      <Button onClick={goDashboard}>Go Home</Button>
    </div>
  );
}
