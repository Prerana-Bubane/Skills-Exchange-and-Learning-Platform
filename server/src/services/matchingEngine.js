const User = require('../models/User');

/**
 * Direct match: User A teaches something User B wants to learn,
 * AND User B teaches something User A wants to learn.
 */
const findDirectMatches = (currentUser, allUsers) => {
  const matches = [];

  for (const otherUser of allUsers) {
    // Skip comparing user to themselves
    if (otherUser._id.toString() === currentUser._id.toString()) continue;

    const iCanTeachThem = currentUser.skillsToTeach.some((skill) =>
      otherUser.skillsToLearn.includes(skill)
    );

    const theyCanTeachMe = otherUser.skillsToTeach.some((skill) =>
      currentUser.skillsToLearn.includes(skill)
    );

    if (iCanTeachThem && theyCanTeachMe) {
      // Figure out exactly which skills match, useful to show the user "why" it's a match
      const skillsICanTeachThem = currentUser.skillsToTeach.filter((skill) =>
        otherUser.skillsToLearn.includes(skill)
      );
      const skillsTheyCanTeachMe = otherUser.skillsToTeach.filter((skill) =>
        currentUser.skillsToLearn.includes(skill)
      );

      matches.push({
        user: otherUser,
        type: 'direct',
        youTeach: skillsICanTeachThem,
        theyTeach: skillsTheyCanTeachMe,
      });
    }
  }

  return matches;
};

/**
 * Chain match: A wants to learn from B, B wants to learn from C, C wants to learn from A.
 * This finds 3-way cycles using a graph search (BFS-style).
 * Graph edges: A -> B exists if B teaches something A wants to learn.
 */
const findChainMatches = (currentUser, allUsers) => {
  const chains = [];

  // Build a simple lookup: which users can teach the current user something they want?
  const canTeachMe = (fromUser, toUser) =>
    fromUser.skillsToTeach.some((skill) => toUser.skillsToLearn.includes(skill));

  // Step 1: find everyone who can teach ME something (A -> B edge exists)
  const level1 = allUsers.filter(
    (u) => u._id.toString() !== currentUser._id.toString() && canTeachMe(u, currentUser)
  );

  // Step 2: for each of those, find who THEY want to learn from (B -> C edge)
  for (const userB of level1) {
    const level2 = allUsers.filter(
      (u) =>
        u._id.toString() !== currentUser._id.toString() &&
        u._id.toString() !== userB._id.toString() &&
        canTeachMe(u, userB) // C teaches B something B wants
    );

    // Step 3: check if any of those (C) wants to learn something I teach — closing the loop
    for (const userC of level2) {
      const closesLoop = canTeachMe(currentUser, userC); // I teach C something C wants

      if (closesLoop) {
        chains.push({
          type: 'chain',
          path: [
            { user: currentUser, teachesNext: getMatchingSkills(currentUser, userC) },
            { user: userB, teachesNext: getMatchingSkills(userB, currentUser) },
            { user: userC, teachesNext: getMatchingSkills(userC, userB) },
          ],
        });
      }
    }
  }

  return chains;
};

// Helper: what skills does fromUser teach that toUser wants to learn?
const getMatchingSkills = (fromUser, toUser) =>
  fromUser.skillsToTeach.filter((skill) => toUser.skillsToLearn.includes(skill));

/**
 * Main function called by the controller — combines direct + chain matches
 */
const getMatchesForUser = async (userId) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) throw new Error('User not found');

  const allUsers = await User.find({ _id: { $ne: userId } });

  const directMatches = findDirectMatches(currentUser, allUsers);
  const chainMatches = findChainMatches(currentUser, allUsers);

  return { directMatches, chainMatches };
};

module.exports = { getMatchesForUser, findDirectMatches, findChainMatches };