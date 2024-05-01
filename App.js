import {StyleSheet, Text, View} from 'react-native';
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";

export default function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <Dogs/>
        </QueryClientProvider>
    );
}

const Dogs = () => {
    const getDogs = async () => {
        const response = await fetch("https://dogapi.dog/api/v2/breeds")
        return response.json()
    }
    const {data, isLoading, isError} = useQuery({queryKey: ['dogs'], queryFn: getDogs})
    if (isLoading) {
        return (
            <Text>Loading...</Text>
        )
    }
    if (isError) {
        return (
            <Text>There was an error...</Text>
        )
    }
    return (
        <View style={styles.container}>
            {
                data.data.map(d => <Text key={d.id}>{d.attributes.name}</Text>)
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
