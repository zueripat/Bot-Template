# Client Documentation `v0.2.0`

This Repository contains a Template for a Discord Bot written in Typescript. It uses [Discord.js](https://discord.js.org/#/) as a Wrapper for the Discord API.

## Technologies
* [Typescript](https://www.typescriptlang.org/)
* [Discord.js](https://discord.js.org/#/)
* [Node.js](https://nodejs.org/en/)
* [Prettier](https://prettier.io/)
* [Prisma](https://www.prisma.io/)


## Setup
1. Clone the Repository
2. Install the Dependencies with `npm install`
3. Create a `.env` File in the Root Directory using the Template below
4. Run the Bot with `npm run dev`

### `.env` Template
```dotenv
# -------------------------------------------
# Database
# -------------------------------------------

DATABASE_URL=""

# -------------------------------------------
# Discord
# -------------------------------------------

DISCORD_TOKEN=""
DISCORD_GUILD_ID=""
DISCORD_CLIENT_ID=""
```

## Commands
* `npm run dev` - Runs the Bot in Development Mode
* `npm run build` - Builds the Bot
* `npm run start` - Runs the Bot in Production Mode (Requires the Bot to be built first)
* `npm run format` - Formats the Code using Prettier
* `npm run migrate` - Migrates the Database to the latest Version (Development)

## Database
This Template uses [Prisma](https://www.prisma.io/) as an ORM. The Database is automatically migrated on Startup. You can find the Database Schema in `prisma/schema.prisma`.

## Contributing
If you want to contribute to this Project, feel free to open a Pull Request. If you have any Questions, feel free to contact me on Discord ([`zueripat`](https://discord.com/users/651052819012517888)).
