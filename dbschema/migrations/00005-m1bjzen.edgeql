CREATE MIGRATION m1bjzenm4exounxzjxfv7ab52doovne3ru4u7wmnoelxjg32ayo4hq
    ONTO m177yoywl6y44ujxhq7yqb6gymrlgyt5izwtkkeh7atddtdomdukbq
{
  ALTER TYPE default::User {
      CREATE PROPERTY balance: std::bigint;
  };
};
