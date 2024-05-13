import { Box, Button, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"

export const HomePage = () => {
    const navigate = useNavigate()

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Stack spacing={5}>
                <Button variant="contained" size="large" onClick={() => navigate('/guest')}>I'm Guest</Button>
                <Button variant="outlined" size="large" onClick={() => navigate('/employee')}>I'm Employee</Button>
            </Stack>
        </Box>
    )
}