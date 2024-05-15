# Astro Starter Kit: Minimal

## Pre-requisites

Create a quick github application:

<https://github.com/settings/developers>

set the callback url to:

`http://localhost:4321/auth/callback/github`

Or the url of your forwarded codespace port

`https://SOME_GIBBERISH-4321.app.github.dev/auth/callback/github`

.env:

```ini
# itll start without these for now.
GITHUB_CLIENT_ID=XXXX
GITHUB_CLIENT_SECRET=XXXX

AUTH_SECRET=somerandomstring
AUTH_TRUST_HOST=true

# Optional - For trading ui
PUBLIC_PUSHER_APP_KEY=
PUBLIC_PUSHER_APP_CLUSTER=
PUSHER_APP_ID=
PUSHER_APP_SECRET=
```

if you are not on localhostlike github codespaces you will need to add this option:

```ini
AUTH_URL=https://SOME_GIBBERISH-4321.app.github.dev/ # Leading slash is important
```

and run

```sh
wget "https://github.com/Tricked-dev/kymdb/raw/master/memes.db?raw" -O memes.db
edgedb project init
bunx @edgedb/generate interfaces --file dbschema/schema.ts
bunx @edgedb/generate edgeql-js --target ts
bun seed.ts
```

## Developing

```sh
edgedb instance start -I codereview # or your instance name / only once per session, takes a while
bun run --bun dev
```

Go to `/login` to login with github and done!

## Design file:

[Figma file](https://www.figma.com/file/Bt5NhBdOCrYtkybuHrXr32/Code-Review?type=design&mode=design&t=StK8x9t6zxXJdtnS-1)

## Todo:

- Add account deletion process with memes being put on auction on delete
- a11y - would be cool if everyone could play this game
- Card favoriting
- Card showcase
- click on like a meme name or something and see existing rolled cards to view them and stuff
- a no nsfw option maybe? or something cause nsfw memes do exist and are marked
- a better user info ui /user/id
- better filtering on the marketplace filter by tags origin time and stuff
- Trading socket changes - detect multiple people or something - dont allow 3 people etc
- A user rating / weight (total cards + average card level + money + cards sold maybe)
- giving a thumbsup to people
- Card view counter (maybe per logged in user once or something or another way to avoid spam!)
- Fix X overallping in trade menu
- Money up and down animation

### UI (ordered by priority):
- Remove body scroll bar
- Fix details accordion taking too much space
- Redesign the card (fix card roll, long card name, maybe do something about the height too)
- Fix accordions being wobbly
- Profile UI improvements
- Probably a better login page
- Add tooltips on hover for CardInfo
- Responsive navbar
- Improve the /cards UI
- Maybe do something about y overflow on CardInfo (not 100% sure yet)
