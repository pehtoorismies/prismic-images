import * as R from 'ramda';

// Google marks negative numbers with unicode minus sign (0x2212),
// which is neither a dash (0x2013), nor hyphen-minus (0x2d).
// Javascript expects the latter, so we replace it here
// If the two look indistinguishable on your screen, you'll know why it took me hours to find this problem
const asInt = x => parseInt(x.replace('−', '-'), 10);

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
  if (!refs) return [];
  const find = ref => R.find(R.propEq('id', `${name}_${ref.trim()}`), data);
  return R.map(find, refs.split(','));
};

const parseActions = (actions, traits) => {
  const parsedActions = [];
  actions.forEach(action => {
    parsedActions.push({
      name: action.name,
      id: action.id,
      priorities: parseRefs(
        action.trait_priority,
        traits.priorities,
        'trait_priority'
      ),
      leadership: parseRefs(
        action.trait_leadership,
        traits.leadershipStyles,
        'trait_leadership'
      )[0],
      trait: parseRefs(action.trait_custom, traits.custom, 'trait_custom')[0],
      phases: action.phases || [],
      cost: action.time_cost,
    });
  });
  return parsedActions;
};

const parseTraits = traits => {
  const parseSingle = trait => ({
    name: trait.name,
    id: trait.id,
    disc: {
      d: asInt(trait.d),
      i: asInt(trait.i),
      s: asInt(trait.s),
      c: asInt(trait.c),
    },
    project: asInt(trait.captain),
    cost: trait.time_cost,
  });
  return R.map(parseSingle, traits);
};

const parsePawns = pawns => {
  const getType = traits => {
    const toNum = val => {
      if (val === '100 %') return 1;
      if (val === '50 %') return 0.5;
      return 0;
    };
    const numTraits = R.map(toNum, traits);
    const isNonZero = x => x > 0;
    return R.keysIn(R.filter(isNonZero, numTraits)).join('');
  };
  const parseSingle = pawn => ({
    name: pawn.name,
    id: pawn.id,
    gender: pawn.gender,
    position: parseInt(pawn.start_pos, 10),
    type: getType({ d: pawn.d, i: pawn.i, s: pawn.s, c: pawn.c }),
  });
  return R.map(parseSingle, pawns);
};

const parseOccurrences = occurrences => {
  const parseSingle = occurrence => ({
    ...occurrence,
    d: asInt(occurrence.d),
    i: asInt(occurrence.i),
    s: asInt(occurrence.s),
    c: asInt(occurrence.c),
    project: asInt(occurrence.captain),
  });
  return R.map(parseSingle, occurrences);
};

const parseChallenges = data => {
  const parsedChallenges = [];
  let pawns;
  let occurrences;
  data.challenges.forEach(challenge => {
    pawns = parseRefs(challenge.pawn_id, data.pawns, 'pawn');
    occurrences = parseRefs(
      challenge.randomEvent_id,
      data.occurrences,
      'randomEvent'
    );
    parsedChallenges.push({
      /* name: challenge.name,
      description: challenge.description,
      objective: challenge.objective,
      howToPlay: challenge.howToPlay, */
      ...challenge,
      time: asInt(challenge.time),
      pawns: parsePawns(pawns),
      actions: parseRefs(challenge.action_id, data.actions, 'action'),
      occurrences: parseOccurrences(occurrences),
      phases: parseRefs(challenge.phase_id, data.phases, 'phase'),
      project: {
        position: asInt(challenge.project_position),
      },
      phase: R.find(R.propEq('id', `phase_${challenge.phase_id}`), data.phases)
        .name,
      goal: asInt(challenge.FinishLine),
    });
  });
  return parsedChallenges;
};

const parser = data => {
  const objects = array2objects(data);
  const parsedTraits = {
    leadershipStyles: parseTraits(objects.leadershipStyles),
    priorities: parseTraits(objects.priorities),
    custom: parseTraits(objects.traits),
  };
  const parsedActions = parseActions(objects.actions, parsedTraits);
  objects.actions = parsedActions;
  return {
    ...objects,
    pawns: parsePawns(objects.pawns),
    challenges: parseChallenges(objects),
  };
};

export default parser;
