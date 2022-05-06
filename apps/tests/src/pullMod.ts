import axios from "axios";

const base = "http://localhost:5001/mod-tree/us-central1";

export function cloud(string: string): string {
  return `${base}/${string}`;
}

const fn = "pullMod";

const modList = ["CS1101S", "CS1231S", "CS2030S", "CS2040S"];

modList.forEach((mod) => {
  axios.post(cloud(fn), { moduleCode: mod }).then((res) => {
    const data = res.data;
    console.debug(data);
  });
});
