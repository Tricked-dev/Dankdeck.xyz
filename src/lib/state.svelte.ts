import type { Card, User } from "@db/schema";

import type { ApiUser } from "./interfaces";

let userInfo: ApiUser | undefined = $state(undefined);

export function setUserInfo(user: any) {
  //   userInfo = user;
  userInfo = user;
}

let cards: Card[] | undefined = $state(undefined);

export function setCards(c: Card[]) {
  cards = c;
}

export default {
  get user(): ApiUser | undefined {
    return userInfo;
  },
  set user(user: any) {
    userInfo = user;
  },
  get cards(): Card[] | undefined {
    return cards;
  },
};
