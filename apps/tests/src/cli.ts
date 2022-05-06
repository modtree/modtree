import { createInterface } from 'readline'



const input = createInterface({
  input: process.stdin,
  output: process.stdout,
});

input.question(`> `, userInput => {
  console.log(`Hi ${userInput}!`);
  input.close();
});
