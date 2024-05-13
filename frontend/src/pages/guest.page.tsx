import { Button, Container, Stack } from "@mui/material"
import { useAuthContext, useAuthContextDispatch } from "../contexts/auth.context"
import GuestAuth from "../components/GuestAuth"
import GuestReservationGrid from "../components/GuestReservationGrid"
import NewReservation from "../components/NewReservation"

export const GuestPage = () => {
    const auth = useAuthContext()
    if (!auth.guestToken) {
        return <GuestAuth />
    }

    const dispatch = useAuthContextDispatch()
    const logout = () => {
        dispatch({ type: 'CLEAR_TOKEN' })
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 10 }}>
            <Stack spacing={5}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <NewReservation />
                    <Button variant="contained" onClick={logout}>Logout</Button>
                </Stack>
                <GuestReservationGrid />
            </Stack>
        </Container>
    )
}