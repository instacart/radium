/**
 * The examples provided by Formidable Labs are for non-commercial testing and
 * evaluation purposes only. Formidable Labs reserves all rights not expressly
 * granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FORMIDABLE LABS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Radium from '../../src';

class ComputedWell extends React.Component {
  getInitialState() {
    return {
      dynamicBg: '#000',
    };
  }

  getStyles() {
    return {
      padding: '1em',
      borderRadius: 5,
      background: this.state.dynamicBg,
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();

    this.setState({
      dynamicBg: ReactDOM.findDOMNode(this.refs.input).value,
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} style={this.getStyles()}>
        <input placeholder="black" ref="input" type="text" />

        <button>Change Background Color</button>
      </form>
    );
  }
}

export default Radium(ComputedWell);
