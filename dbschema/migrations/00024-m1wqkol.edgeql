CREATE MIGRATION m1wqkoljavhqefv6ap7ax5khj542jkasugjkjjyitwdiqqjxqihopq
    ONTO m1hm2hwgmpzneaxohbcjfk37vwfitle4lcq7o3dtyfs7j7ylb7s5xa
{
  ALTER TYPE default::User {
      CREATE PROPERTY bio: std::str {
          CREATE CONSTRAINT std::max_len_value(150);
      };
  };
};
