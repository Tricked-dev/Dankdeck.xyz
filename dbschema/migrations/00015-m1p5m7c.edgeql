CREATE MIGRATION m1p5m7ciizgtpb6ymxg76nd7kt7wsudxp6obk7suvgsqjs3onuxrsa
    ONTO m1th3vltyzhwy675oi23qmfxwak6v4437ucdknt3qlhiagqqitccpq
{
  ALTER TYPE default::TradeOffer {
      ALTER LINK offeredCards {
          ON TARGET DELETE ALLOW;
      };
      ALTER LINK receivedCards {
          ON TARGET DELETE ALLOW;
      };
  };
};
