import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import { wrapStore } from "redux-in-worker";
import { Provider, useDispatch, useSelector } from "react-redux";

import { initialState } from "./store.worker";

const worker = new Worker("./store.worker", { type: "module" });
const store = wrapStore(worker, initialState);

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = React.memo(({ data }) => {
  const isSelected = useSelector((state) => state.selected === data.id);
  const dispatch = useDispatch();
  const select = useCallback(() => { dispatch({ type: "SELECT", id: data.id }); }, [data]);
  const remove = useCallback(() => { dispatch({ type: "REMOVE", id: data.id }); }, [data]);
  return (
    <tr className={isSelected ? "danger" : ""}>
      <td className="col-md-1">{data.id}</td>
      <td className="col-md-4"><a onClick={select}>{data.label}</a></td>
      <td className="col-md-1"><a onClick={remove}>{GlyphIcon}</a></td>
      <td className="col-md-6"></td>
    </tr>
  )
});

const RowList = React.memo(() => {
  const rows = useSelector((state) => state.data);
  return rows.map((data) => <Row key={data.id} data={data} />);
});

const Button = React.memo(({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
  </div>
));

const Main = () => {
  const dispatch = useDispatch();
  const run = useCallback(() => { dispatch({ type: "RUN" }); }, []);
  const runLots = useCallback(() => { dispatch({ type: "RUN_LOTS" }); }, []);
  const add = useCallback(() => { dispatch({ type: "ADD" }); }, []);
  const update = useCallback(() => { dispatch({ type: "UPDATE" }); }, []);
  const clear = useCallback(() => { dispatch({ type: "CLEAR" }); }, []);
  const swapRows = useCallback(() => { dispatch({ type: "SWAP_ROWS" }); }, []);
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6"><h1>React + Redux</h1></div>
          <div className="col-md-6"><div className="row">
            <Button id="run" title="Create 1,000 rows" cb={run} />
            <Button id="runlots" title="Create 10,000 rows" cb={runLots} />
            <Button id="add" title="Append 1,000 rows" cb={add} />
            <Button id="update" title="Update every 10th row" cb={update} />
            <Button id="clear" title="Clear" cb={clear} />
            <Button id="swaprows" title="Swap Rows" cb={swapRows} />
          </div></div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data"><tbody><RowList /></tbody></table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}><Main /></Provider>,
  document.getElementById("main")
);
