import { Alert, Button, CircularProgress } from "@mui/material"
import { CANCEL_RESERVATION, GET_MY_RESERVATIONS, GET_RESERVATIONS } from "../gqls";
import { useMutation } from "@apollo/client";
import { Reservation } from "../types";

type CancelReservationProps = {
    row: Reservation
}

const CancelReservation = ({ row }: CancelReservationProps) => {
    const [cancelReservation, { loading, error }] = useMutation(CANCEL_RESERVATION, {
        refetchQueries: [GET_MY_RESERVATIONS, GET_RESERVATIONS]
    });

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            cancelReservation({ variables: { cancelReservationId: row.id } })
        }
    }

    {error ? <Alert severity="error">{error.message}</Alert> : null}
    {loading ? <CircularProgress /> : null}

    return (
        <>
            <Button onClick={handleCancel} color="error">Cancel</Button>
        </>
    )
}

export default CancelReservation