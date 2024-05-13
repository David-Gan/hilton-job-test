import { Box, Tab, Tabs } from "@mui/material"
import { useState } from "react"
import RegisterForm from "./guest/RegisterForm"
import LoginForm from "./guest/LoginForm"

type TabType = 'login' | 'register'
const GuestAuth = () => {
    const [tab, setTab] = useState<TabType>('login')

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={(_, value:TabType) => setTab(value)} aria-label="basic tabs example">
                <Tab label="Login" value={"login"} />
                <Tab label="Register" value={"register"} />
            </Tabs>
            <Box p={2}>

            </Box>
            <Box display={tab === 'login' ? 'block' : 'none'}>
                <LoginForm />
            </Box>
            <Box display={tab === 'register' ? 'block' : 'none'}>
                <RegisterForm />
            </Box>
        </Box>
    )
}

export default GuestAuth