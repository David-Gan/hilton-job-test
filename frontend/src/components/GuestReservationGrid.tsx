import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Stack } from '@mui/material';
import UpdateReservation from './UpdateReservation';
import CancelReservation from './CancelReservation';
import { useQuery } from '@apollo/client';
import { GET_MY_RESERVATIONS } from '../gqls';
import { ReservationStatus } from '../types';
import dayjs from 'dayjs';

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'size', headerName: 'Table Size', width: 150 },
    { field: 'arrivalAt', headerName: 'Arrival', width: 250, renderCell: ({ value }) => dayjs(value).format('DD/MM/YYYY HH:mm') },
    { field: 'status', headerName: 'Status', width: 150 },
    {
        field: 'id', headerName: 'Action', width: 300,
        renderCell: ({ row }) => (
            <Stack direction="row">
                {row.status === ReservationStatus.Pending ? <UpdateReservation row={row} /> : null}
                {row.status === ReservationStatus.Pending ? <CancelReservation row={row} /> : null}
            </Stack>
        )
    },
];

const GuestReservationGrid = () => {
    const { loading, error, data } = useQuery(GET_MY_RESERVATIONS, {fetchPolicy: "no-cache"});
    if (error) return <Alert severity="error">{error.message}</Alert>

    const { myReservations } = data || {}
    return <DataGrid loading={loading} rows={myReservations || []} columns={columns} pageSizeOptions={[25, 50, 100]} sx={{minHeight: '25vh'}} />
}

export default GuestReservationGrid;