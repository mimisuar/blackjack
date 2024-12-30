import { useEffect, useRef } from "react";
import diamonds from "./assets/Diamonds-88x124.png";
import hearts from "./assets/Hearts-88x124.png";
import spades from "./assets/Spades-88x124.png";
import clubs from "./assets/Clubs-88x124.png";

export const cardWidth = 88;
export const cardHeight = 124;
export const cardsPerRow = 5;
export const cardCount = 13;

export type Rank = "Ace" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "Jack" | "Queen" | "King";
export type Suit = "Diamonds" | "Hearts" | "Clubs" | "Spades";

export const rankToValue: {[key in Rank]: number} = {
    "Ace": 11,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "Jack": 10,
    "Queen": 10,
    "King": 10 
};

export const rankToIndex: {[key in Rank]: number} = {
    "Ace": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
    "8": 7,
    "9": 8,
    "10": 9,
    "Jack": 10,
    "Queen": 11,
    "King": 12 
};

export const suitURLs: {[suit in Suit]: string} = {
    "Diamonds": diamonds,
    "Clubs": clubs,
    "Hearts": hearts,
    "Spades": spades
};

export const suits: Suit[] = ["Diamonds", "Hearts", "Spades", "Clubs"];
export const ranks: Rank[] = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

export interface CardStruct {
    rank: Rank;
    suit: Suit;
}

export function Card(props: CardStruct) {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (divRef.current === null) {return;}

        let tileIndex = rankToIndex[props.rank];
        let tx = tileIndex % cardsPerRow;
        let ty = Math.floor(tileIndex / cardsPerRow);
    
        let src = suitURLs[props.suit];
        let x = tx*cardWidth;
        let y = ty*cardHeight;
        divRef.current.style.width = cardWidth + "px";
        divRef.current.style.height = cardHeight + "px";
        divRef.current.style.backgroundImage = "url('" + src + "')";
        divRef.current.style.backgroundPosition = "-" + x + "px -" + y + "px";
      }, [props.rank, props.suit]);

    return (
        <div ref={divRef} />
    )
}