CREATE MIGRATION m1thjiclubdkuidrhcc4ruukglrctsuqajikemrb6jf3jfnncklefa
    ONTO m1s3ono2oqra3scjoyqi5qe5ukwcvkyubwjytsqrg3xpnwrpc4cq6a
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY nsfw: std::bool {
          SET default := true;
      };
      CREATE REQUIRED PROPERTY theme: std::str {
          SET default := 'dark';
      };
  };
};
