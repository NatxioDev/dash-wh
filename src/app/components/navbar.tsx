import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Magic Store
          </Typography>
          {token ? (
            <>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="info"
              onClick={() => router.push("/login")}
            >
              Log In
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
