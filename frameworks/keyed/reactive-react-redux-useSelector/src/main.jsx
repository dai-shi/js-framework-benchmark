import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'reactive-react-redux';

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

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

const store = createStore((state = { data: [], selected: 0 }, action) => {
  const { data, selected } = state;
  switch (action.type) {
    case 'RUN':
      return { data: buildData(1000), selected: 0 };
    case 'RUN_LOTS':
      return { data: buildData(10000), selected: 0 };
    case 'ADD':
      return { data: data.concat(buildData(1000)), selected };
    case 'UPDATE':
      const newData = data.slice();
      for (let i = 0; i < newData.length; i += 10) {
        const r = newData[i];
        newData[i] = { id: r.id, label: r.label + " !!!" };
      }
      return { data: newData, selected };
    case 'REMOVE':
      const idx = data.findIndex((d) => d.id === action.id);
      return { data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected };
    case 'SELECT':
      return { data, selected: action.id };
    case 'CLEAR':
      return { data: [], selected: 0 };
    case 'SWAP_ROWS':
      return { data: [data[0], data[998], ...data.slice(2, 998), data[1], data[999]], selected };
  }
  return state;
});

function select(id) {
  return { type: 'SELECT', id };
}

function remove(id) {
  return { type: 'REMOVE', id };
}

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = React.memo(({ i }) => {
  const selector = useCallback((state) => {
    const item = state.data[i];
    return state.selected === item.id ? { id: item.id, label: item.label, selected: true } : item;
  }, [i]);
  const { selected, id, label } = useSelector(selector);
  const dispatch = useDispatch();
  const onSelect = useCallback(() => {
    dispatch(select(id));
  }, [dispatch, id]);
  const onRemove = useCallback(() => {
    dispatch(remove(id));
  }, [dispatch, id]);
  return (
    <tr className={selected ? "danger" : ""}>
      <td className="col-md-1">{id}</td>
      <td className="col-md-4"><a onClick={onSelect}>{label}</a></td>
      <td className="col-md-1"><a onClick={onRemove}>{GlyphIcon}</a></td>
      <td className="col-md-6"></td>
    </tr>
  );
});

const InnerRowList = React.memo(({ data }) => {
  return data.map((item, i) => <Row key={item.id} i={i} />);
});

const RowList = () => {
  const data = useSelector(state => state.data);
  return <InnerRowList data={data} />;
};

function Button(props) {
  return (
    <div className="col-sm-6 smallpad">
      <button type="button" className="btn btn-primary btn-block" id={props.id} onClick={props.cb}>{props.title}</button>
    </div>
  );
}

const Main = () => {
  const dispatch = useDispatch();
  const run = useCallback(() => {
    dispatch({ type: 'RUN' });
  }, [dispatch]);
  const runLots = useCallback(() => {
    dispatch({ type: 'RUN_LOTS' });
  }, [dispatch]);
  const add = useCallback(() => {
    dispatch({ type: 'ADD' });
  }, [dispatch]);
  const update = useCallback(() => {
    dispatch({ type: 'UPDATE' });
  }, [dispatch]);
  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, [dispatch]);
  const swapRows = useCallback(() => {
    dispatch({ type: 'SWAP_ROWS' });
  }, [dispatch]);
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>reactive-react-redux useSelector</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" cb={run} />
              <Button id="runlots" title="Create 10,000 rows" cb={runLots} />
              <Button id="add" title="Append 1,000 rows" cb={add} />
              <Button id="update" title="Update every 10th row" cb={update} />
              <Button id="clear" title="Clear" cb={clear} />
              <Button id="swaprows" title="Swap Rows" cb={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data"><tbody><RowList /></tbody></table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  );
};

ReactDOM.render(
  (
    <Provider store={store}>
      <Main />
    </Provider>
  ),
  document.getElementById("main")
);
