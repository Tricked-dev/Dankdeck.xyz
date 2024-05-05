CREATE MIGRATION m1nd3uqphrogsht7akk26dj33inmlvjqechcqskpxdto7lfb3qrdca
    ONTO m1fgzmjbbkhpxfelxcjvxxrgqdujydgh2fbgdhtbvjktjhwwnl4jjq
{
  ALTER TYPE default::Card {
      CREATE REQUIRED LINK claimedBy: default::User {
          ON TARGET DELETE DELETE SOURCE;
          SET REQUIRED USING (<default::User>{.user});
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK cards_claimed := (.<claimedBy[IS default::Card]);
      CREATE PROPERTY card_claimed_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY daily_claimed_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
