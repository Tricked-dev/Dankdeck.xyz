CREATE MIGRATION m1x7rinmptkovpdcntbwp7tnblzfq3l3h7w2hd7e4ti5w3hih6lqiq
    ONTO m1wqkoljavhqefv6ap7ax5khj542jkasugjkjjyitwdiqqjxqihopq
{
  ALTER TYPE default::User {
      CREATE PROPERTY githubName: std::str;
  };
};
