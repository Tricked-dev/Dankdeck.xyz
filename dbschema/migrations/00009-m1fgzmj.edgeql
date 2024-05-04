CREATE MIGRATION m1fgzmjbbkhpxfelxcjvxxrgqdujydgh2fbgdhtbvjktjhwwnl4jjq
    ONTO m1aruownimy3qsxo5x7dtfhzk3ttkzvvfaddr6qnmtkmeq7npdvmza
{
  ALTER TYPE default::User {
      ALTER PROPERTY balance {
          SET TYPE std::int64 USING (<std::int64>.balance);
      };
  };
};
