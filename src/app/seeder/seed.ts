import { InventoryItem } from "../models/inventoryItem";
import { MarketItem } from "../models/marketItem";
import { Location } from "../models/location";
import { Shield } from "../models/shield";
import { Weapon } from "../models/weapon";
import { SpecialDelivery } from "../models/specialDelivery";

export const seed = {
    daysPassed: 0,
    balance: 100,
    fuel: 10,
    shield: new Shield("Basic shield", 20),
    weapon: new Weapon("Basic lasers", 30),
    // currentLocation: 'Earth',
    locations: [
        new Location('Sun station', 1),
        new Location('Mercury refinery', 2),
        new Location('Earth', 3),
        new Location('Mars base', 4),
        new Location('Asteroid belt colony', 5),
        new Location('Saturn ring city', 6),
        new Location('Neptune shipyard', 7),
        new Location('Pluto ice mines', 8),

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
        new InventoryItem('Warp core', 100, 100),
    ],
    marketItems: [
        new MarketItem('Raktajino', 25, 5),
        new MarketItem('Space biscuits', 25, 3),
        new MarketItem('Warp core', 1000, 1),
        new MarketItem('Space fruit', 20, 5),
        new MarketItem('Bolts', 100, 5),
        new MarketItem('Iron', 150, 5),
        new MarketItem('Plasma torch', 200, 1),
        new MarketItem('Fuel rods', 50, 2),
        new MarketItem('Medical supplies', 300, 1),
        new MarketItem('Communications', 350, 1),
        new MarketItem('Life support system', 500, 1),
        new MarketItem('Navigation system', 200, 1),
        new MarketItem('Robot arm', 180, 1),
        new MarketItem('Solar panels', 120, 1),
        new MarketItem('Artificial gravity', 800, 1),
        new MarketItem('Hydroponics system', 400, 1),
    ],
}