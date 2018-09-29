/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 12:38:48
 * @modify date 2018-08-31 12:38:48
 * @desc [Menu to switch between different render effects.]
*/

import { Panel, DropdownButton, MenuItem, ListGroup, ListGroupItem } from 'react-bootstrap';
import Icon from 'react-fa';

import 'react-select/dist/react-select.css';

import Common from '../../util/Common';

// import EnvironmentStyles from './../styles/EnvironmentStyles';

class RenderStyleMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      // playing: false,
      // looping: true,
      // forceUpdate: false,
      // currentEnvironment: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.forceUpdate == true) {
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

  updateRenderStyle(val) {
    this.setState({ forceUpdate: true });
    this.props.updateRenderStyle(val);
  }

  render() {
    if (this.props.renderStyles == null || this.props.renderStyles.length == 0) {
      return false;
    }
    
    return (
      <Panel className="renderStyleMenu" /* defaultExpanded */>
        <Panel.Heading>
					<Panel.Title toggle><h5>Render Style</h5></Panel.Title>
				</Panel.Heading>
        <Panel.Collapse>
						<Panel.Body>
              <ListGroup>
                <ListGroupItem id="render-style-dropdown">
                  <DropdownButton
                    dropup
                    bsStyle="default"
                    bsSize="xsmall"
                    title={"Change Style"}
                    name="renderStyleSelect"
                    id="renderStyle-dropdown"
                    onSelect={this.updateRenderStyle.bind(this)}
                    >
                    {_.map(this.props.availRenderStyles, (renderStyle, idx) => {
                      return (<MenuItem key={idx} eventKey={idx}>{renderStyle}</MenuItem>);
                    })}
                  </DropdownButton>
                </ListGroupItem>
                <ListGroupItem>
                  <table id="renderStyleTable">
                  <thead>
                    <tr>
                      <th>Style</th>
                      <th>Settings</th>
                    </tr>
                  </thead>
                  <tbody>{
                    (this.props.renderStyles.getRenderStyles().length < 1) ?
                      <tr>
                        <td title="Style"><span>Normal</span></td>
                        <td title="Edit Settings"><Icon name="cog" className="disabled-icon"/></td>
                      </tr> :
                      _.map(this.props.renderStyles.getRenderStyles(), (renderStyle, idx) => (
                        <tr key={idx}>
                          <td title="Style"><span style={{ color: renderStyle.color }}>{renderStyle.name}</span></td>
                          <td title="Edit Settings">
                            {renderStyle.getGUI()}
                          </td>
                      </tr>))
                  }</tbody></table>
                </ListGroupItem>
              </ListGroup>
						</Panel.Body>
					</Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = RenderStyleMenu;
