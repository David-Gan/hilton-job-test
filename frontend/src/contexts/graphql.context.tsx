import { ReactElement, useMemo } from "react";
import { useAuthContext } from "./auth.context";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export function GraphqlProvider({ children }: { children: ReactElement }) {
    const { guestToken, employeeToken } = useAuthContext()

    const client = useMemo(() => {
        return new ApolloClient({
            uri: import.meta.env.VITE_GRAPHQL_URL,
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
