import axios from "axios";

const base = "http://localhost:5001/mod-tree/us-central1";

export function cloud(string: string): string {
  return `${base}/${string}`;
}

const fn = "apiMod";

const modList = ['CS2030S'];

modList.forEach((mod) => {
  axios.post(cloud(fn), { moduleCode: mod }).then((res) => {
    const data = res.data;
    console.debug(data);
  });
});
