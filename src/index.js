import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import * as R from 'ramda';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const apiEndpoint = process.env.PRISMIC_API;
const apiToken = process.env.PRISMIC_TOKEN;
const sitePassword = process.env.PASSWORD;
const jwtSecret = process.env.JWT_SECRET;
const jwtAud = process.env.JWT_AUD;
const jwtIss = process.env.JWT_ISS;

const { asText } = PrismicDOM.RichText;

const parseAlbum = a => ({
  id: a.id,
  title: asText(a.data.albumtitle),
  uid: a.uid,
  mainImage: a.data.mainimage,
});

const getApi = async () => {
  const api = await Prismic.getApi(apiEndpoint, { accessToken: apiToken });
  return api;
};
const getAlbums = async () => {
  const api = await getApi();
  const response = await api.query(
    Prismic.Predicates.at('document.type', 'album'),
    {
      orderings: '[my.album.albumtitle desc]',
    }
  );

  const albums = R.map(parseAlbum, response.results);
  // return results;
  return albums;
};
const getPhotos = async () => {
  const api = await getApi();
  const response = await api.query(
    Prismic.Predicates.at('document.type', 'album'),
    {
      orderings: '[my.album.albumtitle desc]',
    }
  );

  const albums = R.map(parseAlbum, response.results);
  // return results;
  return albums;
};

const validPassword = R.equals(sitePassword);

const createJWT = () =>
  jwt.sign({}, jwtSecret, {
    // 180 days
    expiresIn: 60 * 60 * 24 * 180,
    audience: jwtAud,
    issuer: jwtIss,
  });

const validateAccess = headers => {
  const authHeader = R.propOr('', 'authorization', headers);
  if (!authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7, authHeader.length);
  try {
    jwt.verify(token, jwtSecret);
    return true;
  } catch (err) {
    return false;
  }
};

export { getAlbums, getPhotos, validPassword, createJWT, validateAccess };
