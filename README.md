## Set up Enzyme
1. create react app

`create-react-app wallabyx && cd wallabyx && code .`

2. install dependencies

`npm install --save-dev @types/jest enzyme enzyme-adapter-react-16`

`npm install --save react-markdown`

3. add configuration add a new tile src/setupTests.js

```javascript
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });
```

4. update test in app.test.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {shallow} from 'enzyme'

it("sets the display text after launch", ()=>{
  const wrapper = shallow(<App />)
  expect(wrapper).toBeTruthy()
})
```
5. npm test

## set up wallaby
6. add wallaby.js
```javascript
module.exports = function (wallaby) {

  // Babel, jest-cli and some other modules may be located under
  // react-scripts/node_modules, so need to let node.js know about it
  var path = require('path');
  process.env.NODE_PATH +=
    path.delimiter +
    path.join(__dirname, 'node_modules') +
    path.delimiter +
    path.join(__dirname, 'node_modules/react-scripts/node_modules');
  require('module').Module._initPaths();

  return {
    files: [
      'src/**/*.+(js|jsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      '!src/**/*.test.js?(x)'
    ],

    tests: ['src/**/*.test.js?(x)'],

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel({
        babel: require('babel-core'),
        presets: ['react-app']
      })
    },

    setup: wallaby => {
      const jestConfig = require('react-scripts/scripts/utils/createJestConfig')(p => require.resolve('react-scripts/' + p));
      Object.keys(jestConfig.transform || {}).forEach(k => ~k.indexOf('^.+\\.(js|jsx') && void delete jestConfig.transform[k]);
      delete jestConfig.testEnvironment;
      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: 'jest'
  };
};
```

 
 ### final test
 ```javascript
import React from 'react';
import App from './App';
import { shallow } from 'enzyme';
import Markdown from 'react-markdown';

window.fetch = jest.fn();

describe('<App />', () => {
  it('fetches data and renders', async () => {
    window.fetch = jest.fn(url =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'the cat sat on the mat' })
      })
    );

    const wrapper = shallow(<App />);
    await wrapper.instance().componentDidMount();
    wrapper.update();
    expect(fetch).toBeCalledWith('/get-message');
    expect(wrapper.instance().message).toBe('the cat sat on the mat');
    const markdown = wrapper.find(Markdown); //?
    expect(markdown.props().source).toBe('the cat sat on the mat');
  });

  it('updates markdown on text changed', () => {
    const wrapper = shallow(<App />);
    wrapper.instance().message ='cat1 and cat2 sat on the mat'
    const input = wrapper.find('.input'); //?
    input.simulate('change', { target: { value: 'cat' } });
    const markdown = wrapper.find(Markdown); //?
    expect(markdown.props().source).toBe('**cat**1 and **cat**2 sat on the mat');
  });
});
```

and code 

```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Markdown from 'react-markdown';

class App extends Component {
  state = { markdown: '' };
  message = '';

  async componentDidMount() {
    const messageResult = await fetch('/get-message'); //?
    const messageJson = await messageResult.json(); //?
    this.message = messageJson.message; //?
    this.setState({ markdown: this.message });
  }

  textChange = e => {
    const {value} = e.target 
    if(value.length > 0) {
      const pattern = new RegExp(value,'gi');
      const markdown = this.message.replace(pattern, `**${value}**`) //?
      this.setState({markdown})
    }
  }

  render() {
    return (
      <div className="App">
        <input className="input" onChange={this.textChange}/>
        <Markdown source={this.state.markdown} />
      </div>
    );
  }
}

export default App;

```