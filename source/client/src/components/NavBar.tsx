import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useRecoilValue } from "recoil";
import { countryState } from "../states/country";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import UserDialog from "./user/UserDialog";
import API_URL from "../config/apiConfig";

const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";

const pages = ["Countries", "Cities"];
const userPages = ["All requests"];
const adminPages = ["adminPage"];
const settings = ["Login", "Register"];
const userSettings = ["Profile", "Logout"];

export default function NavBar() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const country = useRecoilValue(countryState);
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const handleMenuItemClick = (setting: string) => {
    console.log("Navigating to:", setting);
    if (setting === "Logout") {
      setDialogOpen(true);
    } else {
      navigate(`/${setting.toLowerCase()}`);
    }
    handleCloseUserMenu();
  };

  const handlePageClick = (page: string) => {
    console.log("Navigating to:", page);
    navigate(`/${page.toLowerCase()}`);
    handleCloseNavMenu();
  };

  const handleLogOut = () => {
    logoutUser();
    navigate("/");
  };
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="fixed">
        <Container
          sx={{
            maxWidth: "100%",
            width: "calc(100% - 10%)",
            marginLeft: { xs: "5%", xl: "17%" },
            marginRight: "5%",
          }}
        >
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={user ? "/home" : "/"}
              sx={{
                mr: 2,
                // flexGrow: 0.2,
                display: { xs: "none", md: "flex" },
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {country ? country.name : "Countries managment"}
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {user &&
                  pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => {
                        handleCloseNavMenu;
                        handlePageClick(page);
                      }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                {user &&
                  user.role !== "Admin" &&
                  userPages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => {
                        handleCloseNavMenu;
                        handlePageClick(page);
                      }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                {user &&
                  user.role === "Admin" &&
                  adminPages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => {
                        handleCloseNavMenu;
                        handlePageClick(page);
                      }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href={user ? "/home" : "/"}
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {country ? country.name : "Countries managment"}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {user &&
                pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => {
                      handleCloseNavMenu;
                      handlePageClick(page);
                    }}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              {user &&
                user.role !== "Admin" &&
                userPages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => {
                      handleCloseNavMenu;
                      handlePageClick(page);
                    }}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              {user &&
                user.role === "Admin" &&
                adminPages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => {
                      handleCloseNavMenu;
                      handlePageClick(page);
                    }}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
            </Box>
            <Box>
              <Tooltip title="Open settings">
                <div>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={
                        `${API_URL}${user?.profilePicture}` ||
                        "/default-avatar.png"
                      }
                      sx={{ width: 45, height: 45 }}
                    />
                  </IconButton>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "white",
                      textAlign: "center",
                      marginTop: "0px",
                    }}
                  >
                    {user?.userName}
                  </div>
                </div>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {!user &&
                  settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleMenuItemClick(setting);
                      }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                {user &&
                  userSettings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleMenuItemClick(setting)}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <UserDialog
        dialogFor="logOut"
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onOK={() => {
          setDialogOpen(false);
          handleLogOut();
        }}
      />
    </>
  );
}
