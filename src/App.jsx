import './App.css'
import {useEffect, useState} from "react";
import axios from 'axios';
import PokemonDetails from "./assets/components/PokemonDetails/PokemonDetails.jsx";
import Button from "./assets/components/Button/Button.jsx";

function App() {

    const [pokemonList, setPokemonList] = useState([]);
    const [currentPage, setCurrentPage] = useState ( () => {
    const storedPage = localStorage.getItem ('currentPage');
    return storedPage ? parseInt(storedPage): 1;
    });

    const [totalPages, setTotalpages] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(()=> {
        const controller= new AbortController()

        async function fetchPokemonList() {



            try {
                setLoading(true);
                const result = await axios.get(` https://pokeapi.co/api/v2/pokemon?offset=${(currentPage - 1) * 20}&limit=20`);
                const pokemons = result.data.results;
                const pokemonDetailsPromises = pokemons.map(pokemon => axios.get(pokemon.url));
                const pokemonDetailsResults = await Promise.all(pokemonDetailsPromises);
                const pokemonDetails = pokemonDetailsResults.map(response => response.data)

                setPokemonList(pokemonDetails)

                const totalPokemonCount = result.data.count;
                const itemsPerPage = 20;
                const totalPages = Math.ceil(totalPokemonCount / itemsPerPage);
                setTotalpages(totalPages);

                setError(null);

            } catch (error) {
                console.error(error);
                if (isMounted) {
                    setError('Failed to fetch Pokémon. Please try again later.')
                }
            } finally {
                if (isMounted){
                setLoading(false);
            }
            }
        }

        fetchPokemonList();

        return function cleanup () {
            controller.abort();
        }

    },[currentPage]);


    const handleNextPage= () => {
        setCurrentPage(currentPage + 1);
        localStorage.setItem('currentPage', currentPage +1);
    };

    const handlePreviousPage=() => {
        setCurrentPage(currentPage-1);
        localStorage.setItem('currentPage', currentPage -1);
    };



    return (
        <>
            <header>
                <img className="pokemon-logo" src="src/assets/pokemon-23-logo-png-transparent.png" alt="pokemon logo"/>
            </header>
            {loading && <div> Loading .... </div>}
            {error && <div style={{color: 'red'}}>{error}</div>}
            <div className="button-section">
                <Button type ="button" onClick={handlePreviousPage} disabled={currentPage===1}> Previous </Button>
                <Button type ="button" onClick={handleNextPage} disabled={currentPage === totalPages} > Next </Button>
            </div>
            <section className="pokemon-overview">
                {pokemonList.map((pokemon,index) => (
                    <PokemonDetails key={index} pokemon= {pokemon}/>
                    ))}
            </section>

        </>
    )
}

export default App
