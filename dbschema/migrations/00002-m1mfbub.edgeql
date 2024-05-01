CREATE MIGRATION m1mfbub3oelq47ya6tc45777bzj7yhmqp7eymviv6tfwknywjnbjoq
    ONTO m1nsh35wghlfdbtjtlicv4ebyeynpreyiaaullvyyu6v2blavoktka
{
  CREATE TYPE default::Meme {
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY img: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY slug: std::str;
  };
  CREATE TYPE default::Card {
      CREATE REQUIRED LINK meme: default::Meme {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY memeId := (.meme.id);
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY userId := (.user.id);
      CREATE REQUIRED PROPERTY number: std::int64;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK cards := (.<user[IS default::Card]);
  };
};
