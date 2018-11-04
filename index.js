import cors from 'cors';
import {
  getAlbums,
  getPhotos,
  validPassword,
  createJWT,
  validateAccess,
} from './src';

const corsHandler = cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
});

const getter = {
  album: getAlbums,
  photo: getPhotos,
};

const getObjects = async (req, res, type) => {
  const validJWT = validateAccess(req.headers);
  if (!validJWT) {
    return res.status(401).send('Access denied');
  }
  const result = await getter[type].call();
  const json = JSON.stringify(result);
  return res.status(200).send(json);
};

const albums = async (request, response) =>
  corsHandler(request, response, () => {
    getObjects(request, response, 'album');
  });

const photos = async (request, response) =>
  corsHandler(request, response, () => {
    getObjects(request, response, 'photo');
  });

const loginFn = (request, response) => {
  if (request.method !== 'POST') {
    return response.status(403).send('Forbidden!');
  }
  if (!validPassword(request.body.password)) {
    return response.status(401).send('Wrong password');
  }
  const jwt = createJWT();
  const json = JSON.stringify(jwt);
  return response.status(200).send(json);
};

const login = (request, response) => {
  corsHandler(request, response, () => {
    loginFn(request, response);
  });
};

export { albums, photos, login };
