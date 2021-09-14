import fs from 'fs/promises';

export async function* readFileBackwards(filepath, { mode = 'r', bufferSize = 1024 } = { }) {
  const fd = await fs.open(filepath, mode);

  let partial = '';
  let { size: position } = await fs.stat(filepath);

  while (position > 0) {
    const length = Math.min(bufferSize, position);

    position -= length;

    // eslint-disable-next-line no-await-in-loop
    const { buffer } = await fd.read(Buffer.alloc(length), 0, length, position);

    const lines = (buffer.toString() + partial)
      .split('\n')
      .reverse();

    partial = lines.pop();

    for (const line of lines) {
      yield line;
    }
  }

  if (partial) yield partial;

  await fd.close();
}
