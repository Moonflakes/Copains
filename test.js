const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const filesInputs = fs.readdirSync("./samples/inputs/");
const filesOutputs = fs.readdirSync("./samples/outputs/");

const loopTest = async (filesInputs, filesOutputs) => {
  for (let index = 0; index < filesInputs.length; index++) {
    console.log(`TEST ${index} sur le fichier ${filesInputs[index]}\n`);
    const resultProgram = await exec(
      `node programme.js < ./samples/inputs/${filesInputs[index]}`
    );
    console.log(`résultat du programme : ${resultProgram.stdout}`);
    const outputResult = await exec(
      `cat ./samples/outputs/${filesOutputs[index]}`
    );
    console.log(`résultat attendu : ${outputResult.stdout}\n`);

    if (resultProgram.stdout === `${outputResult.stdout}\n`) {
      console.log('SUCCESS')
    } else {
      console.log('FAIL')
    }
    console.log("\n-------------------------");
  }
};

loopTest(filesInputs, filesOutputs);
