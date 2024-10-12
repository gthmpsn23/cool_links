

import express from 'express';
import mongoose from 'mongoose';
import ShortUrl from './models/shortUrl.js';

const app = express();

mongoose.connect('mongodb://localhost/urlShortener');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  try{
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls, errorMessage: null });
  } catch (error){
    res.render('index', { shortUrls: [], errorMessage: "Error fetchin URLs"})
  }
});



app.post('/shortUrls', async (req, res) => {
  let { fullUrl, customAlias } = req.body;

  //  Fetch all short URLs at once
  const shortUrls = await ShortUrl.find();


  //  Ensure the user provided a full URL
  if (!fullUrl) {
    return res.render('index', {
      shortUrls: shortUrls,
      errorMessage: "Please provide a valid URL."
    });
  }


  if (customAlias) {
    const existingUrl = await ShortUrl.findOne({short: customAlias});
    if (existingUrl){
      return res.render('index', {
        shortUrls: shortUrls,
        errorMessage: "Custom alias already taken, please choose another."
      });
    }
  }
  try{
      const shortUrl = await ShortUrl.create({
      full: fullUrl,
      short: customAlias || undefined,
    });

    res.redirect('/');
  } catch (error){
    // handle potential errors from mongoose
    res.render('index', {
      shortUrls: shortUrls,
      errorMessage: "There was an error creating the short URL. Please try again"
    });
  }
});
  
  



app.get('/:shortUrl', async (req, res) => {
  // const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  const shortUrl = await ShortUrl.findOne({ $or: [{ short: req.params.shortUrl }, { customAlias: req.params.shortUrl }] });

  if (shortUrl == null) return res.sendStatus(404);

  // increment clicks by one
  shortUrl.clicks++

  // Save the updated shortUrl wiht incrememnted clicks
  await shortUrl.save()

  //  Redirect to the full UrL
  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 4601, () => {
  console.log('Server is running on port 4601');
});
