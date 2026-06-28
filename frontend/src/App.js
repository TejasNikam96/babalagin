import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css"
import { store } from "./app/store";
import WebRoutes from "./Routes/WebRoutes";
import SessionValidator from "./component/SessionValidator";

function App() {

  return (
    <Provider store={store}>

      <BrowserRouter>
        <SessionValidator />
        <WebRoutes />
      </BrowserRouter>

    </Provider>
  );
}

export default App;