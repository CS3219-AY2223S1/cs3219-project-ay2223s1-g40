import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import NavigationBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [selectBeginner, setSelectBeginner] = useState(false);
  const [selectIntermediate, setSelectIntermediate] = useState(false);
  const [selectExpert, setSelectExpert] = useState(false);

  const handleDifficultyLevel = (event) => {
    console.log(event.target.value);
    var levelSelected = event.target.value;
    setDifficultyLevel(levelSelected);
    if (levelSelected === "beginner") {
      setSelectBeginner(true);
      setSelectIntermediate(false);
      setSelectExpert(false);
    } else if (levelSelected === "intermediate") {
      setSelectBeginner(false);
      setSelectIntermediate(true);
      setSelectExpert(false);
    } else if (levelSelected === "expert") {
      setSelectBeginner(false);
      setSelectIntermediate(false);
      setSelectExpert(true);
    }
  };

  const isDifficultySelected = () => {
    if (difficultyLevel !== "") {
      return true;
    } else {
      return false;
    }
  };

  const navigate = useNavigate();
  const handleFindMatch = (event) => {
    // Navigates to MatchingPage
    navigate("/matching", { state: { difficultyLevel: difficultyLevel } });
  };

  return (
    <>
      <NavigationBar isAuthenticated={true} />
      <Box
        display={"flex"}
        justifyContent={"center"}
        style={{ marginTop: "3%" }}
      >
        <Box display={"flex"} flexDirection={"column"} width={"50%"}>
          <Typography
            variant={"h3"}
            display={"flex"}
            justifyContent={"center"}
            marginBottom={"2rem"}
          >
            Choose Your Difficulty Level
          </Typography>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-evenly"}
            >
              <Button
                variant={selectBeginner ? "contained" : "outlined"}
                onClick={handleDifficultyLevel}
                style={{
                  borderRadius: "20%",
                  maxWidth: "140px",
                  minWidth: "140px",
                  minHeight: "120px",
                  maxHeight: "120px",
                }}
                value="beginner"
              >
                Beginner
              </Button>
              <Button
                variant={selectIntermediate ? "contained" : "outlined"}
                onClick={handleDifficultyLevel}
                style={{
                  borderRadius: "20%",
                  maxWidth: "140px",
                  minWidth: "140px",
                  minHeight: "120px",
                  maxHeight: "120px",
                }}
                value="intermediate"
              >
                Intermediate
              </Button>
              <Button
                variant={selectExpert ? "contained" : "outlined"}
                onClick={handleDifficultyLevel}
                style={{
                  borderRadius: "20%",
                  maxWidth: "140px",
                  minWidth: "140px",
                  minHeight: "120px",
                  maxHeight: "120px",
                }}
                value="expert"
              >
                Expert
              </Button>
            </Box>
          </div>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
            style={{ paddingTop: "5%" }}
          >
            <Button
              disabled={!isDifficultySelected()}
              variant={"contained"}
              color="primary"
              endIcon={<GroupIcon />}
              style={{ fontSize: "14px" }}
              onClick={handleFindMatch}
            >
              Find Match
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default LandingPage;
