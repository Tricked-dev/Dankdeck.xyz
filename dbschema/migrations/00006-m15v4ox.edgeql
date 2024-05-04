CREATE MIGRATION m15v4oxjb4kgqxfoqli5j2n4rgvagyssr7kc55qiaqqyqe7mssihrq
    ONTO m1bjzenm4exounxzjxfv7ab52doovne3ru4u7wmnoelxjg32ayo4hq
{
  ALTER TYPE default::User {
      ALTER PROPERTY balance {
          SET default := 100;
          SET REQUIRED USING (<std::bigint>{10});
      };
  };
};
