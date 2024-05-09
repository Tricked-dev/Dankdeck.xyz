CREATE MIGRATION m1cg4zeyuajxmr2smuqkvswfy2xyv5l75tkx3qlxaraa2i6hskjgkq
    ONTO m1p5m7ciizgtpb6ymxg76nd7kt7wsudxp6obk7suvgsqjs3onuxrsa
{
  ALTER TYPE default::Card {
      ALTER PROPERTY number {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
