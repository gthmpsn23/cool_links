
// module.exports = mongoose.model('ShortUrl', shortUrlSchema);

import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: () => nanoid(10),
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  }
});

export default mongoose.model('ShortUrl', shortUrlSchema);
