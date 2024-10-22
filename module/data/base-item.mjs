import CosmereUnofficialDataModel from "./base-model.mjs";
import { version as currentVersion } from "../cosmere-rpg-unofficial.mjs";

export default class CosmereUnofficialItemBase extends CosmereUnofficialDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const schema = {
			"ver": new fields.StringField({ required: true, nullable: false, initial: currentVersion }),
		};

		schema.description = new fields.StringField({ required: true, blank: true });
		schema.showDetails = new fields.BooleanField({ required: true, initial: false });

		return schema;
	}
}
