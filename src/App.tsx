import { useEffect, useRef, useState } from 'react'
import { Card, Suit, Rank, CardStruct, rankToValue } from './Card'
import './App.css'
import { Deck } from './Deck';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const scoreMax = 21;

type PlayerState = "Playing" | "Stayed";
type HouseState = "Drawing" | "Done";
type HandUser = "Player" | "House";

function App() {
  const deck = useRef(new Deck());

  const [resettingGame, setResettingGame] = useState(true);
  const [isDrawingCard, setIsDrawingCard] = useState(false);

  const [drawnCards, setDrawnCards] = useState<CardStruct[]>([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>("Playing");

  const [houseDrawnCards, setHouseDrawnCards] = useState<CardStruct[]>([]);
  const [houseTotal, setHouseTotal] = useState(0);
  const [houseState, setHouseState] = useState<HouseState>("Drawing");
  const [houseTurns, setHouseTurns] = useState(0);

  const [winner, setWinner] = useState<HandUser | undefined>(undefined);

  function newGame() {
    setIsDrawingCard(false);
    setDrawnCards([]);
    setPlayerTotal(0);
    setPlayerState("Playing");
    setHouseDrawnCards([]);
    setHouseTotal(0);
    setHouseState("Drawing");
    setHouseTurns(0);
    setWinner(undefined);
    setResettingGame(true);
  }

  // constructor
  useEffect(() => {
    if (resettingGame) {
      deck.current.createDeck();
      deck.current.shuffle();
      drawCard();
      setResettingGame(false);
    }
    
  }, [resettingGame]);

  // used for house playing by itself
  useEffect(() => {
    if (playerState !== "Stayed") {return;}

    if (houseState === "Drawing") {
      drawForHouse();
      setTimeout(() => setHouseTurns(houseTurns + 1), 500);
    }
  }, [houseTurns]);

  // code used to see who wons
  useEffect(() => {
    if (playerState !== "Stayed" || houseState !== "Done" && winner !== undefined) {
      return;
    }
    
    let houseOver = houseTotal > scoreMax;
    let playerOver = playerTotal > scoreMax;

    if (houseOver) {
      if (playerOver) {
        setWinner("House");
      }
      else {
        setWinner("Player");
      }
    }
    else {
      if (playerOver) {
        setWinner("House");
      }
      else if (playerTotal <= houseTotal) {
        setWinner("House");
      }
      else {
        setWinner("Player");
      }
    }
  });

  async function drawCard() {
    setIsDrawingCard(true);
    if (houseState === "Drawing") {
      drawForHouse();
    }

    await delay(500);

    if (playerState === "Playing") {
      drawForPlayer();
    }

    await delay(500);
    setIsDrawingCard(false);
  }

  async function stay() {
    setPlayerState("Stayed");
    setHouseTurns(1);
  }

  function drawForHouse() {
    if (playerState === "Stayed" && houseTotal >= playerTotal) {
      setHouseState("Done");
      return;
    }

    let nextCard = deck.current.draw()!;
    let nextTotal = getNextTotal(houseTotal, nextCard);

    if (nextTotal >= 19) {
      setHouseState("Done");
    }

    setHouseDrawnCards([...houseDrawnCards, nextCard])
    setHouseTotal(nextTotal);
  }

  function drawForPlayer() {
    let nextCard = deck.current.draw()!;
    let nextTotal = getNextTotal(playerTotal, nextCard);

    if (nextTotal >= 21) {
      setPlayerState("Stayed");
    }

    setDrawnCards([...drawnCards, nextCard])
    setPlayerTotal(nextTotal);
  }

  function getNextTotal(current: number, card: CardStruct): number {
    let nextTotal = current + rankToValue[card.rank];
    if (card.rank === "Ace" && nextTotal > 21) {
      nextTotal -= 10;
    }
    return nextTotal;
  }

  const isButtonActive = () => playerState === "Playing" && !isDrawingCard;

  return (
    <div id="playArea">

      <h2>{winner !== undefined && `${winner} wins!`}</h2>

      <div className="house">
        <h2>House</h2>
        <div className="hand">
          {houseDrawnCards.map((value, index) => <Card key={index} rank={value.rank} suit={value.suit}/>)}
        </div>

        <p className="score">total: {houseTotal}</p>
        <p>{houseState === "Done" && "Done"}</p>
      </div>
      
      <div className="player">
        <h2>Player</h2>
        <div className="hand">
          {drawnCards.map((value, index) => <Card key={index} rank={value.rank} suit={value.suit}/>)}
        </div>
        <p className="score">total: {playerTotal}</p>
        <p>{playerState === "Stayed" && "Stayed"}</p>

        <div>
          <button onClick={drawCard} disabled={!isButtonActive()}>Hit</button>
          <button onClick={stay} disabled={!isButtonActive()}>Stay</button>
        </div>
      </div>

      <button onClick={newGame}>New game</button>
    </div>
  )
}

export default App
