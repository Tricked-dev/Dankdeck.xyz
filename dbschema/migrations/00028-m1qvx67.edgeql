CREATE MIGRATION m1qvx67cvtw43snpzbdbqkuckvxjqiz6s2fsbkmmixemleleexvrna
    ONTO m1duosc62bnqmdtpzdmxnt3qevrryvygbxnfevs2nzrgl4hgeka2tq
{
  CREATE TYPE default::View {
      CREATE REQUIRED LINK card: default::Card {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY cardId := (.card.id);
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
