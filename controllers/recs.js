const UserModel = require('../models/User');

const intersection = (arr1, arr2) => {
  const result = [];

  arr1.forEach((elem1) => {
    arr2.forEach(elem2 => {
      if (elem1 === elem2) {
        result.push(elem1);
      }
    })
  });

  return result;
}

const recs = {
  get: async (req, res) => {
    try {
      const { _id, tags: currentUserTags } = req.user;

      const users = await UserModel.find({ _id: { $ne: _id } });

      res.json(users.map(user => {
        const { username, email, _id, tags } = user;

        const commonTags = intersection(currentUserTags, tags);

        return {
          _id,
          username,
          email,
          commonTags,
          tags,
          fit: commonTags.length / tags.length * 100,
        };
      }));
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

module.exports = recs;
