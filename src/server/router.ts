import { protectedProcedure, publicProcedure, router } from "./trpc";

import { buy } from "./routes/buy";
import { cancel } from "./routes/cancel";
import { daily } from "./routes/daily";
import { mycards } from "./routes/mycards";
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
});
