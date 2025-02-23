import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, Routes } from "react-router-dom";
import { Country } from "./components/countries/Country";
import NavBar from "./components/NavBar";
import { ValidationCountryData } from "./components/countries/EditForm";
import { RecoilRoot } from "recoil";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/user/Login";
import SignUpForm from "./components/user/SignUpForm";
import PasswordResetRequest from "./components/resetPassword/RequestPasswordReset";
import PasswordReset from "./components/resetPassword/ResetPasswors";
import EditUserForm from "./components/user/EditUserForm";
import DynamicPage from "./components/DynamicPage";
import UserProfile from "./components/user/UserProfile";
import "./App.css";
import HomePage from "./components/HomePage";
import theme from "./style/theme";
import { ThemeProvider } from "@emotion/react";
import { AllUsersPage } from "./components/admin/AllUsersPage";
import AdminPage from "./components/admin/AdminPage";
import { ViewCountry } from "./components/countries/ViewCountry";
import { Cities } from "./components/cities/Cities";
import { UserAllRequests } from "./components/user/UserAllRequests";
import NotFound from "./components/NotFound";
const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <div className="App">
            <ToastContainer />
            <ThemeProvider theme={theme}>
              <NavBar />
              <div className="body">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path={"/countries"} element={<Country />} />
                  <Route path={"/cities"} element={<Cities />} />
                  <Route path={"/register"} element={<SignUpForm />} />
                  <Route path={"/login"} element={<LoginPage />} />
                  <Route path={"/home"} element={<HomePage />} />
                  <Route
                    path={"/passwordresetrequest"}
                    element={<PasswordResetRequest />}
                  />
                  <Route
                    path={"/passwordreset/:token"}
                    element={<PasswordReset />}
                  />
                  <Route
                    path={"/editCountry/:id"}
                    element={<ValidationCountryData />}
                  />
                  <Route path="/veiwCountry/:id" element={<ViewCountry />} />
                  <Route
                    path={"/addCountry"}
                    element={<ValidationCountryData />}
                  />
                  <Route path={"/profile"} element={<UserProfile />} />
                  <Route
                    path="/editUser/:id"
                    element={<EditUserForm editFor="anOtherUser" />}
                  />
                  <Route
                    path="/editProfile/:id"
                    element={<EditUserForm editFor={"mySelf"} />}
                  />
                  <Route path="allusers" element={<AllUsersPage />} />
                  <Route path="adminPage" element={<AdminPage />} />
                  <Route path="/all requests" element={<UserAllRequests />} />
                  <Route path="*" element={<NotFound/>}/>
                </Routes>
              </div>
            </ThemeProvider>
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </RecoilRoot>
    </ErrorBoundary>
  );
}
