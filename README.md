# MyMan [![Build Status](https://travis-ci.org/Submoon/MyMan.svg?branch=master)](https://travis-ci.org/Submoon/MyMan)
MyMan is a custom bot written in [TypeScript](https://www.typescriptlang.org/) with [discord.js](https://github.com/discordjs/discord.js) by a little team of developers on their free time.

It aims to provide some cool functionalities to its users and help its contributors learn JavaScript/TypeScript

It is still in heavy development, and is actually hosted on a raspberry pi, so it may be really slow.

If you still want to try it, you can invite it with [this link](https://discordapp.com/api/oauth2/authorize?client_id=402755102735073280&permissions=2146958448&scope=bot)

## Usage
Available commands are available with the command ```!help``` and you can get specific help with ```!help command_name```

Help is provided by a RichEmbed, so please authorize Rich Embeds on your discord client.

## Contributing
Bug reports and pull requests are welcome on GitHub at [Submoon's Github](https://github.com/Submoon/MyMan).

If you are interested in helping the development team, you can try to tackle one of the issues and ask for a pull request when it's over.

Or you can just add or ask for a new functionality completely.

## Installation

### Because of discord.js
Node.js 8.0.0 or newer is required.

Ignore any warnings about unmet peer dependencies, as they're all optional.

### Specific to this app
Clone the repository.

Copy example.config.json to config.json and replace the values with yours. You will need a database (We use postgresql).

Install the node modules

```npm install```

Run the migrations on the database

```npm run migratedb```

Run TypeScript's compilator

```npm run tscwatch```

Start the bot

```npm start```

You can also use the TS linter

```npm run lint```
