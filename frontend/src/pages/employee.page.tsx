import { Button, Container, Stack } from "@mui/material"
import EmployeeReservationGrid from "../components/EmployeeReservationGrid"
import EmployeeAuth from "../components/EmployeeAuth"
import { useAuthContext, useAuthContextDispatch } from "../contexts/auth.context"

export const EmployeePage = () => {
    const auth = useAuthContext()
    console.log({ auth })
    if (!auth.employeeToken) {
        return <EmployeeAuth />
    }

    const dispatch = useAuthContextDispatch()
    const logout = () => {
        dispatch({ type: 'CLEAR_TOKEN' })
    }
    
    return (
        <Container maxWidth="lg" sx={{ mt: 10 }}>
            <Stack direction={"row"} justifyContent={"flex-end"}>
                <Button variant="contained" onClick={logout}>Logout</Button>
            </Stack>
            <Stack spacing={5}>
                <EmployeeReservationGrid />
            </Stack>
        </Container>
    )
}