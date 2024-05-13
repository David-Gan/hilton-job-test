import * as yup from "yup"
import { Stack, TextField, Button } from "@mui/material"
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { employeeLogin } from "../api";
import { useAuthContextDispatch } from "../contexts/auth.context";

const defaultFormValues = {
    email: "",
    password: ""
}

type FormValuesType = typeof defaultFormValues;
type FormFieldName = keyof FormValuesType;

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().min(6).max(100).required(),
    })
    .required()

const EmployeeAuth = () => {
    const authContextDispatch = useAuthContextDispatch()
    const {
        control, handleSubmit, formState: { errors }, setError
    } = useForm({
        defaultValues: defaultFormValues,
        resolver: yupResolver(schema),
    })

    const onSubmit: SubmitHandler<FormValuesType> = async (data) => {
        try {
            const token = await employeeLogin(data)
            authContextDispatch({
                type: 'SET_EMPLOYEE_TOKEN',
                token
            })
        } catch (error: any) {
            for (const field in error.stack) {
                setError(field as FormFieldName, { message: error.stack[field] })
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} p={2}>
                <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <TextField {...field} label="Email" error={errors.email != null} helperText={errors.email?.message} />}
                />
                <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <TextField {...field} label="Password" type="password" error={errors.password != null} helperText={errors.password?.message} />}
                />
                <Button variant="contained" size="large" type="submit">Login</Button>
            </Stack>
        </form>
    )
}

export default EmployeeAuth