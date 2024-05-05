CREATE MIGRATION m1mb4pej6gkfttyqmmyg5jmqr62ixqxg7zorh6a2e3t6twqxnifivq
    ONTO m1nd3uqphrogsht7akk26dj33inmlvjqechcqskpxdto7lfb3qrdca
{
  ALTER TYPE default::User {
      ALTER LINK cards_claimed {
          RENAME TO cardsClaimed;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY card_claimed_at {
          RENAME TO cardClaimedAt;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY daily_claimed_at {
          RENAME TO dailyClaimedAt;
      };
  };
};
