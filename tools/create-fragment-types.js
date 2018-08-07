const fetch = require('node-fetch');
const fs = require('fs');

/* @see https://www.apollographql.com/docs/react/recipes/fragment-matching.html **/
const host = 'http://34.197.143.104:8299';
fetch(`${host}/graphql`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
    }),
}).then(result => result.json())
    .then(result => {
        // here we're filtering out any type information unrelated to unions or interfaces
        const filteredData = result.data.__schema.types.filter(
            type => type.possibleTypes !== null
        );
        result.data.__schema.types = filteredData;
        fs.writeFile('./fragmentTypes.json', JSON.stringify(result.data), err => {
            if (err) console.error('Error writing fragmentTypes file', err);
            console.log('Fragment types successfully extracted!');
        });
    });
