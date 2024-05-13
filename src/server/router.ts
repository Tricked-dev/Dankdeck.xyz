import { acceptOffer, createOffer, getOffer } from "./routes/offer";
import { protectedProcedure, publicProcedure, router } from "./trpc";

import { buy } from "./routes/buy";
import { cancel } from "./routes/cancel";
import { daily } from "./routes/daily";
import { getCard } from "./routes/getCard";
import { mycards } from "./routes/mycards";
import { onBoard } from "./routes/onboard";
import { picture } from "./routes/picture";
import { profileUpdate } from "./routes/profileUpdate";
import { roll } from "./routes/roll";
import { sell } from "./routes/sell";
import { user } from "./routes/user";

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
});
