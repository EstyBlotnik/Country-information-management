import { createTheme } from "@mui/material/styles";
import MailLockIcon from "@mui/icons-material/MailLock";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PermissionRequests from "./PermissionRequests";
import useAdminAuth from "../../hooks/permissions/useAdmin";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddUserForm from "./AddUserForm";
import { UsersPage } from "./UsersPage";
import { NAVIGAT } from "../../constats";

const NAVIGATION: Navigation = [
  {
    segment: NAVIGAT.ALL_USERS,
    title: NAVIGAT.ALL_USERS_TITLE,
    icon: <PeopleAltIcon />,
  },
  {
    segment: NAVIGAT.ADD_USER,
    title: NAVIGAT.ADD_USER_TITLE,
    icon: <PersonAddIcon />,
  },
  {
    segment: NAVIGAT.PERMISSION_REQUESTS,
    title: NAVIGAT.PERMISSION_REQUESTS_TITLE,
    icon: <MailLockIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

interface DemoProps {
  window?: () => Window;
  initialPath?: string;
}

export default function AdminPage({
  window,
  initialPath = `/${NAVIGAT.ALL_USERS}`,
}: DemoProps) {
  useAdminAuth();

  const router = useDemoRouter(initialPath);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <div
      style={{
        position: "fixed",
        top: 60,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
        width: "105%",
      }}
    >
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
        branding={{
          title: "Admin actions",
          homeUrl:`/${NAVIGAT.ALL_USERS}`,
          logo: "",
        }}
      >
        <DashboardLayout disableCollapsibleSidebar>
          {router.pathname === `/${NAVIGAT.ALL_USERS}` && <UsersPage />}
          {router.pathname === `/${NAVIGAT.PERMISSION_REQUESTS}` && <PermissionRequests />}
          {router.pathname === `/${NAVIGAT.ADD_USER}` && <AddUserForm />}
        </DashboardLayout>
      </AppProvider>
    </div>
  );
}
