'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Autosuggest = require('react-autosuggest');

var streetTypes = require('../data/streetTypes.json');
var localities = require('../data/localities.json');

// console.log("** ALL Street Types: " + JSON.stringify(streetTypes));
// console.log("** ALL Localities: " + JSON.stringify(localities));


//
// Clock example
//
var ExampleApplication = React.createClass({
    render: function () {
        var elapsed = Math.round(this.props.elapsed / 100);
        var seconds = elapsed / 10 + (elapsed % 10 ? '' : '.0' );
        var message = 'React has been successfully running for ' + seconds + ' seconds.';

        return <p>{message}</p>;
    }
});

var start = new Date().getTime();

setInterval(function () {
    ReactDOM.render(<ExampleApplication elapsed={new Date().getTime() - start}/>, document.getElementById('container'));
}, 50);


//
// auto-suggest app
//
/* Data */
const states = [
    { name: 'VIC'},
    { name: 'NSW'},
    { name: 'QLD'},
    { name: 'TAS'},
    { name: 'SA'},
    { name: 'WA'},
    { name: 'NT'}
]

function getMatchingPostalAddresses(value, clazz) {

    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return;
    }

    console.log("** Query value: " + escapedValue);

    var body = '';

    // query value is one or more digits - mapped to "house_nbr_1"
    var regex = new RegExp('^\\d{1,5}$');

    if (regex.test(escapedValue)) {
        body = {"query":{"match":{"house_nbr_1":escapedValue}}}
    }

    // query value is beginning with digits - beginning digits mapped to "house_nbr_1"
    regex = new RegExp('^(\\d{1,5})([\\D|\\s]{1,})$');

    if (regex.test(escapedValue)) {
        var matchedValueArray = regex.exec(escapedValue);

        var houseNumber = matchedValueArray[1];
        var wildValue = matchedValueArray[2].trim();

        body = {"query":{"bool":{"must":[{"match":{"house_nbr_1":houseNumber}}],"should":{"query_string":{"fields":["street_name","street_type","locality_name","state","postcode"],"query":wildValue}}}}};
    }

    // query value is ended with digits - ended digits mapped to "postcode"
    regex = new RegExp('^([\\D|\\s]{1,})(\\d{1,4})$');

    if (regex.test(escapedValue)) {
        var matchedValueArray = regex.exec(escapedValue);

        var wildValue = matchedValueArray[1].trim();
        var postcode = matchedValueArray[2];

        if (postcode.length == 4) {
            body = {"query":{"bool":{"must":{"match":{"postcode":postcode}},"should":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":wildValue}}}}};
        } else {
            postcode = postcode + "*";
            body = {"query":{"bool":{"must":{"wildcard":{"postcode":postcode}},"should":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":wildValue}}}}};
        }
    }

    // query value is beginning and ended with digits - beginning digits mapped to "house_nbr_1", ended to "postcode"
    regex = new RegExp('^(\\d{1,5})([\\D|\\s]{1,})(\\d{1,4})$');

    if (regex.test(escapedValue)) {
        var matchedValueArray = regex.exec(escapedValue);

        var houseNumber = matchedValueArray[1];
        var wildValue = matchedValueArray[2].trim();
        var postcode = matchedValueArray[3];

        if (postcode.length == 4) {
            body = {"query":{"bool":{"must":[{"match":{"house_nbr_1":houseNumber}},{"match":{"postcode":postcode}}],"should":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":wildValue}}}}};
        } else {
            postcode = postcode + "*";
            body = {"query":{"bool":{"must":[{"match":{"house_nbr_1":houseNumber}},{"wildcard":{"postcode":postcode}}],"should":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":wildValue}}}}};
        }
    }

    // query value not match any patterns
    if (body === '') {
        body = {"query":{"query_string":{"fields":["house_nbr_1","street_name","street_type","locality_name","state","postcode"],"query":escapedValue}}};
    }

    console.log("** Query request: " + JSON.stringify(body));

    var headers = new Headers();
    headers.append('Content-Type', 'x-www-form-urlencoded');
    headers.append('Accept', 'application/json, text/plain, */*');

    var init = {
        method: 'POST',
        headers: headers,
        mode: 'cors',
        body: JSON.stringify(body),
        redirect: 'follow',
        cache: 'default'
    };

    var request = new Request('http://localhost:9200/postaladdress/_search', init);

    fetch(request)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log("** Result: " + JSON.stringify(data));

            const suggestions = data.hits.hits;

            if (value === clazz.state.value) {
                clazz.setState({
                    isLoading: false,
                    suggestions
                });
            } else {
                // Ignore suggestions if input value changed
                clazz.setState({
                    isLoading: false
                });
            }
        })
        .catch(function (error) {
            console.log('Request failed with error: ', error);
        });
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {

    var postalAddress = suggestion._source;

    return postalAddress.house_nbr_1 + " " + postalAddress.street_name + " " + postalAddress.street_type + ", "
        + postalAddress.locality_name + " " + postalAddress.state + " " + postalAddress.postcode;
}

function renderSuggestion(suggestion) {

    var postalAddress = suggestion._source;

    return (
        <span>
            {postalAddress.house_nbr_1 + " " + postalAddress.street_name + " " + postalAddress.street_type + ", " + postalAddress.locality_name + " " + postalAddress.state + " " + postalAddress.postcode}
        </span>
    );
}

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: [],
            isLoading: false
        };

        this.onChange = this.onChange.bind(this);
        this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    }

    loadSuggestions(value) {
        this.setState({
            isLoading: true
        });

        // Make an AJAX service call
        getMatchingPostalAddresses(value, this);
    }

    onChange(event, { newValue }) {
        this.setState({
            value: newValue
        });
    }

    onSuggestionSelected(event, { suggestionValue }) {
        this.loadSuggestions(suggestionValue);
    }

    onSuggestionsUpdateRequested({ value }) {
        this.loadSuggestions(value);
    }

    render() {
        const { value, suggestions, isLoading } = this.state;
        const inputProps = {
            placeholder: "Type '111 Bourke St Melbourne VIC 3030' like for suggestions",
            value,
            onChange: this.onChange
        };
        const status = (isLoading ? 'Loading ...' : 'Type, type');

        return (
            <div className="app-container">
                <Autosuggest suggestions={suggestions}
                             onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                             getSuggestionValue={getSuggestionValue}
                             renderSuggestion={renderSuggestion}
                             inputProps={inputProps} />
                <div className="status">
                    <strong>Status:</strong> {status}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
