import * as R from 'ramda';

const array2objects = data => {
  const parsed = {};
  let objectList;
  let headers;
  R.keysIn(data).forEach(key => {
    objectList = [];
    headers = data[key][0]; //eslint-disable-line
    R.range(1, data[key].length).forEach(idx => {
      objectList.push(R.zipObj(headers, data[key][idx]));
    });
    parsed[key] = objectList;
  });
  return parsed;
};

const parseRefs = (refs, data, name) => {
  const parsed = [];
  refs.split(',').forEach(ref => {
    parsed.push(R.find(R.propEq('id', `${name}_${ref.trim()}`), data));
  });
  return parsed;
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
