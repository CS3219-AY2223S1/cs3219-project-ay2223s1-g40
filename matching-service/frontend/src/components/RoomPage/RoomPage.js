import React from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useNavigate } from "react-router-dom";

export default function RoomPage() {

    const navigate = useNavigate();
    const returnHome = event => {
        event.preventDefault()
        navigate("/difficulty")
    }

    return (
        <Box>
            <h1>
                Room
            </h1>
            <Button onClick={returnHome}
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              startIcon={<KeyboardReturnIcon />}
            >
              Return
            </Button>
        </Box>
    )
}