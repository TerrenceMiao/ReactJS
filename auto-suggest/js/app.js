import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import PropTypes from 'prop-types';

import request from 'sync-request';


const streetTypes = require('../data/streetTypes.json');
const localities = require('../data/localities.json');

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


const findMatchedPostalAddresses = value => {

    console.log("## Getting matching Postal Addresses action");

    const escapedValue = escapeRegexCharacters(value.trim().toUpperCase());

    if (escapedValue === '') {
        return [];
    }

    console.log("** Query value: " + escapedValue);

    var requestBody = buildQuery(escapedValue);

    console.log("** Query request body: " + JSON.stringify(requestBody));

    var response = request('POST', 'http://localhost:9200/postaladdress/_search', {body: JSON.stringify(requestBody)});
    var responseBody = JSON.parse(response.getBody('utf8'));

    console.log("** Query response body: " + requestBody);

    return responseBody.hits.hits;
};

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
                    const className = part.highlight;

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
            suggestions: []
        };
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: findMatchedPostalAddresses(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type '111 Bourke St Melbourne VIC 3030' like for suggestions",
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest // eslint-disable-line react/jsx-no-undef
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
