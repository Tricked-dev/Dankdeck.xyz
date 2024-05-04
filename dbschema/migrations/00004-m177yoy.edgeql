CREATE MIGRATION m177yoywl6y44ujxhq7yqb6gymrlgyt5izwtkkeh7atddtdomdukbq
    ONTO m1nvkzbcys67gnkqk3ctgy6ime36orrs5eaxopagaw3m73sldcmcaa
{
  CREATE TYPE default::AuctionEntry {
      CREATE REQUIRED LINK buyer: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY buyerId := (.buyer.id);
      CREATE REQUIRED LINK card: default::Card {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY cardId := (.card.id);
      CREATE REQUIRED LINK seller: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY sellerId := (.seller.id);
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY price: std::int64;
      CREATE REQUIRED PROPERTY soldAt: std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::Card {
      CREATE MULTI LINK auctionEntries := (.<card[IS default::AuctionEntry]);
  };
  CREATE TYPE default::BinAuction {
      CREATE REQUIRED LINK card: default::Card {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY price: std::int64;
  };
  ALTER TYPE default::Card {
      CREATE LINK auction: default::BinAuction {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
