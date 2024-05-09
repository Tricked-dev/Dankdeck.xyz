CREATE MIGRATION m1d256msamzb3ur5jwjgikunx5656kpryw5gek2q4re2vgjhbvzz5q
    ONTO m1tp4tttqj7zxyg5jvtr6t7a7thae7vz4b736u3foyoncbnxpnbrta
{
  ALTER TYPE default::Meme {
      CREATE PROPERTY idx: std::int32;
      CREATE PROPERTY nsfw: std::bool;
      CREATE PROPERTY origin: std::str;
      CREATE PROPERTY partOf: std::str;
      CREATE PROPERTY shortId: std::int64;
      CREATE PROPERTY stars: std::int32;
      CREATE PROPERTY tags: array<std::str>;
      CREATE PROPERTY type: std::str;
      CREATE PROPERTY views: std::int32;
      CREATE PROPERTY year: std::int32;
  };
};
