CREATE MIGRATION m1duosc62bnqmdtpzdmxnt3qevrryvygbxnfevs2nzrgl4hgeka2tq
    ONTO m15pl6uml2vlsecd3eq7yrmennetta33bqjxlgya66gtnxjulszwiq
{
  ALTER TYPE default::User {
      CREATE PROPERTY displayDiscordName: std::bool {
          SET default := false;
      };
      CREATE PROPERTY displayGithubName: std::bool {
          SET default := false;
      };
  };
};
