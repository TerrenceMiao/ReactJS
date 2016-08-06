'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Autosuggest = require('react-autosuggest');

var streetTypes = require('../data/streetTypes.json');
var localities = require('../data/localities.json');

// console.log("** ALL Street Types: " + JSON.stringify(streetTypes));
// console.log("** ALL Localities: " + JSON.stringify(localities));

//
// auto-suggest app
//
const states = [
    { name: 'VIC'},
    { name: 'NSW'},
    { name: 'QLD'},
    { name: 'TAS'},
    { name: 'SA'},
    { name: 'WA'},
    { name: 'NT'}
]

const DIGIT_ONLY_PATTERN = /^\d{1,5}$/;
const WORD_ONLY_PATTERN = /^[\D|\s]*$/;
const HOUSE_NUMBER_PRIORITY_PATTERN = /^(\d{1,5})([\D|\s]{1,})$/;
const POSTCODE_PRIORITY_PATTERN = /^([\D|\s]{1,})(\d{1,4})$/;
const FULL_ADDRESS_PATTERN = /^(\d{1,5})([\D|\s]{1,})(\d{1,4})$/;

function getMatchingPostalAddresses(value, clazz) {

    const escapedValue = escapeRegexCharacters(value.trim().toUpperCase());

    if (escapedValue === '') {
        return;
    }

    console.log("** Query value: " + escapedValue);

    var body;

    if (DIGIT_ONLY_PATTERN.test(escapedValue)) {
        // query value is one or more digits - mapped to "house_nbr_1", or "postcode" if it's 4-digit and valid
        if (escapedValue.length == 4 && localities.filter(locality => locality.postcode == escapedValue).length > 0) {
            body = {"query":{"match":{"postcode":escapedValue}}}
        } else {
            body = {"query":{"match":{"house_nbr_1":escapedValue}}}
        }
    } else if (WORD_ONLY_PATTERN.test(escapedValue)) {
        if (states.filter(state => state.name == escapedValue).length > 0) {
            // query value matches one of states
            body = {"query":{"match":{"state":escapedValue}}}
        } else if (localities.filter(locality => locality.suburb == escapedValue).length > 0) {
            // query value matches one of localities / suburbs
            // whitespace is reserved character and mean "OR" in ElasticSearch
            body = {"query":{"query_string":{"fields":["locality_name"],"query":escapedValue.replace(" ", " && ")}}};
        } else {
            // query value not match any
            var splitValue = escapedValue.split(" ");

            if (splitValue.length == 2) {
                var streetName = splitValue[0];
                var streetType = splitValue[1];

                if (streetTypes.filter(item => item.streetType == streetType).length > 0) {
                    body = {"query":{"bool":{"must":[{"query":{"query_string":{"fields":["street_name"],"query":(streetName + "*").replace(" ", " && ")}}},{"match":{"street_type":streetType}}]}}};
                } else {
                    body = {"query":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":escapedValue}}};
                }
            } else if (splitValue.length >= 3) {
                for (var i = splitValue.length - 1; i > 0; i--) {
                    var streetType = splitValue[i];

                    if (streetTypes.filter(item => item.streetType == streetType).length > 0) {

                        var streetName = '';

                        for (var j = 0; j < i; j++) {
                            if (j != 0) {
                                streetName += " ";
                            }

                            streetName += splitValue[j];
                        }

                        var locality = '';

                        for (var j = i + 1; j < splitValue.length; j++) {
                            if (j != i + 1) {
                                locality += " ";
                            }

                            locality += splitValue[j];
                        }

                        body = {"query":{"bool":{"must":[{"query":{"query_string":{"fields":["street_name"],"query":(streetName + "*").replace(" ", " && ")}}},{"match":{"street_type":streetType}},{"query":{"query_string":{"fields":["locality_name"],"query":(locality + "*").replace(" ", " && ")}}}]}}};

                        break;
                    } else {
                        body = {"query":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":escapedValue}}};
                    }
                }
            } else {
                body = {"query":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":escapedValue}}};
            }
        }
    } else if (HOUSE_NUMBER_PRIORITY_PATTERN.test(escapedValue)) {
        // query value is beginning with digits - beginning digits mapped to "house_nbr_1"
        var matchedValueArray = HOUSE_NUMBER_PRIORITY_PATTERN.exec(escapedValue);

        var houseNumber = matchedValueArray[1];
        var wildValue = matchedValueArray[2].trim();

        body = {"query":{"bool":{"must":[{"match":{"house_nbr_1":houseNumber}}],"should":{"query_string":{"fields":["street_name","street_type","locality_name","state","postcode"],"query":wildValue}}}}};
    } else if (POSTCODE_PRIORITY_PATTERN.test(escapedValue)) {
        // query value is ended with digits - ended digits mapped to "postcode"
        var matchedValueArray = POSTCODE_PRIORITY_PATTERN.exec(escapedValue);

        var wildValue = matchedValueArray[1].trim();
        var postcode = matchedValueArray[2];

        if (postcode.length == 4) {
            body = {"query":{"bool":{"must":{"match":{"postcode":postcode}},"should":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":wildValue}}}}};
        } else {
            body = {"query":{"bool":{"must":{"wildcard":{"postcode":postcode + "*"}},"should":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":wildValue}}}}};
        }
    } else if (FULL_ADDRESS_PATTERN.test(escapedValue)) {
        // query value is beginning and ended with digits - beginning digits mapped to "house_nbr_1", ended to "postcode"
        var matchedValueArray = FULL_ADDRESS_PATTERN.exec(escapedValue);

        var houseNumber = matchedValueArray[1];
        var wildValue = matchedValueArray[2].trim();
        var postcode = matchedValueArray[3];

        if (postcode.length == 4) {
            body = {"query":{"bool":{"must":[{"match":{"house_nbr_1":houseNumber}},{"match":{"postcode":postcode}}],"should":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":wildValue}}}}};
        } else {
            body = {"query":{"bool":{"must":[{"match":{"house_nbr_1":houseNumber}},{"wildcard":{"postcode":postcode + "*"}}],"should":{"query_string":{"fields":["street_name","street_type","locality_name","state"],"query":wildValue}}}}};
        }
    } else {
        // query value not match any patterns
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
        const status = (isLoading ? '...' : '');

        return (
            <div className="app-container">
                <Autosuggest suggestions={suggestions}
                             onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                             getSuggestionValue={getSuggestionValue}
                             renderSuggestion={renderSuggestion}
                             inputProps={inputProps} />
                <div className="status">{status}</div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
