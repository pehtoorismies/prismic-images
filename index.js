import {
  getAlbums,
  getPhotos,
  validPassword,
  createJWT,
  validateAccess,
} from './src';

const getter = {
  album: getAlbums,
  photo: getPhotos,
};

const getObjects = async (req, res, type) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }
  // Set CORS headers for the main request
  res.set('Access-Control-Allow-Origin', '*');

  const validJWT = validateAccess(req.headers);
  if (!validJWT) {
    return res.status(401).send('Access denied');
  }
  const result = await getter[type].call();
  const json = JSON.stringify(result);
  return res.status(200).send(json);
};

const albums = async (request, response) =>
  getObjects(request, response, 'album');

const photos = async (request, response) =>
  getObjects(request, response, 'photo');

const login = (request, response) => {
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

export { albums, photos, login };
