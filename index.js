import { readFileBackwards } from './lib/readFile.js';

export async function* readJsonl(filepath) {
  const childObjects = { };

  const rl = await readFileBackwards(filepath);

  for await (const line of rl) {
    // eslint-disable-next-line no-continue
    if (!line) continue;

    const object = JSON.parse(line);

    const [, objectType] = /gid:\/\/shopify\/(.*)\/\d/.exec(object.id);

    if (childObjects[object.id]) {
      Object.assign(object, {
        ...childObjects[object.id],
      });

      delete childObjects[object.id];
    }

    if (object.__parentId) {
      if (!childObjects[object.__parentId]) {
        childObjects[object.__parentId] = { };
      }

      if (!childObjects[object.__parentId][objectType]) {
        childObjects[object.__parentId][objectType] = [];
      }

      childObjects[object.__parentId][objectType].push(object);
    }

    if (!object.__parentId) {
      yield object;
    } else {
      delete object.__parentId;
    }
  }
}
