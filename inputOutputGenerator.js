const fs = require("fs");
const inputs = fs.readdirSync("./samples/inputs/");

const nbFiles = inputs.length;
const resume = [];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function friendsGradesGenerator(totalFriends, totalMovies, myMoviesGrades) {
  const friendsMoviesGrades = Array.from({ length: totalFriends }, () => {
    const friendMoviesGrades = Array.from({ length: totalMovies }, () =>
      getRandomIntInclusive(0, 10)
    );
    const sumsGaps = friendMoviesGrades
      .slice(0, totalMovies - 1)
      .map((grade, index) => Math.abs(myMoviesGrades[index] - grade))
      .reduce((sum, grade) => sum + grade);

    resume.push({
      sumGaps: sumsGaps,
      lastMovieGrade: friendMoviesGrades[friendMoviesGrades.length - 1],
    });

    return friendMoviesGrades;
  });

  return friendsMoviesGrades;
}

function myGradesGenerator(totalMovies) {
  const myMoviesGrades = Array.from({ length: totalMovies - 1 }, () =>
    getRandomIntInclusive(0, 10)
  );

  return myMoviesGrades;
}

function calculNbBestFriends(totalFriends) {
  let nbBestFriends = getRandomIntInclusive(1, totalFriends);
  resume.sort((a, b) => a.sumGaps - b.sumGaps);

  const isDuplicate = resume[nbBestFriends - 1] === resume[nbBestFriends];

  if (nbBestFriends < totalFriends && isDuplicate) {
    for (let index = nbBestFriends; index < resume.length - 1; index++) {
      if (resume[index] === resume[index + 1]) {
        nbBestFriends++;
      }
    }
  }

  return nbBestFriends;
}

function createOutput(nbBestFriends) {
  const myLastMovieGrade =
    resume
      .slice(0, nbBestFriends)
      .map((grades) => grades.lastMovieGrade)
      .reduce((sum, grade) => sum + grade) / nbBestFriends;

  writeFileOutput(`${Math.trunc(myLastMovieGrade)}`);
}

function writeFileInput(myGrades, nbFriends, nbBestFriends, friendsGrades) {
  const baseContentInput = `${myGrades.join(" ")}\n${nbFriends}\n${nbBestFriends}`;

  const contentInput = friendsGrades.reduce((accumulator, friend) => {
    return accumulator.concat("\n", friend.join(" "));
  }, baseContentInput);

  fs.writeFile(
    `./samples/inputs/input${nbFiles + 1}.txt`,
    contentInput,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

function writeFileOutput(outputContent) {
  fs.writeFile(
    `./samples/outputs/output${nbFiles + 1}.txt`,
    outputContent,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

function getInfos() {
  const totalMovies = getRandomIntInclusive(1, 20);
  const totalFriends = getRandomIntInclusive(1, 20);

  const myMoviesGrades = myGradesGenerator(totalMovies);
  
  const friendsMoviesGrades = friendsGradesGenerator(
    totalFriends,
    totalMovies,
    myMoviesGrades
  );

  const nbBestFriends = calculNbBestFriends(totalFriends);

  createOutput(nbBestFriends);

  writeFileInput(
    myMoviesGrades,
    totalFriends,
    nbBestFriends,
    friendsMoviesGrades
  );
}

getInfos();
