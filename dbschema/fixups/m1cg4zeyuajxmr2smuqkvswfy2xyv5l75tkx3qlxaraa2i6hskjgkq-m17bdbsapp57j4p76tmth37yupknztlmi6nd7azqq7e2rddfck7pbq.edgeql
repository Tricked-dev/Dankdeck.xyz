CREATE MIGRATION m1zujutrrm4irrcycqz5hmlpc33uexzlhaydm5xj7qli3oxpx7o54a
    ONTO m1cg4zeyuajxmr2smuqkvswfy2xyv5l75tkx3qlxaraa2i6hskjgkq
{
  ALTER TYPE default::Card {
      ALTER PROPERTY number {
          DROP CONSTRAINT std::exclusive;
      };
  };
};
