const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');
const sentences = require('../../assets/json/typing-game');
const difficulties = ['easy', 'medium', 'hard', 'extreme', 'impossible'];
const times = {
	easy: 25000,
	medium: 20000,
	hard: 15000,
	extreme: 10000,
	impossible: 5000
};

module.exports = class TypingGameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'typing-game',
			aliases: ['typing-quiz', 'typing-test'],
			group: 'games',
			memberName: 'typing',
			description: 'See how fast you can type a sentence in a given time limit.',
			args: [
				{
					key: 'difficulty',
					prompt: `What should the difficulty of the game be? Either ${list(difficulties, 'or')}.`,
					type: 'string',
					validate: difficulty => {
						if (difficulties.includes(difficulty.toLowerCase())) return true;
						return `Invalid difficulty, please enter either ${list(difficulties, 'or')}.`;
					},
					parse: difficulty => difficulty.toLowerCase()
				}
			]
		});
	}

	async run(msg, { difficulty }) {
		const sentence = sentences[Math.floor(Math.random() * sentences.length)];
		const time = times[difficulty];
		await msg.say(stripIndents`
			**You have ${time / 1000} seconds to type this sentence.**
			${sentence}
		`);
		const now = Date.now();
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time
		});
		if (!msgs.size || msgs.first().content !== sentence) return msg.say('Sorry! You lose!');
		return msg.say(`Nice job! 10/10! You deserve some cake! (Took ${(Date.now() - now) / 1000} seconds)`);
	}
};