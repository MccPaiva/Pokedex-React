import React from "react";
import Draggable from 'react-draggable';
import "./style.css";
import missingimg from "./images/missingno.png"
import noimg from "./images/noimage.png"
import search from "./images/search.png"
import loadingimg from "./images/loading.gif"

export default function App() {

  const [currentPokemon, setCurrentPokemon] = React.useState();
  const [pokemonId, setPokemonID] = React.useState(1);
  const [isShiny, setIsShiny] = React.useState(false);
  const [isFront, setIsFront] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  let aborter = null;

  const notFound = {
              name: 'Não Encontrado',
              id: "??",
              sprites: {front_default: noimg,
                        front_shiny: noimg,
                        back_default: noimg,
                        back_shiny: noimg}
        };

    const missingno = {
              name: 'missingno',
              id: "000",
              sprites: {front_default: missingimg}
          }       

  React.useEffect(() =>{

      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(res => res.json())
      .then(data => {
        setIsLoading(false)
        setCurrentPokemon(data)
      })
  }, [pokemonId])

  function searchPokemon(key, content){

      setIsLoading(true);

      if (!isNaN(content) && (function(x) { return (x | 0) === x; })(parseFloat(content))){
        setPokemonID(content)
      }

      if (content == 0){
        setCurrentPokemon(missingno)
        setIsLoading(false)
      } else {
      fetch(`https://pokeapi.co/api/v2/pokemon/${content.toLowerCase()}`)
      .then(res => {

      if (res.status >= 400){
        setCurrentPokemon(notFound)
        setIsLoading(false)
      }
      return res.json()

      })
      .then(data => {
        setCurrentPokemon(data)
        setPokemonID(data.id)
        setIsLoading(false);
      })
    }
  }

  function prepareSearch(key){

    const content = document.querySelector(".poke-input");

    if (key === "Enter"){

      searchPokemon(key, content.value);

      return content.value = "";
    }
  }

  function nextPokemon(){
    setPokemonID(prev => prev === 721 ? 1 : parseInt(prev) + 1);
  }

  function previousPokemon(){
    setPokemonID(prev => prev === 1 ? 721 : prev - 1);
  }

  function toggleShiny(){
    setIsShiny(prev => !prev);
  }

  function toggleFront(){
    setIsFront(prev => !prev);
  }

  let pokeAudio = new Audio(`/sounds/${pokemonId}.ogg`);

  const cry = () => {
    pokeAudio.volume = 0.05;
    pokeAudio.play()
  }

  let buttonPress = new Audio(`/sounds/buttonPress.ogg`);

  const buttonDown = () => {
    buttonPress.volume = 0.2;
    buttonPress.play()
  }

  let buttonRelease = new Audio(`/sounds/buttonRelease2.ogg`);

  const buttonUp = () => {
    buttonRelease.volume = 0.1;
    buttonRelease.play()
  }

  console.log(currentPokemon)

  return (
    <div className="App">
      <Draggable>
        <div className="pokedex">
        {
          isLoading ?
          <img className="pokemon-img" src={loadingimg}></img>
          :
          <img className="pokemon-img" 
          src={
                isShiny ?
                  isFront ?
                    currentPokemon?.sprites?.front_shiny
                    :
                    currentPokemon?.sprites?.back_shiny
                :
                  isFront ?
                    currentPokemon?.sprites?.front_default
                    :
                    currentPokemon?.sprites?.back_default
              }
          ></img>
        } 
          <div className="pokemon-data">
          {
            isLoading ?
            <span>Procurando...</span>
            :
            <>
            <span className="pokemon-id">{`${currentPokemon?.id} - `}</span>
            <span className="pokemon-name">{currentPokemon?.name.charAt(0).toUpperCase() + currentPokemon?.name.slice(1).split('-')[0]}</span>
            </>
          }
          </div>
          <input className="poke-input" placeholder="Nome ou ID" onKeyDown={(e) => prepareSearch(e.key)} type="search"></input>
          <div className="d-pad">
          {/* D-pad html and css from https://vuild.com/game-watch/#game-a */}
            <div className="game-and-watch-leftbutton">
              <div className="game-and-watch-leftbutton-horizontal"></div>
              <div className="game-and-watch-leftbutton-vertical">
                <div onMouseDown={buttonDown} onMouseUp={buttonUp} onClick={toggleShiny} className="game-and-watch-leftbutton-top">
                  <a></a>
                </div>
                <div className="game-and-watch-leftbutton-cover"></div>
                <div onMouseDown={buttonDown} onMouseUp={buttonUp} onClick={toggleFront} className="game-and-watch-leftbutton-bottom">
                  <a></a>
                </div>
                <div onMouseDown={buttonDown} onMouseUp={buttonUp} onClick={previousPokemon} className="game-and-watch-leftbutton-left">
                  <a></a>
                </div>
                <div onMouseDown={buttonDown} onMouseUp={buttonUp} onClick={nextPokemon} className="game-and-watch-leftbutton-right">
                  <a></a>
                </div>
              </div>
            </div>
          </div>
          <div className="button-container">
              <div className="button-case">
                <div onMouseDown={buttonDown} onMouseUp={buttonUp} onClick={(e) => prepareSearch("Enter")} className="high-button">
                  <a><img className="search-icon" src={search} /></a>
                </div>
                <div onMouseDown={buttonDown} onMouseUp={buttonUp} onClick={cry} className="low-button">
                  <a></a>
                </div>
              </div>
            </div>
        </div>
      </Draggable>
    </div>
  );
}
