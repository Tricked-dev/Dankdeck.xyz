CREATE MIGRATION m1th3vltyzhwy675oi23qmfxwak6v4437ucdknt3qlhiagqqitccpq
    ONTO m1d256msamzb3ur5jwjgikunx5656kpryw5gek2q4re2vgjhbvzz5q
{
  ALTER TYPE default::Meme {
      DROP PROPERTY img;
      ALTER PROPERTY stars {
          SET TYPE std::int64;
      };
      ALTER PROPERTY views {
          SET TYPE std::int64;
      };
  };
};
