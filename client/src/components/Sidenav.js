import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";
import { Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/action/userAction";
import { setUser } from "../redux/action/userAction";
import io from "socket.io-client";
import { fetchVotes } from "../api/apiVotes";
import { Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import BallotIcon from "@mui/icons-material/Ballot";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import {
  clearVoteNotificationCount,
  setVoteNotificationCount,
} from "../redux/action/voteAction";

const drawerWidth = 220;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  "& .MuiDrawer-paper": {
    backgroundColor: "#1C2678",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(open && openedMixin(theme)),
    ...(!open && closedMixin(theme)),
  },
}));

export default function Sidenav() {
  const [open, setOpen] = useState(true);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const [anchorElReports, setAnchorElReports] = useState(null);
  const [anchorElMail, setAnchorElMail] = useState(null);
  const [voters, setVoters] = useState([]);

  const notificationCount = useSelector(
    (state) => state.vote.voteNotificationCount
  );

  const [unreadNotifications, setUnreadNotifications] =
    useState(notificationCount);

  const socket = io("http://localhost:5000");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        dispatch(setUser(parsedUser));
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    } else {
      console.warn("No user found in localStorage!");
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchInitialVotes = async () => {
      try {
        const data = await fetchVotes();
        const validVotes = data.filter(
          (vote) => vote.submittedBy && vote.submittedBy !== ""
        );
        setVoters(validVotes);
        dispatch(setVoteNotificationCount(validVotes.length));
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchInitialVotes();

    socket.on("updateVotes", (updatedVoteRecord) => {
      if (updatedVoteRecord.submittedBy) {
        setVoters((prevVoters) => {
          const updatedVoters = [...prevVoters, updatedVoteRecord];
          dispatch(setVoteNotificationCount(updatedVoters.length));
          return updatedVoters;
        });
      }
    });

    return () => {
      socket.off("updateVotes");
    };
  }, [dispatch]);

  useEffect(() => {
    setUnreadNotifications(notificationCount);
  }, [notificationCount]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMailMenuOpen = (event) => {
    setAnchorElMail(event.currentTarget);

    setUnreadNotifications(0);
    dispatch(clearVoteNotificationCount());
  };

  const handleMailMenuClose = () => {
    setAnchorElMail(null);
  };

  const handleReportsMenuClick = (event) => {
    setAnchorElReports(event.currentTarget);
  };

  const handleReportsMenuClose = () => {
    setAnchorElReports(null);
  };

  const handleProfileMenuClick = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorE2(null);
  };

  const handleSettingsOpen = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorE3(null);
  };

  const handleNotification = (userId) => {
    // console.log("Clearing notification for userId:", userId);

    const updatedVoters = voters.filter(
      (voter) => voter.submittedBy !== userId
    );
    setVoters(updatedVoters);

    dispatch(setVoteNotificationCount(updatedVoters.length));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader style={{ display: "flex", alignItems: "center" }}>
          <img
            src="VQCS.png"
            alt="Logo"
            style={{ width: "100px", height: "100px", marginRight: "30px" }}
          />
          <IconButton onClick={handleDrawerToggle}>
            {open ? (
              <ChevronLeftIcon sx={{ color: "white" }} />
            ) : (
              <MenuOutlinedIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {[
            user &&
              user.role === "admin" && {
                text: "Dashboard",
                icon: <GridViewOutlinedIcon sx={{ color: "white" }} />,
                route: "/admin-dashboard",
              },

            {
              text: "Candidates",
              icon: <PeopleAltOutlinedIcon sx={{ color: "white" }} />,
              route: "/candidate-List",
            },
            {
              icon: (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AssessmentOutlinedIcon sx={{ color: "white" }} />
                    {open && (
                      <span style={{ color: "white", marginLeft: "25px" }}>
                        Reports
                      </span>
                    )}
                  </Box>
                  {open && (
                    <ArrowDropDownIcon
                      sx={{
                        color: "white",
                        marginLeft: "30px",
                      }}
                    />
                  )}
                </Box>
              ),
              onClick: handleReportsMenuClick,
            },
            {
              text: "Barangay List",
              icon: <LocationCityIcon sx={{ color: "white" }} />,
              route: "/barangay-list",
            },

            {
              text: "Precincts",
              icon: <ShareLocationIcon sx={{ color: "white" }} />,
              route: "/precincts",
            },

            {
              text: "Manage Users",
              icon: <PeopleAltOutlinedIcon sx={{ color: "white" }} />,
              route: "/user-management",
            },
          ]
            .filter((item) => item)
            .map((item, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{ display: "block" }}
                onClick={
                  item.onClick ? item.onClick : () => navigate(item.route)
                }
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ color: "white", opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
        <Divider />
      </Drawer>
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#1C2678" }}>
        <Toolbar className="Toolbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          ></IconButton>
        </Toolbar>
      </AppBar>

      <AppBar position="fixed" open={open}>
        <Toolbar className="Toolbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          ></IconButton>

          <AppBar position="fixed" open={open}>
            <Toolbar className="Toolbar">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              ></IconButton>
              <Col>
                <h6 className="Title-Header">Voters Quick Count System</h6>
              </Col>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                  marginRight: "20px",
                }}
              >
                <IconButton color="inherit" onClick={handleMailMenuOpen}>
                  <Badge badgeContent={unreadNotifications} color="error">
                    <MailIcon sx={{ color: "white" }} />
                  </Badge>
                </IconButton>

                <Menu
                  anchorEl={anchorElMail}
                  open={Boolean(anchorElMail)}
                  onClose={handleMailMenuClose}
                >
                  <div
                    style={{
                      padding: "10px",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Notifications
                  </div>
                  {voters.length > 0 ? (
                    voters.map((voter, index) => (
                      <MenuItem key={index}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div>
                            <p>
                              <strong>{voter.name}</strong>
                            </p>
                            <Typography>
                              Sender: {voter.submittedBy || "Unknown"}
                            </Typography>
                            <Typography>
                              Submitted Votes: {voter.totalVotes}
                            </Typography>
                          </div>
                          <IconButton
                            edge="end"
                            onClick={() => {
                              const userId = voter.submittedBy;
                              handleNotification(userId);
                            }}
                            size="small"
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>No new votes</MenuItem>
                  )}
                </Menu>
                {user && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={user.photo || "avatar.png"}
                      alt="User Profile"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <p style={{ margin: "0", fontWeight: "bold" }}>
                      {user ? user.name : "Guest"}
                    </p>
                    <ArrowDropDownIcon
                      style={{
                        marginLeft: "10px",
                        color: "white",
                      }}
                      onClick={handleProfileMenuClick}
                    />
                  </div>
                )}
              </div>

              <Menu
                anchorEl={anchorE2}
                open={Boolean(anchorE2)}
                onClose={handleProfileMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#1C2678",
                    color: "white",
                  },
                  position: "absolute",
                  top: "10px",
                }}
              >
                <Box sx={{ marginTop: "10px" }}>
                  {/* Parent Settings MenuItem */}
                  <MenuItem onClick={handleSettingsOpen}>
                    <ListItemIcon>
                      <SettingsApplicationsIcon
                        sx={{ color: "white" }}
                        fontSize="small"
                      />
                    </ListItemIcon>
                    <span style={{ fontSize: "14px" }}>Settings</span>
                  </MenuItem>

                  {/* Dropdown Submenu */}
                  <Menu
                    anchorEl={anchorE3} // State para sa submenu
                    open={Boolean(anchorE3)}
                    onClose={handleSettingsClose}
                    sx={{
                      "& .MuiPaper-root": {
                        backgroundColor: "#1C2678",
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem onClick={() => navigate("/precincts")}>
                      Precinct Settings
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/barangay-list")}>
                      Barangay Settings
                    </MenuItem>
                  </Menu>

                  {/* Logout */}
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutRoundedIcon
                        sx={{ color: "white" }}
                        fontSize="small"
                      />
                    </ListItemIcon>
                    <span style={{ fontSize: "14px" }}>Logout</span>
                  </MenuItem>
                </Box>
              </Menu>

              <Menu
                anchorEl={anchorElReports}
                open={Boolean(anchorElReports)}
                onClose={handleReportsMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#1C2678",
                    color: "white",
                  },
                }}
              >
                <MenuItem onClick={() => navigate("/barangay-results")}>
                  <ListItemIcon>
                    <HomeWorkIcon fontSize="small" sx={{ color: "white" }} />
                  </ListItemIcon>
                  <span style={{ fontSize: "14px" }}>
                    Barangay Votes Result
                  </span>
                </MenuItem>
                <MenuItem onClick={() => navigate("/canvassing-result")}>
                  <ListItemIcon>
                    <GroupsIcon fontSize="small" sx={{ color: "white" }} />
                  </ListItemIcon>
                  <span style={{ fontSize: "14px" }}>Canvassing Summary</span>
                </MenuItem>
                <MenuItem onClick={() => navigate("/overall")}>
                  <ListItemIcon>
                    <BallotIcon fontSize="small" sx={{ color: "white" }} />
                  </ListItemIcon>
                  <span style={{ fontSize: "14px" }}>Final Canvassing</span>
                </MenuItem>
                <MenuItem onClick={() => navigate("/userSubmission")}>
                  <ListItemIcon>
                    <SupervisedUserCircleIcon
                      fontSize="small"
                      sx={{ color: "white" }}
                    />
                  </ListItemIcon>
                  <span style={{ fontSize: "14px" }}>Poll-Watcher List</span>
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
        </Toolbar>
      </AppBar>

      <DrawerHeader />
    </Box>
  );
}
