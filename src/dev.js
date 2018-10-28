import { getAlbums } from '.';

const run = async () => {
  const albums = await getAlbums();
  console.log('albums', albums[0].mainImage);
};

run();
