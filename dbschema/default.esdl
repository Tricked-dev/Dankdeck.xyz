module default {
    type User {
        property name -> str;
        required property email -> str {
            constraint exclusive;
        };
        property emailVerified -> datetime;
        property image -> str;
        required property balance -> int64 {
            default := 100;
        }
        required property nsfw -> bool {
            default := true;
        }
        required property theme -> str {
            default := 'dark';
        }

        link memePicture -> Meme {
            on target delete delete source;
        }

        picture := (
            'https://r2.dankdeck.xyz/' ++
            (SELECT <str>.memePicture.shortId) ++
            '.png'
        ) IF EXISTS .memePicture ELSE .image;

        multi link accounts         := .<user[is Account];
        multi link sessions         := .<user[is Session];
        multi link cards            := .<user[is Card];
        multi link cardsClaimed     := .<claimedBy[is Card];

        multi link tradeOffers      := .<offerer[is TradeOffer];
        multi link tradeRequests    := .<receiver[is TradeOffer];

        property dailyClaimedAt -> datetime {
            default := datetime_current();
        };

        property cardClaimedAt -> datetime {
            default := datetime_current();
        };

        property createdAt -> datetime {
            default := datetime_current();
        };


    }

    type Account {
        required property userId := .user.id;
        required property type -> str;
        required property provider -> str;
        required property providerAccountId -> str {
            constraint exclusive;
        };
        property refresh_token -> str;
        property access_token -> str;
        property expires_at -> int64;
        property token_type -> str;
        property scope -> str;
        property id_token -> str;
        property session_state -> str;
        required link user -> User {
                on target delete delete source;
        };
        property createdAt -> datetime {
                default := datetime_current();
        };
        constraint exclusive on ((.provider, .providerAccountId));
    }

    type Session {
        required property sessionToken -> str {
            constraint exclusive;
        };
        required property userId := .user.id;
        required property expires -> datetime;
        required link user -> User {
            on target delete delete source;
        };
        property createdAt -> datetime {
            default := datetime_current();
        };
    }
 
    type VerificationToken {
        required property identifier -> str;
        required property token -> str {
            constraint exclusive;
        };
        required property expires -> datetime;
        property createdAt -> datetime {
            default := datetime_current();
        };

        constraint exclusive on ((.identifier, .token));
    }

    type Meme {
        required property slug -> str;
        required property description -> str;
        required property name -> str;
        property shortId -> int64;
        property partOf -> str;
        property origin -> str;
        property stars -> int64;
        property views -> int64;
        property nsfw -> bool;
        property year -> int32;
        property tags -> array<str>;
        property type -> str;
        property idx -> int32;
        constraint exclusive on (.slug);

         index fts::index on ((
            fts::with_options(
                .name,
                language := fts::Language.eng,
                weight_category := fts::Weight.A,
            ),
            fts::with_options(
                .description,
                language := fts::Language.eng,
                weight_category := fts::Weight.B,
            )
        ));
    }

    type Card {
        required property number -> int64 {
        };
        required property createdAt -> datetime {
            default := datetime_current();
        };
        required property userId := .user.id;
        required property memeId := .meme.id;

        required link user -> User {
                on target delete delete source;
        };
        required link claimedBy -> User {
                on target delete delete source;
        };
        required link meme -> Meme {
                on target delete delete source;
        };

        multi link auction := .<card[is BinAuction];
        multi link auctionEntries := .<card[is AuctionEntry];
    };

    type BinAuction {
        required link card -> Card {
            on target delete delete source;
        };
        required property cardId := .card.id;
        required property price -> int64;
        required property createdAt -> datetime {
            default := datetime_current();
        };
    }

    type AuctionEntry {
        required property cardId := .card.id;
        required property sellerId := .seller.id;
        required property buyerId := .buyer.id;

        required link card -> Card {
            on target delete delete source;
        }
        required link seller -> User {
            on target delete delete source;
        }
        required link buyer -> User {
            on target delete delete source;
        }
        required property price -> int64;
        required property createdAt -> datetime {
            default := datetime_current();
        };
        required property soldAt -> datetime {
            default := datetime_current();
        }
    }

    type TradeOffer {
        required link offerer -> User {
            on target delete delete source;
        }
        required link receiver -> User {
            on target delete delete source;
        }
        multi offeredCards: Card {
            on target delete allow;
        };
        multi receivedCards: Card {
            on target delete allow;
        };
        required property createdAt -> datetime {
            default := datetime_current();
        }
        property completedAt -> datetime;
    }
}
