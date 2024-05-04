import {StyleSheet, Text, View} from 'react-native';
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
import {useState} from "react";

const getDogById = async (id) => {
    const response = await fetch(`https://dogapi.dog/api/v2/breeds/${id}`);
    return response.json()
}
const getDogs = async () => {
    const response = await fetch("https://dogapi.dog/api/v2/breeds")
    return response.json()
}

const getFacts = async (numFacts) => {
    console.log(numFacts)
    const response = await fetch(`https://dogapi.dog/api/v2/facts?limit=${numFacts}`)
    return response.json()
}
export default function App() {
    const queryClient = new QueryClient()
    const [selectedId, setSelectedId] = useState('')
    const handleDogClicked = (id) => {
        setSelectedId(id)
    }
    return (
        <QueryClientProvider client={queryClient}>
            <View style={styles.container}>
                <Dogs handleDogClick={handleDogClicked}/>
                <Facts numFacts={5}/>
                <Dog dogId={selectedId}/>
            </View>
        </QueryClientProvider>
    );
}

const Facts = ({numFacts}) => {
    const {data: facts, isLoading: factsLoading, isError: factsError} = useQuery({
        queryKey: ['facts'],
        queryFn: () => getFacts(numFacts)
    })
    if (factsLoading) return <Text>Facts Loading...</Text>
    if (factsError) return <Text>Facts Error...</Text>
    console.log(facts.data.length)
    return (
        <View>
            <Text>Fact(s):</Text>
            {
                facts.data.map(fact => <Text key={fact.id}>{fact.attributes.body}</Text>)
            }
        </View>
    )
}

const Dog = ({dogId}) => {
    const {data: dog, isLoading: dogLoading, isError: dogError} = useQuery({
        queryKey: ['dog', dogId],
        queryFn: () => getDogById(dogId)
    })
    if (dogLoading) return <div>Loading...</div>;
    if (dogError) return <div>Error fetching item...</div>;
    return (
        <View style={styles.dog}>
            {
                dog.data.attributes &&
                <View>
                    <Text>{dog.data.attributes.name}</Text>
                    <Text>{dog.data.attributes.description}</Text>
                </View>
            }
        </View>
    )
}
const Dogs = ({handleDogClick}) => {
    const {data: dogs, isLoading: dogsLoading, isError: dogsError} = useQuery({queryKey: ['dogs'], queryFn: getDogs})
    if (dogsLoading) {
        return (
            <Text>Loading...</Text>
        )
    }
    if (dogsError) {
        return (
            <Text>There was an error...</Text>
        )
    }
    return (
        <View>
            {
                dogs.data.map(d => <Text onPress={() => handleDogClick(d.id)} key={d.id}>{d.attributes.name}</Text>)
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
    dog: {
        width: '50%'
    }
});
