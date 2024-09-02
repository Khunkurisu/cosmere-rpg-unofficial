import { CosmereUnofficialActor } from "../documents/actor.mjs";

export const COSMERE_UNOFFICIAL = {};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
COSMERE_UNOFFICIAL.attributes = {
	strength: 'COSMERE_UNOFFICIAL.Attribute.Strength.long',
	speed: 'COSMERE_UNOFFICIAL.Attribute.Speed.long',
	intellect: 'COSMERE_UNOFFICIAL.Attribute.Intellect.long',
	willpower: 'COSMERE_UNOFFICIAL.Attribute.Willpower.long',
	awareness: 'COSMERE_UNOFFICIAL.Attribute.Awareness.long',
	presence: 'COSMERE_UNOFFICIAL.Attribute.Presence.long'
};

COSMERE_UNOFFICIAL.attributeAbbreviations = {
	strength: 'COSMERE_UNOFFICIAL.Attribute.Strength.abbr',
	speed: 'COSMERE_UNOFFICIAL.Attribute.Speed.abbr',
	intellect: 'COSMERE_UNOFFICIAL.Attribute.Intellect.abbr',
	willpower: 'COSMERE_UNOFFICIAL.Attribute.Willpower.abbr',
	awareness: 'COSMERE_UNOFFICIAL.Attribute.Awareness.abbr',
	presence: 'COSMERE_UNOFFICIAL.Attribute.Presence.abbr'
};

COSMERE_UNOFFICIAL.defenses = {
	deflect: 'COSMERE_UNOFFICIAL.Defense.Deflect.long',
	physical: 'COSMERE_UNOFFICIAL.Defense.Physical.long',
	cognitive: 'COSMERE_UNOFFICIAL.Defense.Cognitive.long',
	spiritual: 'COSMERE_UNOFFICIAL.Defense.Spiritual.long'
}
