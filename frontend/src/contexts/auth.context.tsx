import { Dispatch, ReactElement, createContext, useContext, useReducer } from "react";

const initialState = {
    guestToken: localStorage.getItem('guestToken'),
    employeeToken: localStorage.getItem('employeeToken')
}

type State = typeof initialState

type Action =
    { type: 'SET_GUEST_TOKEN', token: string } |
    { type: 'SET_EMPLOYEE_TOKEN', token: string } |
    { type: 'CLEAR_TOKEN' }

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_GUEST_TOKEN':
            localStorage.setItem('guestToken', action.token);
            return { ...state, guestToken: action.token }
        case 'SET_EMPLOYEE_TOKEN':
            localStorage.setItem('employeeToken', action.token);
            return { ...state, employeeToken: action.token }
        case 'CLEAR_TOKEN':
            localStorage.removeItem('guestToken');
            localStorage.removeItem('employeeToken');
            return { guestToken: '', employeeToken: '' }
        default: {
            throw Error('Unknown action: ' + action);
        }
    }
}

export const AuthContext = createContext<State>(initialState);
export const AuthDispatchContext = createContext<Dispatch<Action>>(() => initialState);

export function AuthProvider({ children }: { children: ReactElement }) {
    const [state, dispatch] = useReducer<typeof reducer>(
        reducer,
        initialState
    );

    return (
        <AuthContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const useAuthContextDispatch = () => {
    return useContext(AuthDispatchContext);
}