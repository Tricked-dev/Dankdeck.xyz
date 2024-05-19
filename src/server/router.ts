import { acceptOffer, createOffer, getOffer } from "./routes/offer";

import { binSearch } from "./routes/binsearch";
import { buy } from "./routes/buy";
import { cancel } from "./routes/cancel";
import { daily } from "./routes/daily";
import { deleteAccount } from "./routes/deleteAccount";
import { getCard } from "./routes/getCard";
import { mycards } from "./routes/mycards";
import { onBoard } from "./routes/onboard";
import { picture } from "./routes/picture";
import { profileUpdate } from "./routes/profileUpdate";
import { roll } from "./routes/roll";
import { router } from "./trpc";
import { sell } from "./routes/sell";
import { user } from "./routes/user";
import { view } from "./routes/view";

export const appRouter = router({
  user: user,
  sell: sell,
  roll: roll,
  daily: daily,
  cancel: cancel,
  buy: buy,
  mycards: mycards,
  card: getCard,
  getOffer: getOffer,
  createOffer: createOffer,
  acceptOffer: acceptOffer,
  onBoard: onBoard,
  picture: picture,
  profileUpdate: profileUpdate,
  deleteAccount: deleteAccount,
  binSearch: binSearch,
  view: view,
});
