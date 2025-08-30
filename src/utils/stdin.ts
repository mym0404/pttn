export const readStdin = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = '';

    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });

    process.stdin.on('end', () => {
      resolve(data.trim());
    });

    process.stdin.on('error', (error) => {
      reject(error);
    });
  });
};
