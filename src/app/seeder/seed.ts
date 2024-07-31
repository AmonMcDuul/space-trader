import { InventoryItem } from "../models/inventoryItem";
import { MarketItem } from "../models/marketItem";
import { Location } from "../models/location";
import { Shield } from "../models/shield";
import { Weapon } from "../models/weapon";

export const seed = {
    daysPassed: 0,
    balance: 10000,
    fuel: 2,
    shield: new Shield("Basic shield", 20),
    weapon: new Weapon("Basic lasers", 30),
    locations: [
        new Location('Sun station', 1),
        new Location('Mercury refinery', 2),
        new Location('Earth', 3),
        new Location('Mars base', 4),
        new Location('Asteroid belt colony', 5),
        new Location('Saturn ring city', 6),
        new Location('Neptune shipyard', 7),
        new Location('Pluto ice mines', 8),
    ],
    inventory: [
        new InventoryItem('Raktajino', 5, 5),
        new InventoryItem('Space biscuits', 8, 3),
        new InventoryItem('Communications', 60, 1),
    ],
    marketItems: [
        new MarketItem('Raktajino', 5, 5),
        new MarketItem('Space biscuits', 8, 3),
        new MarketItem('Warp core', 350, 1),
        new MarketItem('Space fruit', 10, 5),
        new MarketItem('Bolts', 15, 5),
        new MarketItem('Iron', 20, 5),
        new MarketItem('Plasma torch', 40, 1),
        new MarketItem('Fuel rods', 50, 2),
        new MarketItem('Medical supplies', 70, 1),
        new MarketItem('Communications', 60, 1),
        new MarketItem('Life support system', 99, 1),
        new MarketItem('Navigation system', 120, 1),
        new MarketItem('Robot arm', 150, 1),
        new MarketItem('Solar panels', 85, 1),
        new MarketItem('Artificial gravity', 150, 1),
        new MarketItem('Hydroponics system', 200, 1),
    ],
    statusText: "Dear Special Parcel Service worker.\nBe sure to deliver the package before 3 days have passed.\n Failure to deliver will grant you a $500 fine. \n\nYou notice you are low on fuel..\n"
}