import type { Card, User } from "@db/schema";

import type { ApiUser } from "./interfaces";

let userInfo: ApiUser | undefined = $state(undefined);

export function setUserInfo(user: any) {
  //   userInfo = user;
  userInfo = user;
}

let cards: Card[] | undefined = $state(undefined);

export function setCards(c: Card[]) {
  let cardIds = new Set();
  cards = c.filter((card) => !cardIds.has(card.id) && cardIds.add(card.id));
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
