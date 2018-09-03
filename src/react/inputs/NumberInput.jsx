import 'rc-input-number/assets/index.css';
import InputNumber from 'rc-input-number';

import ReactDOM from 'react-dom';

class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  render() {
    return (
      <InputNumber
        onChange={this.props.onChange}
        value={this.props.value}
        min={this.props.min}
        max={this.props.max}
        style={{ width: '100%' }}
      />
    );
  }
}

module.exports = NumberInput;
