import './App.css'
import {useEffect, useState} from "react";
import axios from 'axios';
import PokemonDetails from "./assets/components/PokemonDetails/PokemonDetails.jsx";
import Button from "./assets/components/Button/Button.jsx";

function App() {

    const [pokemon, setPokemons] = useState([]);
    const [endpoint, setEndpoint] = useState('https://pokeapi.co/api/v2/pokemon/');
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);


    useEffect(() => {
        const controller = new AbortController()

        async function fetchData() {
            toggleLoading(true);
            toggleError(false);

            try {
                const {data} = await axios.get(endpoint, {
                    signal: controller.signal,
                });
                setPokemons(data);

            } catch (error) {
                if (axios.isCancel(error)) {
                    console.error('Request is canceled....')
                } else {
                    console.error(error);
                    toggleError(true);
                }
            } finally {
                toggleLoading(false);
            }
        }

        fetchData();

        return function cleanup() {
            controller.abort();
        }

    }, [endpoint]);

    return (
        <div className="pokemon-overview">
            <header>
                <img className="pokemon-logo" src="src/assets/pokemon-23-logo-png-transparent.png" alt="pokemon logo"/>
            </header>
            <div className="pokemon-deck">
                {pokemon &&
                    <>
                        <section className="button-section">
                            <Button type="button"
                                    onClick={() => setEndpoint(pokemon.previous)}
                                    disabled={!pokemon.previous}> Vorige
                            </Button>
                            <Button type="button"
                                    onClick={() => setEndpoint(pokemon.next)}
                                    disabled={!pokemon.next}> Next
                            </Button>
                        </section>

                        {pokemon.results && pokemon.results.map((pokemon) => {
                            return <PokemonDetails key={pokemon.name} endpoint={pokemon.url}/>

                        })}
                    </>
                }
                {loading && <p> Loading .... </p>}
                {pokemon.length === 0 && error && <p>Er ging iets mis bij het ophalen van de data...</p>}
            </div>
        </div>
    )
}
export default App;
