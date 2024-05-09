CREATE MIGRATION m1tp4tttqj7zxyg5jvtr6t7a7thae7vz4b736u3foyoncbnxpnbrta
    ONTO m1mb4pej6gkfttyqmmyg5jmqr62ixqxg7zorh6a2e3t6twqxnifivq
{
  CREATE TYPE default::TradeOffer {
      CREATE MULTI LINK offeredCards: default::Card;
      CREATE REQUIRED LINK offerer: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE MULTI LINK receivedCards: default::Card;
      CREATE REQUIRED LINK receiver: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE PROPERTY completedAt: std::datetime;
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK tradeOffers := (.<offerer[IS default::TradeOffer]);
      CREATE MULTI LINK tradeRequests := (.<receiver[IS default::TradeOffer]);
  };
};
