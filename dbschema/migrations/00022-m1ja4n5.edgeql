CREATE MIGRATION m1ja4n5q3dieowuiufnci5pzigokstmqjenhix47rtwqhecn2zhiwa
    ONTO m1g5qj26lythbnrfkyjk7udlx5qwquf5l42bqeuz6ccr7bqfp3txta
{
  ALTER TYPE default::User {
      CREATE MULTI LINK boughtAuctions := (.<buyer[IS default::AuctionEntry]);
      CREATE MULTI LINK soldAuctions := (.<seller[IS default::AuctionEntry]);
  };
};
