CREATE MIGRATION m1g5qj26lythbnrfkyjk7udlx5qwquf5l42bqeuz6ccr7bqfp3txta
    ONTO m1srg3c4zuw2il645pyf376bdmciodorr2rlioaqzylxyaokkkj7fa
{
  ALTER TYPE default::Card {
      CREATE REQUIRED PROPERTY views: std::int64 {
          SET default := 0;
      };
  };
};
