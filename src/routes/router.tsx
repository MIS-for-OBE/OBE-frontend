import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import App from "@/App";
import Loading from "@/components/Loading/Loading";
import AdminDashboardTQF from "@/pages/AdminDashboard/AdminDashboardTQF";
import AdminDashboardPLO from "@/pages/AdminDashboard/AdminDashboardPLO";
import AdminDashboardCLO from "@/pages/AdminDashboard/AdminDashboardCLO";
import TQF5 from "@/pages/TQF/TQF5";
import StdDashboard from "@/pages/Student/StdDashboard";
import Roster from "@/pages/Roster";
import StdOverallPLO from "@/pages/Student/StdOverallPLO";
import StdAssignment from "@/pages/Student/StdAssignment";
import StdChart from "@/pages/Student/StdChart";
import StdScore from "@/pages/Student/StdScore";
import StdCLO from "@/pages/Student/StdCLO";
import StdPLO from "@/pages/Student/StdPLO";
import StdSkills from "@/pages/Student/StdSkills";
import AllAssignment from "@/pages/AllAssignment";
import OneAssignment from "@/pages/OneAssignment";

const Login = lazy(() => import("@/pages/Login"));
const CmuEntraIDCallback = lazy(() => import("@/pages/CmuEntraIDCallback"));
// const SelectDepartment = lazy(() => import("@/pages/SelectDepartment"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Section = lazy(() => import("@/pages/Section"));
const TQF3 = lazy(() => import("@/pages/TQF/TQF3"));
const Assignment = lazy(() => import("@/pages/Score/Assignment"));
const Histogram = lazy(() => import("@/pages/Score/Histogram"));
const Score = lazy(() => import("@/pages/Score/Score"));
const Students = lazy(() => import("@/pages/Score/Students"));
const Skills = lazy(() => import("@/pages/Skills"));
const Page404 = lazy(() => import("@/pages/Page404"));
// const PageError = lazy(() => import("@/pages/PageError"));

const loadingPage = (
  <div className="flex h-screen w-screen">
    <Loading />
  </div>
);

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={loadingPage}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: ROUTE_PATH.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTE_PATH.CMU_ENTRAID_CALLBACK,
        element: <CmuEntraIDCallback />,
      },
      // {
      //   path: ROUTE_PATH.SELECTED_DEPARTMENT,
      //   element: (
      //     <Suspense fallback={loadingPage}>
      //       <SelectDepartment />
      //     </Suspense>
      //   ),
      // },
      {
        path: ROUTE_PATH.INS_DASHBOARD,
        element: (
          <Suspense fallback={loadingPage}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: `${ROUTE_PATH.COURSE}/:courseNo`,
        children: [
          {
            path: ROUTE_PATH.SECTION,
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={loadingPage}>
                    <Section />
                  </Suspense>
                ),
              },
              {
                path: `:sectionNo/${ROUTE_PATH.EVALUATION}`,
                children: [
                  {
                    path: "",
                    element: (
                      <Suspense fallback={loadingPage}>
                        <Assignment />
                      </Suspense>
                    ),
                  },
                  {
                    path: `:name/${ROUTE_PATH.SCORE}`,
                    element: (
                      <Suspense fallback={loadingPage}>
                        <Score />
                      </Suspense>
                    ),
                  },
                  {
                    path: `:name/${ROUTE_PATH.STUDENTS}`,
                    element: (
                      <Suspense fallback={loadingPage}>
                        <Students />
                      </Suspense>
                    ),
                  },
                ],
              },
              {
                path: `:sectionNo/${ROUTE_PATH.HISTOGRAM}`,
                element: (
                  <Suspense fallback={loadingPage}>
                    <Histogram />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: ROUTE_PATH.EVALUATION,
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={loadingPage}>
                    <AllAssignment />
                  </Suspense>
                ),
              },
              {
                path: ":name",
                element: (
                  <Suspense fallback={loadingPage}>
                    <OneAssignment />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: ROUTE_PATH.ROSTER,
            element: (
              <Suspense fallback={loadingPage}>
                <Roster />
              </Suspense>
            ),
          },
          // {
          //   path: ROUTE_PATH.SKILLS,
          //   element: (
          //     <Suspense fallback={loadingPage}>
          //       <Skills />
          //     </Suspense>
          //   ),
          // },
          {
            path: ROUTE_PATH.TQF3,
            element: (
              <Suspense fallback={loadingPage}>
                <TQF3 />
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.TQF5,
            element: (
              <Suspense fallback={loadingPage}>
                <TQF5 />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTE_PATH.ADMIN_DASHBOARD,
        children: [
          {
            path: ROUTE_PATH.TQF,
            element: (
              <Suspense fallback={loadingPage}>
                <AdminDashboardTQF />
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.PLO,
            element: (
              <Suspense fallback={loadingPage}>
                <AdminDashboardPLO />
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.CLO,
            element: (
              <Suspense fallback={loadingPage}>
                <AdminDashboardCLO />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTE_PATH.STD_DASHBOARD,
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={loadingPage}>
                <StdDashboard />
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.PLO,
            element: (
              <Suspense fallback={loadingPage}>
                <StdOverallPLO />
              </Suspense>
            ),
          },
          {
            path: ":courseNo",
            children: [
              {
                path: ROUTE_PATH.EVALUATION,
                children: [
                  {
                    path: "",
                    element: (
                      <Suspense fallback={loadingPage}>
                        <StdAssignment />
                      </Suspense>
                    ),
                  },
                  {
                    path: ":name",
                    element: (
                      <Suspense fallback={loadingPage}>
                        <StdScore />
                      </Suspense>
                    ),
                  },
                ],
              },
              {
                path: ROUTE_PATH.HISTOGRAM,
                element: (
                  <Suspense fallback={loadingPage}>
                    <StdChart />
                  </Suspense>
                ),
              },
              {
                path: ROUTE_PATH.CLO,
                element: (
                  <Suspense fallback={loadingPage}>
                    <StdCLO />
                  </Suspense>
                ),
              },
              {
                path: ROUTE_PATH.PLO,
                element: (
                  <Suspense fallback={loadingPage}>
                    <StdPLO />
                  </Suspense>
                ),
              },
              // {
              //   path: ROUTE_PATH.SKILLS,
              //   element: (
              //     <Suspense fallback={loadingPage}>
              //       <StdSkills />
              //     </Suspense>
              //   ),
              // },
            ],
          },
        ],
      },
      {
        path: "*",
        element: (
          <Suspense fallback={loadingPage}>
            <Page404 />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
