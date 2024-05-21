CREATE MIGRATION m15pl6uml2vlsecd3eq7yrmennetta33bqjxlgya66gtnxjulszwiq
    ONTO m1x7rinmptkovpdcntbwp7tnblzfq3l3h7w2hd7e4ti5w3hih6lqiq
{
  ALTER TYPE default::User {
      CREATE PROPERTY discordName: std::str;
  };
};
