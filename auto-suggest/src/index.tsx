import * as React from "react";
import * as ReactDOM from "react-dom";

import { IProps, App } from "./App";

let initValue: string = '';
let initSuggestions: string[] = [];
let initIsLoading: boolean = false;

ReactDOM.render(
    <App value={initValue} suggestions={initSuggestions} isLoading={initIsLoading} />, document.getElementById('app')
);