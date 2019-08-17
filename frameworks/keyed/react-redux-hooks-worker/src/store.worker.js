import { createStore } from "redux";
import { exposeStore } from "redux-in-worker";

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;
function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    }
  }
  return data;
}

export const initialState = { data: [], selected: 0 };
const store = createStore((state = initialState, action) => {
  const { data, selected } = state;
  switch (action.type) {
    case "RUN":
      return { data: buildData(1000), selected: 0 };
    case "RUN_LOTS":
      return { data: buildData(10000), selected: 0 };
    case "ADD":
      return { data: data.concat(buildData(1000)), selected };
    case "UPDATE": {
      const newData = data.slice();
      for (let i = 0; i < newData.length; i += 10) {
        const r = newData[i];
        newData[i] = { id: r.id, label: r.label + " !!!" };
      }
      return { data: newData, selected };
    }
    case "REMOVE": {
      const idx = data.findIndex(d => d.id === action.id);
      const newData = data.slice();
      newData.splice(idx, 1);
      return { data: newData, selected };
    }
    case "SELECT":
      return { data, selected: action.id };
    case "CLEAR":
      return { data: [], selected: 0 };
    case "SWAP_ROWS": {
      const newData = data.slice();
      const tmp = newData[1];
      newData[1] = newData[998];
      newData[998] = tmp;
      return { data: newData, selected };
    }
  }
  return state;
});

exposeStore(store);
