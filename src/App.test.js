import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';
import Markdown from 'react-markdown';

window.fetch = jest.fn(url =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'the cat sat on the mat' })
  })
);

describe('<App />', () => {
  it('sets the display text after launch', () => {
    const wrapper = shallow(<App />);
    expect(wrapper).toBeTruthy();
  });

  it("it fetches and renders", async ()=>{

    const wrapper = shallow(<App />);
    await wrapper.instance().componentDidMount() 
    wrapper.update()
    expect(fetch).toBeCalledWith("/get-message")
    const markdown = wrapper.find(Markdown) //?
    
    expect(markdown.props().source).toBe('the cat sat on the mat')
  })

  it("updates on text change", ()=>{
    const wrapper = shallow(<App />);
    wrapper.instance().originalMessage = 'the cat sat on the mat'
    const input = wrapper.find('.search-input') //?
    input.simulate('change', {target:{value: 'cat'}})
    const markdown = wrapper.find(Markdown)
    expect(markdown.props().source).toBe('the **cat** sat on the mat')


  })

});
