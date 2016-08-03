'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Autosuggest = require('react-autosuggest');

//
// React example
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
// App
//

/* Data */
const languages = [
    {
        name: 'C',
        year: 1972
    },
    {
        name: 'C#',
        year: 2000
    },
    {
        name: 'C++',
        year: 1983
    },
    {
        name: 'Clojure',
        year: 2007
    },
    {
        name: 'Elm',
        year: 2012
    },
    {
        name: 'Go',
        year: 2009
    },
    {
        name: 'Haskell',
        year: 1990
    },
    {
        name: 'Java',
        year: 1995
    },
    {
        name: 'Javascript',
        year: 1995
    },
    {
        name: 'Perl',
        year: 1987
    },
    {
        name: 'PHP',
        year: 1995
    },
    {
        name: 'Python',
        year: 1991
    },
    {
        name: 'Ruby',
        year: 1995
    },
    {
        name: 'Scala',
        year: 2003
    }
];

function getMatchingLanguages(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return languages.filter(language => regex.test(language.name));
}

function getMatchingPostalAddresses(value, clazz) {

    console.log("** Query: " + value);

    var headers = new Headers();
    headers.append('Content-Type', 'x-www-form-urlencoded');
    headers.append('Accept', 'application/json, text/plain, */*');

    var init = {
        method: 'POST',
        headers: headers,
        mode: 'cors',
        body: JSON.stringify({"query":{"query_string":{"fields":["house_nbr_1","street_name","street_type","locality_name","state","postcode"],"query":value}}}),
        redirect: 'follow',
        cache: 'default'
    };

    var request = new Request('http://localhost:9200/postaladdress/_search', init);

    fetch(request)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("** Result: " + JSON.stringify(data));

            const suggestions = data.hits.hits;

            clazz.setState({
                isLoading: false,
                suggestions
            });
        })
        .catch(function (error) {
            console.log('Request failed with error: ', error);
        });
}

/* Utils */
// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function randomDelay() {
    return 300 + Math.random() * 1000;
}

/* Component */
function getSuggestionValue(suggestion) {
    // return suggestion.name;

    var postalAddress = suggestion._source;

    return postalAddress.house_nbr_1 + " " + postalAddress.street_name + " " + postalAddress.street_type + ", "
        + postalAddress.locality_name + " " + postalAddress.state + " " + postalAddress.postcode;
}

function renderSuggestion(suggestion) {

    var postalAddress = suggestion._source;

    return (
        // <span>{suggestion.name}</span>

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
            suggestions: getMatchingLanguages(''),
            isLoading: false
        };

        this.onChange = this.onChange.bind(this);
        this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    }

    loadSuggestions(value) {
        this.setState({
            isLoading: true
        });

        // Make an AJAX call
/*
        setTimeout(() => {
            const suggestions = getMatchingLanguages(value);

            if (value === this.state.value) {
                this.setState({
                    isLoading: false,
                    suggestions
                });
            } else { // Ignore suggestions if input value changed
                this.setState({
                    isLoading: false
                });
            }
        }, randomDelay());
*/
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
            placeholder: "Type to load suggestions",
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
