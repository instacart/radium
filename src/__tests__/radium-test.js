/* eslint-disable react/prop-types */

import Radium from 'index';
import React, {Component} from 'react';
import MouseUpListener from 'plugins/mouse-up-listener';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import {getElement, getElements, renderFcIntoDocument} from 'test-helpers';

describe('Radium blackbox tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('merges styles', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return <div style={[{color: 'blue'}, {background: 'red'}]} />;
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
  });

  it('merges nested styles', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div
            style={[
              [{color: 'blue'}, [{height: '2px', padding: '9px'}]],
              {background: 'red'},
            ]}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
    expect(div.style.height).to.equal('2px');
    expect(div.style.padding).to.equal('9px');
  });

  it('merges nested styles in function components', () => {
    const TestComponent = Radium(() => (
      <div
        style={[
          [{color: 'blue'}, [{height: '2px', padding: '9px'}]],
          {background: 'red'},
        ]}
      />
    ));

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
    expect(div.style.height).to.equal('2px');
    expect(div.style.padding).to.equal('9px');
  });

  it('merges nested styles in memo components', () => {
    const TestComponent = Radium(
      React.memo(() => (
        <div
          style={[
            [{color: 'blue'}, [{height: '2px', padding: '9px'}]],
            {background: 'red'},
          ]}
        />
      ))
    );

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
    expect(div.style.height).to.equal('2px');
    expect(div.style.padding).to.equal('9px');
  });

  it('merges nested styles and forwards ref in function components with forwardRef', () => {
    const TestComponent = Radium(
      React.forwardRef((props, ref) => (
        <div
          ref={ref}
          style={[
            [{color: 'blue'}, [{height: '2px', padding: '9px'}]],
            {background: 'red'},
          ]}
        />
      ))
    );

    const testRef = React.createRef();
    const output = renderFcIntoDocument(<TestComponent ref={testRef} />);
    const div = getElement(output, 'div');

    expect(testRef.current).to.equal(div);
    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
    expect(div.style.height).to.equal('2px');
    expect(div.style.padding).to.equal('9px');
  });

  it('resolves styles on props', () => {
    class InnerComponent extends Component {
      render() {
        return this.props.header;
      }
    }

    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <InnerComponent
            header={<div style={[{color: 'blue'}, {background: 'red'}]} />}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
  });

  it('resolves styles on props', () => {
    class InnerComponent extends Component {
      render() {
        return this.props.stuff;
      }
    }

    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <InnerComponent
            stuff={
              <div
                style={[
                  {color: 'blue'},
                  {background: 'red', ':active': {color: 'green'}},
                ]}
              />
            }
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);

    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');

    TestUtils.Simulate.mouseDown(div);

    expect(div.style.color).to.equal('green');
  });

  it('resolves styles on functions', () => {
    class InnerComponent extends Component {
      render() {
        return this.props.children('arg');
      }
    }

    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <InnerComponent>
            {(arg) => (
              <div
                style={[
                  {color: 'blue'},
                  {background: 'red', ':active': {color: 'green'}},
                ]}
              >
                {arg}
              </div>
            )}
          </InnerComponent>
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);

    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
    expect(div.textContent).to.equal('arg');

    TestUtils.Simulate.mouseDown(div);

    expect(div.style.color).to.equal('green');
  });

  it('adds hover styles', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div
            style={{
              background: 'red',
              color: 'blue',
              ':hover': {color: 'green'},
            }}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);

    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');

    TestUtils.SimulateNative.mouseOver(div);

    expect(div.style.color).to.equal('green');
  });

  it('adds active styles', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div
            style={{
              background: 'red',
              color: 'blue',
              ':active': {color: 'green'},
            }}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);

    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');

    TestUtils.Simulate.mouseDown(div);

    expect(div.style.color).to.equal('green');
  });

  it('removes active styles on mouseup', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div>
            <span
              key="a"
              style={{
                background: 'red',
                color: 'blue',
                ':active': {color: 'green'},
              }}
            />
            <button
              key="b"
              style={{
                background: 'red',
                color: 'blue',
                ':active': {color: 'green'},
              }}
            />
            <nav
              key="c"
              style={{
                background: 'red',
                color: 'blue',
                ':active': {color: 'green'},
              }}
            />
          </div>
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);

    const span = getElement(output, 'span');
    const button = getElement(output, 'button');
    const nav = getElement(output, 'nav');

    expect(span.style.color).to.equal('blue');
    expect(button.style.color).to.equal('blue');
    expect(nav.style.color).to.equal('blue');

    TestUtils.Simulate.mouseDown(span);
    expect(span.style.color).to.equal('green');
    MouseUpListener.__triggerForTests();
    expect(span.style.color).to.equal('blue');

    TestUtils.Simulate.mouseDown(button);
    expect(button.style.color).to.equal('green');
    MouseUpListener.__triggerForTests();
    expect(button.style.color).to.equal('blue');

    TestUtils.Simulate.mouseDown(nav);
    expect(nav.style.color).to.equal('green');
    MouseUpListener.__triggerForTests();
    expect(nav.style.color).to.equal('blue');
  });

  it('passes snapshot to the componentDidUpdate of the component, Issue #985', () => {
    const SNAPSHOT = 'SNAPSHOT';

    class SnapshotComp extends Component {
      componentDidMount() {
        this.forceUpdate();
      }

      getSnapshotBeforeUpdate() {
        return SNAPSHOT;
      }

      componentDidUpdate(props, state, snapshot) {
        expect(snapshot).to.equal(SNAPSHOT);
      }

      render() {
        return null;
      }
    }

    sinon.spy(SnapshotComp.prototype, 'componentDidUpdate');

    const TestComponent = Radium(SnapshotComp);

    renderFcIntoDocument(<TestComponent />);

    expect(SnapshotComp.prototype.componentDidUpdate).to.have.been.calledOnce;
  });

  it('resets state for unmounted components, Issue #524', () => {
    class TestComponent extends Component {
      state = {showSpan: true};
      render() {
        return (
          <div>
            <button onClick={() => this.setState({showSpan: true})} />
            {this.state.showSpan && (
              <span
                key="s"
                onClick={() => this.setState({showSpan: false})}
                style={{
                  color: 'blue',
                  ':hover': {color: 'red'},
                }}
              />
            )}
          </div>
        );
      }
    }
    const WrappedTestComponent = Radium(TestComponent);

    const output = renderFcIntoDocument(<WrappedTestComponent />);

    let spans = getElements(output, 'span');
    const button = getElement(output, 'button');
    expect(spans[0].style.color).to.equal('blue');

    TestUtils.Simulate.mouseEnter(spans[0]);
    expect(spans[0].style.color).to.equal('red');

    TestUtils.Simulate.click(spans[0]);
    spans = getElements(output, 'span');
    expect(spans).to.have.length(0);

    TestUtils.Simulate.click(button);
    spans = getElements(output, 'span');
    expect(spans).to.have.length(1);
    expect(spans[0].style.color).to.equal('blue');
  });

  it('resolves styles on multiple elements nested far down, Issue #307', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <section>
            <section>
              <section>
                <header
                  key="header"
                  style={{
                    color: 'yellow',
                    ':hover': {color: 'blue'},
                  }}
                />
                <footer
                  key="footer"
                  style={{
                    color: 'green',
                    ':hover': {color: 'red'},
                  }}
                />
              </section>
            </section>
          </section>
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);

    const header = getElement(output, 'header');
    expect(header.style.color).to.equal('yellow');

    const footer = getElement(output, 'footer');
    expect(footer.style.color).to.equal('green');

    TestUtils.SimulateNative.mouseOver(header);
    TestUtils.SimulateNative.mouseOver(footer);

    expect(header.style.color).to.equal('blue');
    expect(footer.style.color).to.equal('red');
  });

  it('resolves styles if an element has element children', () => {
    @Radium
    class Inner extends Component {
      static propTypes = {children: PropTypes.node};
      render() {
        return (
          <div style={[{color: 'blue'}, {background: 'red'}]}>
            {this.props.children}
          </div>
        );
      }
    }

    @Radium
    class Outer extends Component {
      render() {
        return (
          <Inner>
            <span>We will break you.</span>
          </Inner>
        );
      }
    }

    const output = renderFcIntoDocument(<Outer />);

    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');
  });

  it('calls toString on object values', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div
            style={{
              background: {toString: () => 'red'},
            }}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');

    expect(div.style.background).to.equal('red');
  });

  it('accepts a config', () => {
    const truthyMatchMedia = function () {
      return {
        matches: true,
        addListener: function () {},
        removeListener: function () {},
      };
    };

    @Radium({
      matchMedia: truthyMatchMedia,
    })
    class TestComponent extends Component {
      render() {
        return (
          <div
            style={{
              '@media (min-width: 600px)': {':hover': {color: 'blue'}},
            }}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');
    TestUtils.SimulateNative.mouseOver(div);

    expect(div.style.color).to.equal('blue');
  });

  // this doesn't seem to actually work...
  // https://github.com/FormidableLabs/radium/issues/862#issuecomment-340953580
  xit('transforms fallback values', () => {
    @Radium()
    class TestComponent extends Component {
      render() {
        return (
          <div
            style={{
              height: ['100%', '100vh'],
            }}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');

    expect({...div.style}).to.include({
      height: '100%;height:100vh',
    });
  });

  it('adds active styles on space', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div
            style={{
              background: 'red',
              color: 'blue',
              ':active': {color: 'green'},
            }}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);

    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.style.background).to.equal('red');

    TestUtils.SimulateNative.keyDown(div, {key: ' '});

    expect(div.style.color).to.equal('green');

    TestUtils.SimulateNative.keyUp(div, {key: ' '});

    expect(div.style.color).to.equal('blue');
  });

  it('works with children as keyed object ala React Router', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div>
            {this.props.children.nav}
            {this.props.children.main}
          </div>
        );
      }
    }

    const output = renderFcIntoDocument(
      <TestComponent>
        {{
          nav: <nav>nav</nav>,
          main: <main>main</main>,
        }}
      </TestComponent>
    );

    const nav = getElement(output, 'nav');
    expect(nav.innerText).to.equal('nav');

    const main = getElement(output, 'main');
    expect(main.innerText).to.equal('main');
  });

  it('preserves array children as arrays', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        expect(Array.isArray(this.props.children)).to.equal(true);
        return <div>{this.props.children}</div>;
      }
    }

    const output = renderFcIntoDocument(
      <TestComponent>
        {[<nav key="nav">nav</nav>, <main key="main">main</main>]}
      </TestComponent>
    );

    const nav = getElement(output, 'nav');
    expect(nav.innerText).to.equal('nav');

    const main = getElement(output, 'main');
    expect(main.innerText).to.equal('main');
  });

  it('calls existing onMouseEnter handler', () => {
    const handleMouseEnter = sinon.spy();

    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div
            onMouseEnter={handleMouseEnter}
            style={{':hover': {color: 'red'}}}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');
    TestUtils.SimulateNative.mouseOver(div);

    expect(handleMouseEnter).to.have.been.called;
  });

  it('calls existing onMouseLeave handler', () => {
    const handleMouseLeave = sinon.spy();

    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div
            onMouseLeave={handleMouseLeave}
            style={{':hover': {color: 'red'}}}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');
    TestUtils.SimulateNative.mouseOut(div);

    expect(handleMouseLeave).to.have.been.called;
  });

  it('calls existing onMouseDown handler', () => {
    const handleMouseDown = sinon.spy();

    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div
            onMouseDown={handleMouseDown}
            style={{':active': {color: 'red'}}}
          />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');
    TestUtils.SimulateNative.mouseDown(div);

    expect(handleMouseDown).to.have.been.called;
  });

  it('calls existing onFocus handler', () => {
    const handleFocus = sinon.spy();

    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <input onFocus={handleFocus} style={{':focus': {color: 'red'}}} />
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const input = getElement(output, 'input');
    TestUtils.SimulateNative.focus(input);

    expect(handleFocus).to.have.been.called;
  });

  it('calls existing onBlur handler', () => {
    const handleBlur = sinon.spy();

    @Radium
    class TestComponent extends Component {
      render() {
        return <input onBlur={handleBlur} style={{':focus': {color: 'red'}}} />;
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const input = getElement(output, 'input');
    TestUtils.SimulateNative.blur(input);

    expect(handleBlur).to.have.been.called;
  });

  it('ignores callback refs', () => {
    @Radium
    class TestComponent extends Component {
      render() {
        return (
          <div>
            <span key="a" ref={() => {}} style={{':hover': {color: 'red'}}} />
            <nav key="b" ref={() => {}} style={{':hover': {color: 'red'}}} />
          </div>
        );
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);
    const span = getElement(output, 'span');
    const nav = getElement(output, 'nav');

    TestUtils.SimulateNative.mouseOver(span);
    expect(span.style.color).to.equal('red');
    expect(nav.style.color).to.equal('');

    TestUtils.SimulateNative.mouseOver(nav);
    expect(nav.style.color).to.equal('red');
  });

  describe('plugins', () => {
    it('runs a custom plugin', () => {
      const makeItRedPlugin = () => ({style: {color: 'red'}});

      @Radium
      class TestComponent extends Component {
        render() {
          return <div style={{}} />;
        }
      }

      const output = renderFcIntoDocument(
        <TestComponent radiumConfig={{plugins: [makeItRedPlugin]}} />
      );
      const div = getElement(output, 'div');

      expect(div.style.color).to.equal('red');
    });
  });

  /* eslint-disable no-console */
  it("doesn't try to setState if not mounted", () => {
    sinon.stub(console, 'error');
    sinon.stub(console, 'warn');

    let setStateCaptured;
    const plugin = function ({setState}) {
      setStateCaptured = setState;
    };

    @Radium({plugins: [plugin]})
    class TestComponent extends Component {
      render() {
        return <div style={{color: 'blue'}} />;
      }
    }

    const output = renderFcIntoDocument(<TestComponent />);

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(output).parentNode);

    setStateCaptured('whatever');

    expect(console.error).not.to.have.been.called;
    expect(console.warn).not.to.have.been.called;
  });
  /* eslint-enable no-console */

  it('works with stateless components', () => {
    let MyStatelessComponent = (props) => (
      <div style={{color: 'blue', ':hover': {color: 'red'}}}>
        {props.children}
      </div>
    );

    // Babel is forced to use regular functions when defining arrow functions.
    // Arrow functions should not technically have prototypes,
    // so remove it here to make sure Radium doesn't fail with real arrow functions.
    MyStatelessComponent.prototype = undefined;
    MyStatelessComponent = Radium(MyStatelessComponent);

    const output = renderFcIntoDocument(
      <MyStatelessComponent>hello world</MyStatelessComponent>
    );
    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.innerText).to.equal('hello world');

    TestUtils.SimulateNative.mouseOver(div);

    expect(div.style.color).to.equal('red');
  });

  // Regression test: https://github.com/FormidableLabs/radium/issues/738
  it('works with arrow-based render methods in components', () => {
    class TestComponent extends Component {
      render = () => {
        return (
          <div style={{color: 'blue', ':hover': {color: 'red'}}}>
            {this.props.children}
          </div>
        );
      };
    }

    const Wrapped = Radium(TestComponent);
    const output = renderFcIntoDocument(<Wrapped>hello world</Wrapped>);

    // Check prototype is not mutated.
    expect(TestComponent.prototype).to.not.have.property('render');

    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.innerText).to.equal('hello world');

    TestUtils.SimulateNative.mouseOver(div);

    expect(div.style.color).to.equal('red');
  });

  // Regression test: https://github.com/FormidableLabs/radium/issues/738
  it('works with arrow-based render methods in components with complex inheritence', () => {
    class First extends Component {}
    class Second extends First {}
    class TestComponent extends Second {
      render = () => {
        return (
          <div style={{color: 'blue', ':hover': {color: 'red'}}}>
            {this.props.children}
          </div>
        );
      };
    }

    const Wrapped = Radium(TestComponent);
    const output = renderFcIntoDocument(<Wrapped>hello world</Wrapped>);

    // Check prototypes are not mutated.
    expect(First.prototype).to.not.have.property('render');
    expect(Second.prototype).to.not.have.property('render');
    expect(TestComponent.prototype).to.not.have.property('render');

    const div = getElement(output, 'div');

    expect(div.style.color).to.equal('blue');
    expect(div.innerText).to.equal('hello world');

    TestUtils.SimulateNative.mouseOver(div);

    expect(div.style.color).to.equal('red');
  });

  // Regression test: https://github.com/FormidableLabs/radium/issues/950
  it('works with array children', () => {
    class TestComponent extends Component {
      render = () => {
        return [
          <div key="key0" style={{color: 'blue', ':hover': {color: 'red'}}}>
            {this.props.children}
          </div>,
          <div key="key1" style={{color: 'yellow', ':hover': {color: 'green'}}}>
            two
          </div>,
        ];
      };
    }

    const Wrapped = Radium(TestComponent);
    const output = renderFcIntoDocument(<Wrapped>hello world</Wrapped>);

    const divs = getElements(output, 'div');

    expect(divs[0].style.color).to.equal('blue');
    expect(divs[0].getAttribute('data-radium')).to.equal('true');
    expect(divs[0].innerText).to.equal('hello world');
    TestUtils.SimulateNative.mouseOver(divs[0]);
    expect(divs[0].style.color).to.equal('red');

    expect(divs[1].style.color).to.equal('yellow');
    expect(divs[1].innerText).to.equal('two');
    TestUtils.SimulateNative.mouseOver(divs[1]);
    expect(divs[1].style.color).to.equal('green');
  });

  it('works with Fragments', () => {
    class TestComponent extends Component {
      render = () => {
        return (
          <React.Fragment>
            <div key="key0" style={{color: 'blue', ':hover': {color: 'red'}}}>
              {this.props.children}
            </div>
            <div
              key="key1"
              style={{color: 'yellow', ':hover': {color: 'green'}}}
            >
              two
            </div>
          </React.Fragment>
        );
      };
    }

    const Wrapped = Radium(TestComponent);
    const output = renderFcIntoDocument(<Wrapped>hello world</Wrapped>);

    const divs = getElements(output, 'div');

    expect(divs[0].style.color).to.equal('blue');
    expect(divs[0].getAttribute('data-radium')).to.equal('true');
    expect(divs[0].innerText).to.equal('hello world');
    TestUtils.SimulateNative.mouseOver(divs[0]);
    expect(divs[0].style.color).to.equal('red');

    expect(divs[1].style.color).to.equal('yellow');
    expect(divs[1].innerText).to.equal('two');
    TestUtils.SimulateNative.mouseOver(divs[1]);
    expect(divs[1].style.color).to.equal('green');
  });

  it('works fine if passing null, undefined, or false in style', () => {
    const TestComponent = Radium(() => (
      <div style={{background: undefined, border: false, color: null}} />
    ));
    const output = renderFcIntoDocument(<TestComponent />);
    const div = getElement(output, 'div');

    expect(div.style.background).to.equal('');
    expect(div.style.border).to.equal('');
    expect(div.style.color).to.equal('');
  });

  it('transfers defaultProps for stateless components', () => {
    const defaultProps = {foo: PropTypes.string};

    let MyStatelessComponent = () => <div />;
    MyStatelessComponent.defaultProps = defaultProps;
    MyStatelessComponent = Radium(MyStatelessComponent);

    expect(MyStatelessComponent.defaultProps).to.equal(defaultProps);
  });

  /* eslint-disable no-console */
  it('replaces style propType with array or object', () => {
    sinon.stub(console, 'error');
    sinon.stub(console, 'warn');

    class TestComponent extends Component {
      render() {
        return <div style={this.props.style} />;
      }
    }
    TestComponent.propTypes = {style: PropTypes.object};
    TestComponent = Radium(TestComponent);

    renderFcIntoDocument(<TestComponent style={[]} />);

    expect(console.error).not.to.have.been.called;
    expect(console.warn).not.to.have.been.called;
  });
  /* eslint-enable no-console */

  describe('config', () => {
    it('receives config from radiumConfig prop', () => {
      const plugin = sinon.spy();

      @Radium
      class TestComponent extends Component {
        render() {
          return <div style={{}} />;
        }
      }

      renderFcIntoDocument(
        <TestComponent radiumConfig={{plugins: [plugin]}} />
      );

      expect(plugin).to.have.been.called;
    });

    it('receives config from context', () => {
      const plugin = sinon.spy();

      @Radium
      class ParentComponent extends Component {
        render() {
          return (
            <div style={{}}>
              <ChildComponent />
            </div>
          );
        }
      }

      @Radium
      class ChildComponent extends Component {
        render() {
          return <div style={{}} />;
        }
      }

      renderFcIntoDocument(
        <ParentComponent radiumConfig={{plugins: [plugin]}} />
      );

      expect(plugin).to.have.callCount(2);
    });
  });

  describe('inline prefixes', () => {
    let TestComponent;

    beforeEach(() => {
      class Composed extends Component {
        render() {
          return React.createElement('div', {
            style: {
              color: 'red',
              display: 'flex',
            },
          });
        }
      }

      TestComponent = Composed;
    });

    // Regression test: https://github.com/FormidableLabs/radium/issues/958
    it('handles no user agent', () => {
      const userAgent = '';
      const Wrapped = Radium({userAgent})(TestComponent);
      const output = renderFcIntoDocument(<Wrapped />);
      const div = getElement(output, 'div');

      expect(div.style.color).to.equal('red');
      expect(div.style.display).to.equal('flex');
    });

    // Regression test: https://github.com/FormidableLabs/radium/issues/958s
    it('handles non-matching user agent', () => {
      const userAgent = 'testy-mctestface';
      const Wrapped = Radium({userAgent})(TestComponent);
      const output = renderFcIntoDocument(<Wrapped />);
      const div = getElement(output, 'div');

      expect(div.style.color).to.equal('red');
      expect(div.style.display).to.equal('flex');
    });

    it('handles matching user agent', () => {
      const iOSChrome47 =
        'Mozilla/5.0 (iPad; CPU OS 8_0_0 like Mac OS X) AppleWebKit/600.1.4 ' +
        '(KHTML, like Gecko) CriOS/47.0.2526.107 Mobile/12H321 Safari/600.1.4';
      const webkitFlex = '-webkit-flex';

      // Check if we _can_ even have the expected value. (Can't on IE9).
      class FlexCanary extends Component {
        render() {
          return React.createElement('div', {
            style: {
              display: webkitFlex,
            },
          });
        }
      }
      const canary = renderFcIntoDocument(<FlexCanary />);
      const expectedDisplay = getElement(canary, 'div').style.display;

      const Wrapped = Radium({userAgent: iOSChrome47})(TestComponent);
      const output = renderFcIntoDocument(<Wrapped />);
      const div = getElement(output, 'div');

      expect(div.style.color).to.equal('red');
      expect(div.style.display).to.equal(expectedDisplay);
    });
  });
});
