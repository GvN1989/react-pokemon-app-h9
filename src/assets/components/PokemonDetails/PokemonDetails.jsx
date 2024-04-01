import React, {useEffect, useState} from "react";
import axios from "axios";


function PokemonDetails ({endpoint}) {

    const [pokemon, setPokemon] = useState({});
    const [loading, toggleLoading] = useState(false);
    const [error, toggleError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            toggleLoading(true);
            toggleError(false);

            try {
                const {data} = await axios.get(endpoint, {
                    signal: controller.signal
                });
                setPokemon(data);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.error('Request is canceled...');
                } else {
                    console.error(error);
                    toggleError(true);
                }
            } finally {
                toggleLoading(false);
            }
        }

    if (endpoint) {
        fetchData();
    }

    return () => {
        console.log("Unmount effect is triggered");
        controller.abort();
    }

}, []);


    return (
        <article className="pokemon-card">
            {console.log("Rerender is triggered")}
            {Object.keys(pokemon).length>0 &&
            <>
                <h2> {pokemon.name}</h2>
                <img
                    alt="pokemon image"
                    src={pokemon.sprites.front_default}
                    />
                <p> <strong>Moves: </strong> {pokemon.moves.length}</p>
                <p> <strong>Weight: </strong>{pokemon.weight}</p>
                <p> <strong>Abilities:</strong> </p>
                <ul>
                    {pokemon.abilities.map ((ability) => {
                        <li key={`${ability.ability.name}-${pokemon.name}`}>
                            {ability.ability.name}
                        </li> }
                    )
                    })
                </ul>
            </>}
            {loading && <p>Loading....</p>}
            {Object.keys(pokemon).length === 0 && error && <p> Er ging iets mis bij het laden van deze Pokemon...</p>}
        </article> );
}
export default PokemonDetails;