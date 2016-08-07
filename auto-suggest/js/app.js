'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Autosuggest = require('react-autosuggest');

var streetTypes = require('../data/streetTypes.json');
var localities = require('../data/localities.json');

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

    var body = buildQuery(escapedValue);

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

function buildQuery(escapedValue) {

    var houseNumber = '*';
    var streetName = '';
    var streetType = '*';
    var locality = '*';
    var state = '*';
    var postcode = '*';

    var wordValue = '';

    if (DIGIT_ONLY_PATTERN.test(escapedValue)) {
        // query value is one or more digits - mapped to "house_nbr_1", or "postcode" if it's 4-digit and valid
        if (escapedValue.length == 4 && localities.filter(locality => locality.postcode == escapedValue).length > 0) {
            postcode = escapedValue;
        } else {
            houseNumber = escapedValue;
        }
    } else if (WORD_ONLY_PATTERN.test(escapedValue)) {
        wordValue = escapedValue;
    } else if (HOUSE_NUMBER_PRIORITY_PATTERN.test(escapedValue)) {
        // query value is beginning with digits - beginning digits mapped to "house_nbr_1"
        var matchedValueArray = HOUSE_NUMBER_PRIORITY_PATTERN.exec(escapedValue);

        houseNumber = matchedValueArray[1];
        wordValue = matchedValueArray[2].trim();

        console.log("** houseNumber = " + houseNumber);
    } else if (POSTCODE_PRIORITY_PATTERN.test(escapedValue)) {
        // query value is ended with digits - ended digits mapped to "postcode"
        var matchedValueArray = POSTCODE_PRIORITY_PATTERN.exec(escapedValue);

        wordValue = matchedValueArray[1].trim();
        postcode = matchedValueArray[2];

        if (postcode.length < 4) {
            postcode += '*';
        }

        console.log("** postcode = " + postcode);
    } else if (FULL_ADDRESS_PATTERN.test(escapedValue)) {
        // query value is beginning and ended with digits - beginning digits mapped to "house_nbr_1", ended to "postcode"
        var matchedValueArray = FULL_ADDRESS_PATTERN.exec(escapedValue);

        houseNumber = matchedValueArray[1];
        wordValue = matchedValueArray[2].trim();
        postcode = matchedValueArray[3];

        if (postcode.length < 4) {
            postcode += '*';
        }

        console.log("** houseNumber = " + houseNumber);
        console.log("** postcode = " + postcode);
    } else {
        // query value not match any patterns
        return {"query":{"query_string":{"fields":["house_nbr_1","street_name","street_type","locality_name","state","postcode"],"query":escapedValue}}};
    }

    var isWordValueChanged = false;

    var matchedStateArray = states.filter(state => wordValue.endsWith(state.name));

    if (matchedStateArray.length > 0) {
        state = matchedStateArray[0].name;
        console.log("** state = " + state);

        isWordValueChanged = true;
        wordValue = wordValue.substring(0, wordValue.lastIndexOf(state)).trim();
    }

    var matchedLocalityArray = localities.filter(locality => wordValue.endsWith(locality.suburb));

    if (matchedLocalityArray.length > 0) {
        locality = matchedLocalityArray[0].suburb;
        console.log("** locality = " + locality);

        isWordValueChanged = true;
        wordValue = wordValue.substring(0, wordValue.lastIndexOf(locality)).trim();
    }

    var matchedStreetTypeArray = streetTypes.filter(streetType => wordValue.endsWith(streetType.streetType));

    if (matchedStreetTypeArray.length > 0) {
        streetType = matchedStreetTypeArray[0].streetType;
        console.log("** streetType = " + streetType);

        isWordValueChanged = true;
        wordValue = wordValue.substring(0, wordValue.lastIndexOf(streetType)).trim();
    }

    console.log("** wordValue = " + wordValue);

    if (isWordValueChanged) {
        return {
            "query": {
                "bool": {
                    "must": [{
                        "query": { "query_string": { "fields": ["house_nbr_1"], "query": houseNumber } }
                    }, {
                        "query": { "query_string": { "fields": ["street_name"], "query": (wordValue + "*").replace(new RegExp(" ", 'g'), " && ") } }
                    }, {
                        "query": { "query_string": { "fields": ["street_type"], "query": streetType } }
                    }, {
                        "query": { "query_string": { "fields": ["locality_name"], "query": locality.replace(new RegExp(" ", 'g'), " && ") } }
                    }, {
                        "query": { "query_string": { "fields": ["state"], "query": state } }
                    }, {
                        "query": { "query_string": { "fields": ["postcode"], "query": postcode } }
                    }]
                }
            }
        };
    }

    // doesn't match state, locality and street type patterns
    var splitValue = wordValue.split(" ");

    if (splitValue.length >= 3) {
        // reverse looking for street type in the middle of query
        for (var i = splitValue.length - 2; i > 0; i--) {
            streetType = splitValue[i];

            if (streetTypes.filter(item => item.streetType == streetType).length > 0) {
                streetName = '';
                locality = '';

                for (var j = 0; j < i; j++) {
                    if (j != 0) {
                        streetName += " ";
                    }

                    streetName += splitValue[j];
                }

                for (var j = i + 1; j < splitValue.length; j++) {
                    if (j != i + 1) {
                        locality += " ";
                    }

                    locality += splitValue[j];
                }

                return {
                    "query": {
                        "bool": {
                            "must": [{
                                "query": { "query_string": { "fields": ["house_nbr_1"], "query": houseNumber } }
                            }, {
                                "query": { "query_string": { "fields": ["street_name"], "query": (streetName + "*").replace(new RegExp(" ", 'g'), " && ") } }
                            }, {
                                "query": { "query_string": { "fields": ["street_type"], "query": streetType } }
                            }, {
                                "query": { "query_string": { "fields": ["locality_name"], "query": (locality + "*").replace(new RegExp(" ", 'g'), " && ") } }
                            }, {
                                "query": { "query_string": { "fields": ["state"], "query": state } }
                            }, {
                                "query": { "query_string": { "fields": ["postcode"], "query": postcode } }
                            }]
                        }
                    }
                };
            }
        }
    }

    return {
        "query": {
            "bool": {
                "must": [{
                    "query": { "query_string": { "fields": ["house_nbr_1"], "query": houseNumber } }
                }, {
                    "query": { "query_string": { "fields": ["street_name", "street_type", "locality_name", "state"], "query": (wordValue + "*").replace(new RegExp(" ", 'g'), " && ") } }
                }, {
                    "query": { "query_string": { "fields": ["postcode"], "query": postcode } }
                }]
            }
        }
    };
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
