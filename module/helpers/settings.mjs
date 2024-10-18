export async function registerSettings() {
	await game.settings.register('cosmere-rpg-unofficial', 'colorTheme', {
		name: 'Color Theme',
		hint: 'Sets visual theme of application windows.',
		scope: 'client',
		config: true,
		type: String,
		default: 'light',
		choices: {
			'light': 'Light',
			'beige': 'Beige',
			'dark': 'Dark',
			'glass': 'Glass'
		},
		requiresReload: true
	});
}
