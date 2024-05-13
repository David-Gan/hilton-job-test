import { ReactElement, useMemo } from "react";
import { useAuthContext } from "./auth.context";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export function GraphqlProvider({ children }: { children: ReactElement }) {
    const { guestToken, employeeToken } = useAuthContext()

    const client = useMemo(() => {
        return new ApolloClient({
            uri: 'http://127.0.0.1:3000/graphql',
            cache: new InMemoryCache(),
            headers: {
                Guest_Token: guestToken || '',
                Employee_Token: employeeToken || ''
            }
        });
    }, [guestToken, employeeToken])

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}
