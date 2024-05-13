import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Stack, TextField, Button } from "@mui/material"
import { register } from "../../api"
import { useAuthContextDispatch } from "../../contexts/auth.context"

const defaultFormValues = {
    email: "",
    password: "",
    password2: ""
}

type FormValuesType = typeof defaultFormValues;
type FormFieldName = keyof FormValuesType;

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().min(6).max(100).required(),
        password2: yup.string().min(6).max(100).required(),
    })
    .required()

const RegisterForm = () => {
    const authContextDispatch = useAuthContextDispatch()
    const {
        control, handleSubmit, formState: { errors }, setError
    } = useForm({
        defaultValues: defaultFormValues,
        resolver: yupResolver(schema),
    })

    const onSubmit: SubmitHandler<FormValuesType> = async (data) => {
        if (data.password !== data.password2) {
            setError('password2', { message: 'Passwords do not match' })
        }

        const {password2, ...input} = data
        try {
            const token = await register(input)
            authContextDispatch({
                type: 'SET_GUEST_TOKEN',
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
            <Stack spacing={3}>
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
                <Controller
                    name="password2"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <TextField {...field} label="Repeat Password" type="password" error={errors.password2 != null} helperText={errors.password2?.message} />}
                />
                <Button variant="contained" size="large" type="submit">Register</Button>
            </Stack>
        </form>
    )
}

export default RegisterForm