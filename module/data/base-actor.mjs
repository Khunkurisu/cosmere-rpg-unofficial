import { isNumber } from "../helpers/objects.mjs";
import CosmereUnofficialDataModel from "./base-model.mjs";
import { version as currentVersion } from "../cosmere-rpg-unofficial.mjs";

export default class CosmereUnofficialActorBase extends CosmereUnofficialDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = {
			"ver": new fields.StringField({ required: true, nullable: false, initial: currentVersion }),
			"health": new fields.SchemaField({
				"value": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
				"max": new fields.NumberField({ ...requiredInteger, initial: 10 })
			}),
			"focus": new fields.SchemaField({
				"value": new fields.NumberField({ ...requiredInteger, initial: 2, min: 0 }),
				"max": new fields.NumberField({ ...requiredInteger, initial: 2 })
			}),
			"investiture": new fields.SchemaField({
				"value": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
				"max": new fields.NumberField({ ...requiredInteger, initial: 0 })
			}),
			"deflect": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			"physical": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
			"cognitive": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
			"spiritual": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
			"size": new fields.StringField({ initial: "medium" }),
			"expertise": new fields.ArrayField(new fields.ObjectField()),
			"movement": new fields.SchemaField({
				"ground": new fields.NumberField({ ...requiredInteger, initial: 25, min: 5 })
			}),
			"senses": new fields.NumberField({ ...requiredInteger, initial: 5, min: 5 }),
			"marks": new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 }),
			"capacity": new fields.SchemaField({
				"maxLift": new fields.NumberField({ ...requiredInteger, initial: 5, min: 5 }),
				"maxCarry": new fields.NumberField({ ...requiredInteger, initial: 5, min: 5 }),
				"carrying": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
			}),
			"recovery": new fields.NumberField({ ...requiredInteger, initial: 4, min: 4 })
		}

		// Iterate over attribute names and create a new SchemaField for each.
		schema.attributes = new fields.SchemaField(
			Object.keys(CONFIG.COSMERE_UNOFFICIAL.attributes).reduce((obj, attribute) => {
				obj[attribute] = new fields.SchemaField({
					value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
				});
				return obj;
			}, {}));

		schema.skills = new fields.SchemaField({
			"physical": new fields.SchemaField({
				"athletics": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "strength" })
				}),
				"agility": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "speed" })
				}),
				"heavy_weapons": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "strength" })
				}),
				"light_weapons": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "speed" })
				}),
				"stealth": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "speed" })
				}),
				"thievery": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "speed" })
				})
			}),
			"cognitive": new fields.SchemaField({
				"crafting": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" })
				}),
				"deduction": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" })
				}),
				"discipline": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "willpower" })
				}),
				"intimidation": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "willpower" })
				}),
				"lore": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" })
				}),
				"medicine": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" })
				})
			}),
			"spiritual": new fields.SchemaField({
				"deception": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "presence" })
				}),
				"insight": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "awareness" })
				}),
				"leadership": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "presence" })
				}),
				"perception": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "awareness" })
				}),
				"persuasion": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "presence" })
				}),
				"survival": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "awareness" })
				})
			})
		});

		return schema;
	}

	static migrateData(source) {
		let ver = source.ver ?? "0.2.4";
		const version = ver.split('.');
		const release = Number.parseInt(version[0], 10);
		const update = Number.parseInt(version[1], 10);
		const revision = Number.parseInt(version[2], 10);

		if (release <= 0 && update <= 2 && revision < 3) {
			const resources = ["health", "focus", "investiture"];
			const defenses = ["deflect", "physical", "cognitive", "spiritual"];
			for (let r in resources) {
				const resource = resources[r];
				if (!isNumber(source[resource].value)) {
					source[resource].value = 0;
				}
				if (!isNumber(source[resource].max)) {
					source[resource].max = 0;
				}
			}
			for (let d in defenses) {
				const defense = defenses[d];
				if (!isNumber(source[defense])) {
					source[defense] = 0;
				}
			}
			const movement = source.movement ?? {};
			for (let m in movement) {
				const speed = movement[m];
				if (typeof speed === 'object') {
					movement[m] = speed.value;
				}
			}
			const skills = source.skills ?? {};
			for (let c in skills) {
				const category = skills[c];
				for (let s in category) {
					const skill = category[s];
					if ("bonus" in skill) {
						skill.rank = skill.bonus;
						delete skill["bonus"];
					}
				}
			}
		} else if (release <= 0 && update <= 2 && revision < 5) {
			if (!Array.isArray(source.expertise)) {
				let expertises = [];
				for (let e in source.expertise) {
					const oldExpertise = source.expertise[e];
					let type = 'Utility';
					if (oldExpertise.toLowerCase().includes('cultural')) type = 'Cultural';
					else if (oldExpertise.toLowerCase().includes('weapon')) type = 'Weapon';
					else if (oldExpertise.toLowerCase().includes('armor')) type = 'Armor';
					else if (oldExpertise.toLowerCase().includes('special')) type = 'Special';
					const expertise = oldExpertise
						.replace(/[\(\[\{][a-zA-Z0-9\s]+[\]\)\}]/gm, '')
						.trim();

					expertises.push({
						text: expertise,
						category: type
					});
				}
				source.expertise = expertises;
			}
		}

		return source;
	}

}
