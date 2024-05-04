# Astro Starter Kit: Minimal

## Pre-requisites

Create a quick github application:

<https://github.com/settings/developers>

set the callback url to:

`http://localhost:4321/api/auth/callback/github`

Or the url of your forwarded codespace port

`https://SOME_GIBBERISH-4321.app.github.dev/api/auth/callback/github`

.env:

```ini
# itll start without these for now.
GITHUB_CLIENT_ID=XXXX
GITHUB_CLIENT_SECRET=XXXX

AUTH_SECRET=somerandomstring
AUTH_TRUST_HOST=true
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

- Make everything responsive
- Add feedback to failed actions
- Add daily money
- Add more metadata to memes
- Transform and save all images elseware
- Add delay to meme
- Make meme numbers make sense
- Add account deletion process with memes being put on auction on delete
