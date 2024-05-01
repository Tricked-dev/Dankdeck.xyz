CREATE MIGRATION m1nvkzbcys67gnkqk3ctgy6ime36orrs5eaxopagaw3m73sldcmcaa
    ONTO m1mfbub3oelq47ya6tc45777bzj7yhmqp7eymviv6tfwknywjnbjoq
{
  ALTER TYPE default::Meme {
      CREATE CONSTRAINT std::exclusive ON (.slug);
  };
};
