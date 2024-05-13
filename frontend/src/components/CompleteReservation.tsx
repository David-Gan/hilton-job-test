import { Alert, Button, CircularProgress } from "@mui/material"
import { COMPLETE_RESERVATION, GET_MY_RESERVATIONS, GET_RESERVATIONS } from "../gqls";
import { useMutation } from "@apollo/client";
import { Reservation } from "../types";

type CompleteReservationProps = {
    row: Reservation
}

const CompleteReservation = ({ row }: CompleteReservationProps) => {
    const [completeReservation, { loading, error }] = useMutation(COMPLETE_RESERVATION, {
        refetchQueries: [GET_MY_RESERVATIONS, GET_RESERVATIONS]
    });

    const handleComplete = async () => {
        if (window.confirm('Are you sure you want to complete this reservation?')) {
            completeReservation({ variables: { completeReservationId: row.id } })
        }
    }

    {error ? <Alert severity="error">{error.message}</Alert> : null}
    {loading ? <CircularProgress /> : null}

    return (
        <>
            <Button onClick={handleComplete} color="primary">Complete</Button>
        </>
    )
}

export default CompleteReservation