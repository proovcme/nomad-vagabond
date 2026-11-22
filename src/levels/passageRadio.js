import production from '../content/passage.js';
export const RADIO_CUES=Object.fromEntries(production.radio.map(cue=>[cue.id,cue]));
export const CALLSIGNS=Object.fromEntries(production.characters.map(c=>[c.id,c.name]));
