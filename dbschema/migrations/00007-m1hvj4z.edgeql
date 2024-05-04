CREATE MIGRATION m1hvj4zg4hgvwlr62yfzfemszxq752nnwe66so5z7irkasxvlohh6q
    ONTO m15v4oxjb4kgqxfoqli5j2n4rgvagyssr7kc55qiaqqyqe7mssihrq
{
  ALTER TYPE default::BinAuction {
      CREATE REQUIRED PROPERTY cardId := (.card.id);
  };
  ALTER TYPE default::Card {
      ALTER LINK auction {
          USING (SELECT
              default::BinAuction FILTER
                  (.cardId = .id)
          LIMIT
              1
          );
          RESET ON TARGET DELETE;
      };
  };
};
