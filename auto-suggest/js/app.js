import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import streetTypes from '../data/streetTypes.json';
import localities from '../data/localities.json';

import settings from '../settings.json';

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

// global environment configuration "ELASTICSEARCH_URL" defined in web.config.js file, and ONLY accessible from
// this JavaScript file
// const elasticSearchUrl = ELASTICSEARCH_URL;


function buildQuery(escapedValue) {

    var houseNumber = '*';
    var streetName = '';
    var streetType = '*';
    var locality = '*';
    var state = '*';
    var postcode = '*';

    var wordValue = '';
    var matchedValueArray;

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
        matchedValueArray = HOUSE_NUMBER_PRIORITY_PATTERN.exec(escapedValue);

        houseNumber = matchedValueArray[1];
        wordValue = matchedValueArray[2].trim();

        console.log("** houseNumber = " + houseNumber);
    } else if (POSTCODE_PRIORITY_PATTERN.test(escapedValue)) {
        // query value is ended with digits - ended digits mapped to "postcode"
        matchedValueArray = POSTCODE_PRIORITY_PATTERN.exec(escapedValue);

        wordValue = matchedValueArray[1].trim();
        postcode = matchedValueArray[2];

        if (postcode.length < 4) {
            postcode += '*';
        }

        console.log("** postcode = " + postcode);
    } else if (FULL_ADDRESS_PATTERN.test(escapedValue)) {
        // query value is beginning and ended with digits - beginning digits mapped to "house_nbr_1", ended to "postcode"
        matchedValueArray = FULL_ADDRESS_PATTERN.exec(escapedValue);

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
        return {
            "query": {
                "query_string": {
                    "fields": ["house_nbr_1", "street_name", "street_type", "locality_name", "state", "postcode"],
                    "query": escapedValue
                }
            }
        };
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
                        "query_string": { "fields": ["house_nbr_1"], "query": houseNumber }
                    }, {
                        "query_string": { "fields": ["street_name"], "query": (wordValue + "*").replace(new RegExp(" ", 'g'), " && ") }
                    }, {
                        "query_string": { "fields": ["street_type"], "query": streetType }
                    }, {
                        "query_string": { "fields": ["locality_name"], "query": locality.replace(new RegExp(" ", 'g'), " && ") }
                    }, {
                        "query_string": { "fields": ["state"], "query": state }
                    }, {
                        "query_string": { "fields": ["postcode"], "query": postcode }
                    }]
                }
            }
        };
    }

    // doesn't match state, locality and street type patterns
    // reverse looking for last appearance of street type in the middle of query
    var lastIndexOfStreetType = -1;

    streetTypes.some(function (entry) {
        streetType = entry.streetType;
        lastIndexOfStreetType = wordValue.lastIndexOf(" " + streetType + " ");

        if (lastIndexOfStreetType != -1) {
            streetName = wordValue.substring(0, lastIndexOfStreetType);
            locality = wordValue.substr(lastIndexOfStreetType + streetType.length + 2);

            return true;
        }
    });

    if (lastIndexOfStreetType != -1) {
       return {
            "query": {
                "bool": {
                    "must": [{
                        "query_string": { "fields": ["house_nbr_1"], "query": houseNumber }
                    }, {
                        "query_string": { "fields": ["street_name"], "query": (streetName + "*").replace(new RegExp(" ", 'g'), " && ") }
                    }, {
                        "query_string": { "fields": ["street_type"], "query": streetType }
                    }, {
                        "query_string": { "fields": ["locality_name"], "query": (locality + "*").replace(new RegExp(" ", 'g'), " && ") }
                    }, {
                        "query_string": { "fields": ["state"], "query": state }
                    }, {
                        "query_string": { "fields": ["postcode"], "query": postcode }
                    }]
                }
            }
        };
    }

    return {
        "query": {
            "bool": {
                "must": [{
                    "query_string": { "fields": ["house_nbr_1"], "query": houseNumber }
                }, {
                    "query_string": { "fields": ["street_name", "street_type", "locality_name", "state"], "query": (wordValue + "*").replace(new RegExp(" ", 'g'), " && ") }
                }, {
                    "query_string": { "fields": ["postcode"], "query": postcode }
                }]
            }
        }
    };
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


const getSuggestionValue = suggestion => {

    var postalAddress = suggestion._source;

    return postalAddress.house_nbr_1 + " " + postalAddress.street_name + " " + postalAddress.street_type + ", "
        + postalAddress.locality_name + " " + postalAddress.state + " " + postalAddress.postcode;
};

const renderSuggestion = (suggestion, query) => {

    var postalAddress = suggestion._source;

    const suggestionText = postalAddress.house_nbr_1 + " " + postalAddress.street_name + " " + postalAddress.street_type + ", " + postalAddress.locality_name + " " + postalAddress.state + " " + postalAddress.postcode;
    const matches = match(suggestionText, query.query);
    const parts = parse(suggestionText, matches);

    return (
        <span>
            {
                parts.map((part, index) => {
                    let className = undefined;

                    if (part.highlight === true) {
                        className = 'highlight';
                    }

                    return (
                        <span className={className} key={index}>{part.text}</span>
                    );
                })
            }
        </span>
    );
};

class App extends React.Component { // eslint-disable-line no-undef

    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: [],
            isLoading: false
        };

        this.lastRequestId = null;
    }

    loadSuggestions(value) {
        this.setState({
            isLoading: true
          });

        console.log("## Getting matching Postal Addresses action");

        const escapedValue = escapeRegexCharacters(value.trim().toUpperCase());

        if (escapedValue === '') {
            return;
        }

        console.log("** Query value: " + escapedValue);

        var requestBody = buildQuery(escapedValue);

        console.log("** Query request body: " + JSON.stringify(requestBody));

        var headers = new Headers();

        // Since ElasticSearch 5.x, content type "x-www-form-urlencoded" is NOT supported anymore. Replace with "application/json"
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json, text/plain, */*');

        var init = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: JSON.stringify(requestBody),
            redirect: 'follow',
            cache: 'default'
        }

        var request = new Request(settings.elasticSearchUrl + '/postaladdress/_search', init);

        const thisRequest = this.latestRequest = fetch(request)
            .then(response => response.json())
            .then(data => {
                // If this is true there's a newer request happening, stop everything
                if (thisRequest !== this.latestRequest) {
                    return;
                }

                // If this is executed then it's the latest request
                // console.log("** Query result: " + JSON.stringify(data));

                this.setState({
                    suggestions: data.hits.hits,
                    isLoading: false
                });
        })
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.loadSuggestions(value);
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected = (event, { suggestionValue }) => {
        // Get selected Postal Address from input field
        document.getElementById('autocomplete').value = suggestionValue;
        // Pin selected Postal address on Google Maps
        doQuery();
    };

    render() {
        const { value, suggestions, isLoading } = this.state;

        const inputProps = {
            id: "autosuggest",
            placeholder: "Type '111 Bourke St Melbourne VIC 3030' like for suggestions",
            value,
            onChange: this.onChange
        };

        const status = (isLoading ? 'loading ...' : '');

        return (
            <div className="app-container">
                <Autosuggest // eslint-disable-line react/jsx-no-undef
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
                <div className="status">{status}</div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
