import cors from 'cors';
import Path from 'path-parser';
import {
  getAlbums,
  getAlbum,
  validPassword,
  createJWT,
  validateAccess,
} from './src';

const corsHandler = cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
});

const getUid = path => {
  const t = Path.createPath('/:uid');
  const parsed = t.test(path);
  if (parsed) {
    return parsed.uid;
  }
  return null;
};

const albums = async (request, response) =>
  corsHandler(request, response, async () => {
    const validJWT = validateAccess(request.headers);
    if (!validJWT) {
      return response.status(401).send('Access denied');
    }
    const uid = getUid(request.path || '');
    const query = uid ? getAlbum : getAlbums;
    const result = await query.call(null, uid);
    const json = JSON.stringify(result);
    return response.status(200).send(json);
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

export { albums, login };
