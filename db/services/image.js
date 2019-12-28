const Image = require('../models/image');

module.exports = {
  get: async (params) => {
    return Image.find({}, [], {
      skip: parseInt(params.skip, 10),
      limit: parseInt(params.limit, 10),
      sort: {
        updatedAt: -1
      }
    });
  },
  findById: async (id) => {
    const image = await Image.findById(id);
    return image;
  },
  create: async (params) => {
    const image = new Image(params);
    await image.save();
    
    return image;
  },
  createWithUniqueName: async (params) => {
    await Image.findOneAndUpdate({name: params.name}, params, {upsert: true});
    return true;
  },

  deleteById: async (id) => {
    const image = await Image.findById(id);

    if (!image) throw 'Deleting a image that doesn\'t exist.';

    return image.deleteOne();

  }
};