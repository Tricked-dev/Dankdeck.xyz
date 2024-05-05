import type { User } from "@db/schema";

type ApiUser = User & {
  cardCount: number;
  cardsClaimedCount: number;
};

let userInfo: ApiUser | undefined = $state(undefined);

export function setUserInfo(user: any) {
  //   userInfo = user;
  userInfo = user;
}

export default {
  get user(): ApiUser | undefined {
    return userInfo;
  },
  set user(user: any) {
    userInfo = user;
  },
};
