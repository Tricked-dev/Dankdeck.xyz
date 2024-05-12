CREATE MIGRATION m1s3ono2oqra3scjoyqi5qe5ukwcvkyubwjytsqrg3xpnwrpc4cq6a
    ONTO m1zujutrrm4irrcycqz5hmlpc33uexzlhaydm5xj7qli3oxpx7o54a
{
  ALTER TYPE default::User {
      CREATE LINK memePicture: default::Meme {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE PROPERTY picture := (((('https://r2.dankdeck.xyz/' ++ (SELECT
          <std::str>.memePicture.shortId
      )) ++ '.png') IF EXISTS (.memePicture) ELSE .image));
  };
};
