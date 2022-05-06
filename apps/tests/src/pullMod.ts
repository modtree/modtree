import axios from "axios";

const base = "http://localhost:5001/mod-tree/us-central1";

export function cloud(string: string): string {
  return `${base}/${string}`;
}

const fn = "pullMod";

const modList = [
  "MA2101",
  "MA1301",
  "CS2109S",
  "ES2660",
  "CS3241",
  "CS2309",
  "CS3233",
];

modList.forEach((mod) => {
  axios.post(cloud(fn), { moduleCode: mod }).then((res) => {
    const data = res.data;
    console.debug(data);
  });
});
