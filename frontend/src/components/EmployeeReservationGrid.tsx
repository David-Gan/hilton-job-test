import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, MenuItem, Stack, TextField } from '@mui/material';
import UpdateReservation from './UpdateReservation';
import CancelReservation from './CancelReservation';
import { useQuery } from '@apollo/client';
import { GET_RESERVATIONS } from '../gqls';
import { ReservationStatus } from '../types';
import CompleteReservation from './CompleteReservation';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
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
                {row.status === ReservationStatus.Pending ? <CompleteReservation row={row} /> : null}
            </Stack>
        )
    },
];

const EmployeeReservationGrid = () => {
    const [status, setStatus] = useState('')
    const [date, setDate] = useState<dayjs.Dayjs | null>(null)
    const { loading, error, data } = useQuery(GET_RESERVATIONS, {
        pollInterval: 2000,
        variables: {
            date: date,
            status: status
        }
    });
    if (error) return <Alert severity="error">{error.message}</Alert>

    const { reservations } = data || {}
    return (
        <Stack spacing={2}>
            <Stack direction={"row"} spacing={2}>
                <TextField
                    sx={{ minWidth: 150 }}
                    select
                    label="Status"
                    onChange={event => setStatus(event.target.value)}
                >
                    <MenuItem value={''}>ALL</MenuItem>
                    <MenuItem value={ReservationStatus.Pending}>Pending</MenuItem>
                    <MenuItem value={ReservationStatus.Completed}>Completed</MenuItem>
                    <MenuItem value={ReservationStatus.Cancelled}>Cancelled</MenuItem>
                </TextField>
                <DatePicker label="Arrival" value={date} onChange={(value) => setDate(value)} slotProps={{
                    field: { clearable: true, onClear: () => setDate(null) },
                }} />
            </Stack>
            <DataGrid loading={loading} rows={reservations || []} columns={columns} pageSizeOptions={[25, 50, 100]} sx={{ minHeight: '25vh' }} />
        </Stack>
    )
}

export default EmployeeReservationGrid;