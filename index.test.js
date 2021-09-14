import tap from 'tap';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readJsonl } from './index.js';

tap.test('test', async (t) => {
  await t.test('sample.jsonl', async (t) => {
    const res = await readJsonl(`${dirname(fileURLToPath(import.meta.url))}/test/sample.jsonl`);
    const data = [];
    for await (const object of res) data.push(object);
    t.matchSnapshot(data);
  });

  await t.test('nested.jsonl', async (t) => {
    const res = await readJsonl(`${dirname(fileURLToPath(import.meta.url))}/test/nested.jsonl`);
    const data = [];
    for await (const object of res) data.push(object);
    t.matchSnapshot(data);
  });
});
