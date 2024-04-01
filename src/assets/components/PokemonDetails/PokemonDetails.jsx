import React from "react";


function PokemonDetails ({pokemon}) {

    if (!pokemon) {
        return <div> Loading...</div>;
    }

    const {name, sprites, moves, weight, abilities} = pokemon;

    return (
        <div className="pokemon-card">
            <h2> {name}</h2>
            {sprites && (
                <img className="pokemon-image" src={sprites.front_default} alt="pokemon image"/>
            )}
            {moves && (
                <p>Moves : {moves.length}</p>
            )}
            {weight && (
                <p>Weight: {weight}</p>
            )}
            {abilities && (
                <div>
                    <p> Abilities: </p>
                    <ul>
                        {Array.isArray(abilities) && abilities.map((ability, index) => (
                            <li key={index}> {ability.ability.name} </li>
                        ))}
                    </ul>
                </div>
            )}
        </div> );
}
export default PokemonDetails;