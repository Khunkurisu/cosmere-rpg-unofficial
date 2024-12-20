export const COSMERE_UNOFFICIAL = {};

/**
 * The set of statistics and variables used within the system.
 * @type {Object}
 */

COSMERE_UNOFFICIAL.members = 'COSMERE_UNOFFICIAL.Members';

COSMERE_UNOFFICIAL.biography = {
	backstory: 'COSMERE_UNOFFICIAL.Biography.Backstory',
	purpose: 'COSMERE_UNOFFICIAL.Biography.Purpose',
	obstacle: 'COSMERE_UNOFFICIAL.Biography.Obstacle',
	goals: {
		label: 'COSMERE_UNOFFICIAL.Biography.Goals.label',
		new: 'COSMERE_UNOFFICIAL.Biography.Goals.create',
		remove: 'COSMERE_UNOFFICIAL.Biography.Goals.delete',
		empty: 'COSMERE_UNOFFICIAL.Biography.Goals.missing',
		manage: 'COSMERE_UNOFFICIAL.Biography.Goals.manage',
	},
	connections: {
		label: 'COSMERE_UNOFFICIAL.Biography.Connections.label',
		new: 'COSMERE_UNOFFICIAL.Biography.Connections.create',
		remove: 'COSMERE_UNOFFICIAL.Biography.Connections.delete',
		empty: 'COSMERE_UNOFFICIAL.Biography.Connections.missing',
		manage: 'COSMERE_UNOFFICIAL.Biography.Connections.manage',
	}
};

COSMERE_UNOFFICIAL.combat = {
	fast_players: 'COSMERE_UNOFFICIAL.Combat.FastPlayers',
	fast_adversaries: 'COSMERE_UNOFFICIAL.Combat.FastAdversaries',
	slow_players: 'COSMERE_UNOFFICIAL.Combat.SlowPlayers',
	slow_adversaries: 'COSMERE_UNOFFICIAL.Combat.SlowAdversaries',
}

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
COSMERE_UNOFFICIAL.skills = {
	physical: {
		athletics: 'COSMERE_UNOFFICIAL.Skill.Athletics.long',
		agility: 'COSMERE_UNOFFICIAL.Skill.Agility.long',
		heavy_weapons: 'COSMERE_UNOFFICIAL.Skill.HeavyWeapons.long',
		light_weapons: 'COSMERE_UNOFFICIAL.Skill.LightWeapons.long',
		stealth: 'COSMERE_UNOFFICIAL.Skill.Stealth.long',
		thievery: 'COSMERE_UNOFFICIAL.Skill.Thievery.long'
	},
	cognitive: {
		crafting: 'COSMERE_UNOFFICIAL.Skill.Crafting.long',
		deduction: 'COSMERE_UNOFFICIAL.Skill.Deduction.long',
		discipline: 'COSMERE_UNOFFICIAL.Skill.Discipline.long',
		intimidation: 'COSMERE_UNOFFICIAL.Skill.Intimidation.long',
		lore: 'COSMERE_UNOFFICIAL.Skill.Lore.long',
		medicine: 'COSMERE_UNOFFICIAL.Skill.Medicine.long'
	},
	spiritual: {
		deception: 'COSMERE_UNOFFICIAL.Skill.Deception.long',
		insight: 'COSMERE_UNOFFICIAL.Skill.Insight.long',
		leadership: 'COSMERE_UNOFFICIAL.Skill.Leadership.long',
		perception: 'COSMERE_UNOFFICIAL.Skill.Perception.long',
		persuasion: 'COSMERE_UNOFFICIAL.Skill.Persuasion.long',
		survival: 'COSMERE_UNOFFICIAL.Skill.Survival.long'
	},
	surge: {
		adhesion: 'COSMERE_UNOFFICIAL.Skill.Adhesion.long',
		gravitation: 'COSMERE_UNOFFICIAL.Skill.Gravitation.long',
		division: 'COSMERE_UNOFFICIAL.Skill.Division.long',
		abrasion: 'COSMERE_UNOFFICIAL.Skill.Abrasion.long',
		progression: 'COSMERE_UNOFFICIAL.Skill.Progression.long',
		illumination: 'COSMERE_UNOFFICIAL.Skill.Illumination.long',
		transformation: 'COSMERE_UNOFFICIAL.Skill.Transformation.long',
		transportation: 'COSMERE_UNOFFICIAL.Skill.Transportation.long',
		cohesion: 'COSMERE_UNOFFICIAL.Skill.Cohesion.long',
		tension: 'COSMERE_UNOFFICIAL.Skill.Tension.long',
	},
	expertise: {
		label: 'COSMERE_UNOFFICIAL.Expertise.label',
		new: 'COSMERE_UNOFFICIAL.Expertise.create',
		manage: 'COSMERE_UNOFFICIAL.Expertise.edit',
		remove: 'COSMERE_UNOFFICIAL.Expertise.delete',
		empty: 'COSMERE_UNOFFICIAL.Expertise.missing'
	},
};

COSMERE_UNOFFICIAL.skillAbbreviations = {
	physical: {
		athletics: 'COSMERE_UNOFFICIAL.Skill.Athletics.abbr',
		agility: 'COSMERE_UNOFFICIAL.Skill.Agility.abbr',
		heavy_weapons: 'COSMERE_UNOFFICIAL.Skill.HeavyWeapons.abbr',
		light_weapons: 'COSMERE_UNOFFICIAL.Skill.LightWeapons.abbr',
		stealth: 'COSMERE_UNOFFICIAL.Skill.Stealth.abbr',
		thievery: 'COSMERE_UNOFFICIAL.Skill.Thievery.abbr'
	},
	cognitive: {
		crafting: 'COSMERE_UNOFFICIAL.Skill.Crafting.abbr',
		deduction: 'COSMERE_UNOFFICIAL.Skill.Deduction.abbr',
		discipline: 'COSMERE_UNOFFICIAL.Skill.Discipline.abbr',
		intimidation: 'COSMERE_UNOFFICIAL.Skill.Intimidation.abbr',
		lore: 'COSMERE_UNOFFICIAL.Skill.Lore.abbr',
		medicine: 'COSMERE_UNOFFICIAL.Skill.Medicine.abbr'
	},
	spiritual: {
		deception: 'COSMERE_UNOFFICIAL.Skill.Deception.abbr',
		insight: 'COSMERE_UNOFFICIAL.Skill.Insight.abbr',
		leadership: 'COSMERE_UNOFFICIAL.Skill.Leadership.abbr',
		perception: 'COSMERE_UNOFFICIAL.Skill.Perception.abbr',
		persuasion: 'COSMERE_UNOFFICIAL.Skill.Persuasion.abbr',
		survival: 'COSMERE_UNOFFICIAL.Skill.Survival.abbr'
	},
	surge: {
		adhesion: 'COSMERE_UNOFFICIAL.Skill.Adhesion.abbr',
		gravitation: 'COSMERE_UNOFFICIAL.Skill.Gravitation.abbr',
		division: 'COSMERE_UNOFFICIAL.Skill.Division.abbr',
		abrasion: 'COSMERE_UNOFFICIAL.Skill.Abrasion.abbr',
		progression: 'COSMERE_UNOFFICIAL.Skill.Progression.abbr',
		illumination: 'COSMERE_UNOFFICIAL.Skill.Illumination.abbr',
		transformation: 'COSMERE_UNOFFICIAL.Skill.Transformation.abbr',
		transportation: 'COSMERE_UNOFFICIAL.Skill.Transportation.abbr',
		cohesion: 'COSMERE_UNOFFICIAL.Skill.Cohesion.abbr',
		tension: 'COSMERE_UNOFFICIAL.Skill.Tension.abbr',
	}
};

COSMERE_UNOFFICIAL.defenses = {
	deflect: 'COSMERE_UNOFFICIAL.Defense.Deflect.long',
	physical: 'COSMERE_UNOFFICIAL.Defense.Physical.long',
	cognitive: 'COSMERE_UNOFFICIAL.Defense.Cognitive.long',
	spiritual: 'COSMERE_UNOFFICIAL.Defense.Spiritual.long',
	surge: {
		singular: 'COSMERE_UNOFFICIAL.Defense.Surge.long',
		plural: 'COSMERE_UNOFFICIAL.Defense.Surge.plural',
	},
};

COSMERE_UNOFFICIAL.defenseAbbreviations = {
	deflect: 'COSMERE_UNOFFICIAL.Defense.Deflect.abbr',
	physical: 'COSMERE_UNOFFICIAL.Defense.Physical.abbr',
	cognitive: 'COSMERE_UNOFFICIAL.Defense.Cognitive.abbr',
	spiritual: 'COSMERE_UNOFFICIAL.Defense.Spiritual.abbr',
	surge: 'COSMERE_UNOFFICIAL.Defense.Surge.abbr',
};

COSMERE_UNOFFICIAL.senses = {
	range: 'COSMERE_UNOFFICIAL.Sense.range.long'
};

COSMERE_UNOFFICIAL.movement = {
	ground: 'COSMERE_UNOFFICIAL.Movement.ground.long'
};
