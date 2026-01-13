import type { LeafletVillage } from '../../api/villages';
import { VILLAGES } from './villages';

export const MOCK_VILLAGES: LeafletVillage[] = VILLAGES.map(v => ({
    id: v.id.toString(),
    villageNo: v.moo,
    name: v.name,
    moo: v.moo,
    lat: v.lat,
    lng: v.lng,
    boundary: v.boundary,
    population: v.population,
    households: v.households
}));
