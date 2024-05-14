CREATE MIGRATION m1srg3c4zuw2il645pyf376bdmciodorr2rlioaqzylxyaokkkj7fa
    ONTO m1thjiclubdkuidrhcc4ruukglrctsuqajikemrb6jf3jfnncklefa
{
  ALTER TYPE default::Meme {
      CREATE INDEX fts::index ON ((fts::with_options(.name, language := fts::Language.eng, weight_category := fts::Weight.A), fts::with_options(.description, language := fts::Language.eng, weight_category := fts::Weight.B)));
  };
};
