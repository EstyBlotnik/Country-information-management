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

const NAVIGATION: Navigation = [
  {
    segment: "allUsers",
    title: "All users",
    icon: <PeopleAltIcon />,
  },
  {
    segment: "addUser",
    title: "Add user",
    icon: <PersonAddIcon />,
  },
  {
    segment: "permissionRequests",
    title: "Permission requests",
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

export default function AdminPage({ window, initialPath = "/allUsers" }: DemoProps) {
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
          homeUrl: "/allUsers",
          logo: "",
        }}
      >
        <DashboardLayout disableCollapsibleSidebar>
          {router.pathname === "/allUsers" && <UsersPage />}
          {router.pathname === "/permissionRequests" && <PermissionRequests />}
          {router.pathname === "/addUser" && <AddUserForm />}
        </DashboardLayout>
      </AppProvider>
    </div>
  );
}
