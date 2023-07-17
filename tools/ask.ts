import { createInterface } from 'node:readline';

export async function ask(
  question: string,
  choices: string[]
): Promise<string> {
  const readLine = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise<string>((resolve) => {
    readLine.question(question, (answer) => {
      resolve(choices[parseInt(answer, 10) - 1]);
    });
  });

  readLine.close();

  return answer;
}
