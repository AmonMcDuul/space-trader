import { InventoryItem } from "../models/inventoryItem";
import { MarketItem } from "../models/marketItem";
import { Location } from "../models/location";
import { GameState } from "../models/gameState";

export const seed = {
    gameLength: 30,
    daysPassed: 0,
    balance: 100,
    shield: 0,
    weapon: 0,
    currentLocation: 'Earth',
    locations: [
        new Location('Earth'),
        new Location('Mars'),
        new Location('Io'),
        new Location('Sun station')
    ],
    inventory: [
        new InventoryItem('Raktajino', 3, 5),
        new InventoryItem('Space biscuits', 7, 3),
        new InventoryItem('Warp core', 100, 1),
    ],
    marketItems: [
        new MarketItem('Space biscuits', 5, 5),
        new MarketItem('Bolts', 10, 5),
        new MarketItem('Iron', 15, 5),
    ]
}