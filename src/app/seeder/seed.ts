import { InventoryItem } from "../models/inventoryItem";
import { MarketItem } from "../models/marketItem";
import { Location } from "../models/location";
import { Shield } from "../models/shield";
import { Weapon } from "../models/weapon";

export const seed = {
    daysPassed: 0,
    balance: 100,
    shield: new Shield("Basic shield", 20),
    weapon: new Weapon("Basic lasers", 30),
    currentLocation: 'Earth',
    locations: [
        new Location('Earth'),
        new Location('Mars'),
        new Location('Io'),
        new Location('Sun station'),
        new Location('Triton moon base'),
        new Location('Neptune shipyard'),
        new Location('Pluto ice mines'),
        new Location('Saturn ring city'),

        // new Location('Charon research station'),
        // new Location('Venus terraforming project'),
        // new Location('Mercury solar power plant'),
        // new Location('Asteroid belt mining colony'),
        // new Location('Jupiter orbit refinery'),
        // new Location('Uranus defense perimeter')
    ],
    inventory: [
        new InventoryItem('Raktajino', 3, 5),
        new InventoryItem('Space biscuits', 7, 3),
        new InventoryItem('Warp core', 100, 1),
    ],
    marketItems: [
        new MarketItem('Raktajino', 3, 5),
        new MarketItem('Space biscuits', 7, 3),
        new MarketItem('Warp core', 100, 1),
        new MarketItem('Space fruit', 5, 5),
        new MarketItem('Bolts', 10, 5),
        new MarketItem('Iron', 15, 5),
        new MarketItem('Plasma torch', 200, 1),
        new MarketItem('Fuel rods', 50, 2),
        new MarketItem('Medical supplies', 800, 1),
        new MarketItem('Communications', 300, 1),
        new MarketItem('Life support system', 700, 1),
        new MarketItem('Navigation system', 600, 1),
        new MarketItem('Robot arm', 150, 1),
        new MarketItem('Solar panels', 250, 1),
        new MarketItem('Artificial gravity', 900, 1),
        new MarketItem('Hydroponics system', 400, 1),
    ],
}