const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
});

let myGrades = []; // entiers entre 0 et 10 inclus séparés par des espaces
let nbFriends = null; // entier N compris entre 1 et 20 inclus
let nbBestFriends = null; // entier K compris entre 1 et N inclus
const friendsGrades = [];
let nbMovies = null;
let currentLine = 0;
let isValidFile = true;

rl.on("line", (input) => {
  currentLine++;
  const onlyNumbersAndSPaces = input.search(/[^0-9\s]/g) === -1 ; //input8 invalid
  const separateByOnlyOneSpace = input.search(/[ \s]{2,}/g) === -1; //input10 invalid

  if (onlyNumbersAndSPaces && separateByOnlyOneSpace) {
    if (currentLine === 1) {
      myGrades = input.split(" ").map((grade) => parseInt(grade, 10));
      if (!myGrades.every(grade => grade >= 0 && grade <= 10)) {
        isValidFile = false;
        rl.close();
      }
      nbMovies = myGrades.length;
    } else if (currentLine === 2) {
      nbFriends = parseInt(input, 10);
    } else if (currentLine === 3) {
      nbBestFriends = parseInt(input, 10);
    } else if (currentLine >= 4 && currentLine <= 4 + nbFriends) {
      const grades = input.split(" ");

      const enoughGrades = grades.length === nbMovies + 1
      const gradesBetweenZeroAndTen = grades.every(grade => grade >= 0 && grade <= 10)

      if (!enoughGrades || !gradesBetweenZeroAndTen) { // input12.txt, input7.txt invalid
        isValidFile = false;
        rl.close();
      }

      friendsGrades.push({
        sumOfGaps: grades
          .slice(0, nbMovies)
          .map((grade, index) => Math.abs(myGrades[index] - grade))
          .reduce((sum, grade) => sum + grade),
        lastMovieGrade: parseInt(grades.pop()),
      });
    }
  } else {
    isValidFile = false;
    rl.close();
  }
}).on("close", lastMovieGrade);

function lastMovieGrade() {
  if (!isValidFile) {
    console.log("invalid file");
    return;
  }

  friendsGrades.sort((a, b) => a.sumOfGaps - b.sumOfGaps);

  const myLastMovieGrade =
    friendsGrades
      .slice(0, nbBestFriends)
      .map((grades) => grades.lastMovieGrade)
      .reduce((sum, grade) => sum + grade) / nbBestFriends;

  console.log(Math.trunc(myLastMovieGrade));
}
