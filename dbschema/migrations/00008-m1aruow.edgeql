CREATE MIGRATION m1aruownimy3qsxo5x7dtfhzk3ttkzvvfaddr6qnmtkmeq7npdvmza
    ONTO m1hvj4zg4hgvwlr62yfzfemszxq752nnwe66so5z7irkasxvlohh6q
{
  ALTER TYPE default::Card {
      ALTER LINK auction {
          USING (.<card[IS default::BinAuction]);
          SET MULTI;
      };
  };
};
