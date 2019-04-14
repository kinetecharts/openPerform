import { Row, Col } from 'reactstrap';
import * as d3 from 'd3';
import LineChart from './LineChart';

require('./charts.css');

class Charts extends React.Component {
  constructor(props) {
    super(props);
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
    // console.log(this.props.audience);
    if (this.props.audience.length == 0) {
      return ( <Row>
          <Row id="typesRow">
            <Col md={12}>
              <div className={'chartContainer'}>
                <div id="empty-chart-title" className='row-title'>Nothing to chart.</div>
              </div>
            </Col>
          </Row>
        </Row>);
    }
    return (
      <Row id="chartsRow">
        <LineChart title={"Audience Engagement"} groups={[
              {name:'Looking', key:'looking', color:'#cc2222'}
          ]} data={this.props.audience}
          colorScale={d3.scaleSequential(d3.interpolateSpectral)}/>
      </Row>
    );
  }
}

module.exports = Charts;
