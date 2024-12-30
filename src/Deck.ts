import {suits, ranks, CardStruct} from "./Card";


export class Deck {
    availableCards: CardStruct[] = [];

    constructor() {
        this.createDeck();
    }

    public createDeck() {
        this.availableCards = [];

        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                this.availableCards.push({rank: ranks[j], suit: suits[i]});
            }
        }
    }

    public shuffle() {
        let newDeck: CardStruct[] = [];

        while (this.availableCards.length > 0) {
            let index = Math.floor(Math.random() * this.availableCards.length);
            newDeck.push(this.availableCards[index]);
            this.availableCards.splice(index, 1);
        }

        this.availableCards = newDeck;
    }

    public count = () => this.availableCards.length;
    public draw = () => this.availableCards.pop();
}