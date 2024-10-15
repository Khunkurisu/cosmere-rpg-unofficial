export async function registerSettings() {
	await game.settings.register('cosmere-rpg-unofficial', 'colorTheme', {
		name: 'Color Theme',
		hint: 'Sets whether to have a dark background with light text or vice versa.',
		scope: 'client',
		config: true,
		type: String,
		default: 'Light',
		choices: {
			1: 'Light',
			2: 'Dark'
		},
		requiresReload: true
	});
}
