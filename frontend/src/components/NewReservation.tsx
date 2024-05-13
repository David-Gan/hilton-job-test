import { Alert, Box, Button, CircularProgress, Modal, Stack, TextField, Typography } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useApolloClient, useMutation } from "@apollo/client";
import { CREATE_RESERVATION, GET_MY_RESERVATIONS, GET_RESERVATIONS } from "../gqls";
import { sleep } from "../lib";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const defaultFormValues = {
    name: "",
    contact: "",
    size: 2,
    arrivalAt: new Date()
}

type FormValuesType = typeof defaultFormValues;
type FormFieldName = keyof FormValuesType;

const schema = yup
    .object({
        name: yup.string().min(1).required(),
        contact: yup.string().min(1).required(),
        size: yup.number().integer().min(1).required(),
        arrivalAt: yup.date().min(new Date()).required()
    })
    .required()

const NewReservation = () => {
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const [createReservation, { loading, error }] = useMutation(CREATE_RESERVATION);

    const {
        control, handleSubmit, formState: { errors }, setError
    } = useForm({
        defaultValues: defaultFormValues,
        resolver: yupResolver(schema),
    })

    const client = useApolloClient();
    const onSubmit: SubmitHandler<FormValuesType> = async (data) => {
        try {
            await createReservation({ variables: { input: data } })
            await sleep(0.4)
            await client.refetchQueries({ include: [GET_MY_RESERVATIONS, GET_RESERVATIONS] })
            handleClose()
        } catch (error: any) {
            for (const field in error.stack) {
                setError(field as FormFieldName, { message: error.stack[field] })
            }
        }
    }

    const submitHandler = handleSubmit(onSubmit)

    return (
        <>
            <Button variant="contained" size="large" onClick={() => setOpen(true)}>NEW Reservation</Button>
            <Modal open={open}>
                <Box sx={style}>
                    {error ? <Alert severity="error">{error.message}</Alert> : null}
                    {loading ? <CircularProgress /> : null}
                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => <TextField {...field} label="Name" error={errors.name != null} helperText={errors.name?.message} />}
                            />
                            <Controller
                                name="contact"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => <TextField {...field} label="Contact" error={errors.contact != null} helperText={errors.contact?.message} />}
                            />
                            <Controller
                                name="size"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => <TextField {...field} label="Size" type="number" error={errors.size != null} helperText={errors.size?.message} />}
                            />
                            <Controller
                                name="arrivalAt"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Stack>
                                        <DateTimePicker label="Arrival" onChange={(value) => field.onChange(value)} minDate={dayjs()} />
                                        <Typography color="error">{errors.arrivalAt?.message}</Typography>
                                    </Stack>
                                )}
                            />
                            <Stack spacing={3} direction={'row'} sx={{ mt: 5 }}>
                                <Button variant="contained" size="large" type="submit" disabled={loading}>Submit</Button>
                                <Button variant="outlined" size="large" onClick={handleClose}>Cancel</Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Modal>
        </>
    )
}

export default NewReservation