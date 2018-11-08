import * as R from 'ramda';

const array2objects = data => {
  const objects = {};
  R.keysIn(data).forEach(key => {
    const headers = R.head(data[key]);
    const addHeaders = line => R.zipObj(headers, line);
    objects[key] = R.map(addHeaders, R.tail(data[key]));
  });
  return objects;
};

const parseRefs = (refs, data, name) => {
  const find = ref => R.find(R.propEq('id', `${name}_${ref.trim()}`), data);
  return R.map(find, refs.split(','));
};

const parseChallenges = data => {
  const parsedChallenges = [];
  data.challenges.forEach(challenge => {
    parsedChallenges.push({
      ...challenge,
      pawns: parseRefs(challenge.pawn_id, data.pawns, 'pawn'),
      actions: parseRefs(challenge.action_id, data.actions, 'action'),
      occurrences: parseRefs(
        challenge.randomEvent_id,
        data.occurrences,
        'randomEvent'
      ),
      phases: parseRefs(challenge.phase_id, data.phases, 'phase'),
    });
  });
  return parsedChallenges;
};

const parser = data => {
  const objects = array2objects(data);
  return {
    ...objects,
    challenges: parseChallenges(objects),
  };
};

export default parser;
