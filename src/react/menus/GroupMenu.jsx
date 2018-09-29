/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-27 10:07:30
 * @modify date 2018-09-05 04:30:09
 * @desc [description]
*/


import ReactDom from 'react-dom';
import Select from 'react-select';

import Icon from 'react-fa';

import { Panel, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import 'react-select/dist/react-select.css';

class GroupMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      forceUpdate: false,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.forceUpdate === true) {
      this.setState({ forceUpdate: false });
      return true;
    }

    if (this.props && this.state) {
      if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
        this.props = nextProps;
        return true;
      }
      return false;
    }
    return false;
  }

  render() {
    if (this.props.performers.length < 1) {
      return false;
    }
    console.log(this.props.performers.getCloneGroups());
    console.log(this.props.performers.getPerformers());
    return (
      <Panel className="groupMenu" /* defaultExpanded */>
        <Panel.Heading>
          <Panel.Title toggle><h5>Groups</h5></Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <ButtonToolbar>
              <ButtonGroup>
                {/* <Button onClick={() => { this.props.cannonizeById(0, 1); }}></Button>
                <Button onClick={() => { this.props.setCannonById(0, 1); }}></Button> */}
                <Button onClick={() => { this.props.delayClonesById(0, 0.25); }}>Delay</Button>
                <Button onClick={() => { this.props.scaleClonesById(0, 0.001); }}>Scale</Button>
                <Button onClick={() => { this.props.rotateClonesById(0, 1); }}>Rotate</Button>
                <Button onClick={() => { this.props.spreadClonesById(0, 0.5); }}>Spread</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = GroupMenu;
