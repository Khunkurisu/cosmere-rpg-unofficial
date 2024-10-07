import CosmereUnofficialGear from "./item-gear.mjs";

export default class CosmereUnofficialWeapon extends CosmereUnofficialGear {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		// Break down roll formula into three independent fields
		schema.damage = new fields.SchemaField({
			count: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 }),
			die: new fields.NumberField({ ...requiredInteger, initial: 4, min: 4, max: 12 }),
			type: new fields.StringField({ initial: "keen" }),
			bonus: new fields.StringField({ initial: "+@modifier" })
		});
		schema.formula = new fields.StringField({ blank: true });

		schema.skill = new fields.StringField({ initial: "heavy" });
		schema.range = new fields.SchemaField({
			type: new fields.StringField({ initial: "melee" }),
			short: new fields.NumberField({ ...requiredInteger, initial: 5, min: 5 }),
			long: new fields.NumberField({ ...requiredInteger, initial: 5, min: 5 })
		});

		schema.equipped = new fields.SchemaField({
			isEquipped: new fields.BooleanField({ required: true, nullable: false, initial: false }),
			slot: new fields.StringField({ initial: "hands" }),
			hands: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 })
		});

		return schema;
	}

	prepareDerivedData() {
		// Build the formula dynamically using string interpolation
		const roll = this.damage;

		this.formula = `${roll.count}d${roll.die}${roll.bonus}[${roll.type}]`
	}
}
