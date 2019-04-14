import dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter';
import moment, { max } from 'moment';

import ErrorBounder from '../../util/ErrorBounder';

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forceUpdate: this.props.active ? true : false,
      title: this.props.title,
      chart: null,
      dim: null,
      dimGroup: null,
      uid: this.generateUid(),
      dimensions: {
        width: 0,
        height: 0,
      },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      range: 'all',
    };
  }

  componentDidMount() {
    this.updateDims();
    this.plotChart();
    this.resizeChart();
    // $('#line-chart-' + this.state.uid).animate({ opacity: '1.0' }, 1000);
    window.addEventListener('resize', this.resizeChart.bind(this));
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

  componentDidUpdate() {
    this.clearStacks();
    this.clearFilter();
    this.resizeChart();
    this.updateDims();
    this.plotChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart);
  }

  clearStacks() {
    this.state.chart.resetSvg();
  }

  clearFilter() {
    if (this.state.dim !== null) {
      this.state.dim.dispose();
    }
  }

  resizeChart() {
    // get width / height of parent container
    let w = $('.tab-content').width();
    if (w < 0) { w = 0; }
    let h = $('#linesRow').height() - 15;
    if (h < 0) { h = 0; }

    this.setState({
      dimensions: {
        width: w,
        height: h,
      },
    });

    this.plotChart();
  }

  updateDims() {
    let parsedData = [];
    let dateFormatSpecifier = '%m/%d/%Y';
    
    let data = _.clone(this.props.data);
    // if (data.length == 1) {
    //   let newData = _.clone(data[0]);
    //   newData.date = new Date(newData.date).setMinutes(new Date(newData.date).getMinutes() + 1);
    //   data.push(newData);
    // }
    _.each(data, (d) => {
      _.each(['audience', 'looking'], (cat) => {
        // console.log(d);
        parsedData.push({
          title: cat,
          cat: cat,
          value: d[cat],
          date: new Date(d.time * 1000),
          day: d3.timeDay(new Date(d.time * 1000)),
          week: d3.timeWeek(new Date(d.time * 1000)),
          month: d3.timeMonth(new Date(d.time * 1000)),
          year: d3.timeYear(new Date(d.time * 1000)),
          seconds: d3.timeSecond(new Date(d.time * 1000)),
        });
      });
    });

    const allCats = ['audience', 'looking'];/*_.flatten(_.map(data, (d) => {
      return d.categories;
    }));*/

    this.state.countedCats = _.countBy(allCats);

    this.state.sortedCats = Object.keys(this.state.countedCats)
      .sort((i, j) => this.state.countedCats[j] - this.state.countedCats[i])
      .map(key => ({ key, value: this.state.countedCats[key] }));
    this.state.cats = _.map(this.state.sortedCats, 'key');
    

    this.state.monthDim = crossfilter(parsedData).dimension((d) => {
      return d.month;
    });

    this.state.weekDim = crossfilter(parsedData).dimension((d) => {
      return d.week;
    });

    this.state.dayDim = crossfilter(parsedData).dimension((d) => {
      return d.day;
    });

    this.state.hourDim = crossfilter(parsedData).dimension((d) => {
      return d.date;
    });

    this.state.secondsDim = crossfilter(parsedData).dimension((d) => {
      return d.seconds;
    });

    this.state.dim = this.state.secondsDim;
  
    this.state.range = 'default';
    
    // var years = moment(this.state.dim.top(1)[0].date).diff(moment(this.state.dim.bottom(1)[0].date), 'years');
    // var months = moment(this.state.dim.top(1)[0].date).diff(moment(this.state.dim.bottom(1)[0].date), 'months');
    // var weeks = moment(this.state.dim.top(1)[0].date).diff(moment(this.state.dim.bottom(1)[0].date), 'weeks');
    // var days = moment(this.state.dim.top(1)[0].date).diff(moment(this.state.dim.bottom(1)[0].date), 'days');
    // var hours = moment(this.state.dim.top(1)[0].date).diff(moment(this.state.dim.bottom(1)[0].date), 'hours');
    // var seconds = moment(this.state.dim.top(1)[0].date).diff(moment(this.state.dim.bottom(1)[0].date), 'seconds');

    // if (months < 12 * 1) {
    //   this.state.range = 'year';
    //   this.state.dim = this.state.dayDim;
    //   // within the 6 months
    //   if (months < 6 * 1) {
    //     this.state.range = 'halfyear';
    //     this.state.dim = this.state.dayDim;
    //     // within the same month
    //     if (months < 1) {
    //       this.state.range = 'month';
    //       this.state.dim = this.state.dayDim;
    //       if (weeks < 1) {
    //         this.state.range = 'week';
    //         this.state.dim = this.state.hourDim;
    //         // within the same day
    //         if (days < 1) {
    //           this.state.range = 'day';
    //           this.state.dim = this.state.hourDim;
    //           if (hours <= 1) {
    //             this.state.range = 'hour';
    //             this.state.dim = this.state.hourDim;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    // if (
    //   (this.props.value == ''
    //   && this.props.type == 'search')
    //   || (this.props.value == 'all'
    //   && this.props.type == 'all')
    // ) {
      this.state.range = 'second';
      this.state.dim = this.state.secondsDim;
    // }

    // this.state.dimGroup = this.state.dim.group().reduceSum((d) => {
    //   console.log(d);
    // })
      
    // // count instances of each category
    this.state.dimGroup = this.state.dim.group().reduce(
      this.reduceAdd.bind(this),
      this.reduceRemove.bind(this),
      this.reduceInitial.bind(),
    );
    
    // console.log(this.state.dimGroup);
  }

  plotChart() {
    if (!this.state.dim) {
      return false;
    }

    // $('.dc-legend').each(function() {
    //   $(this).css('opacity', '1');
    // });
    
    let maxDate = new Date();
    let minDate = new Date();

    // prevent size == 0;
    // if (this.state.dim.top(1).length == 0) {
    //   return false;
    // }

    maxDate = new Date(this.state.dim.top(1)[0].date);
    minDate = new Date(this.state.dim.bottom(1)[0].date);
    
    this.state.chart = dc.lineChart('#line-chart-' + this.state.uid);
    this.state.chart
      .renderArea(true)
      .margins({
        top: 20,
        right: 0,
        bottom: 13,
        left: (this.state.range == 'all') ? -13 : 0,
      })
      .width(this.state.dimensions.width)
      .height(this.state.dimensions.height)

      .colors(this.props.colorScale)
      .colorDomain ([this.state.cats.length - 1, 0])
      .colorAccessor((d, i) => {
        return i;
      })

      .x(d3.scaleTime().domain([minDate, maxDate]))

      // .elasticX(true)
      .elasticY(true)
      .brushOn(false)

      .transitionDuration(1000)

      .dimension(this.state.dim)

      // .renderHorizontalGridLines(true)
      .legend(dc.legend()
        // .x(15)
        .y(0)
        .gap(15.6)
        .horizontal(true)
        .autoItemWidth(true)
        // .legendWidth(this.state.dimensions.width - 15)
        .legendText((d) => {
          let count = parseInt(this.state.countedCats[d.name]);
          if (this.props.data.length == 1) {
            count--;
          }
          return d.name + ' (' + count + ')';
        }));

    this.state.chart.xAxis().tickFormat(this.processTickText.bind(this));
    this.state.chart.yAxis().ticks(0);

    let ticks = 5;
    // switch(this.state.range) {
    //   case 'hour':
    //     ticks = 1;
    //     break;
    // }

    this.state.chart.xAxis().ticks(ticks);

    this.state.chart.title = () => {};
    this.state.chart.xyTipsOn(false);
    // this.state.chart.onClick = (a) => {
    //   this.props.searchUpdated(a.key, 'categories');
    // };
    this.populateStacks();

    let scope = this;
    // this.state.chart.on('renderlet', (chart) => {
    //   chart.selectAll('.dc-legend-item')
    //     // .on("click", (d) => {
    //     //   this.props.searchUpdated(d.name, 'categories');
    //     // })
    //     .on("mouseover", (data, idx, labels) => {
    //       $('#line-chart-' + scope.state.uid + ' .stack._' + idx + '> path').addClass('highlight');
    //       $(labels[idx]).addClass('highlight');
    //     })
    //     .on("mouseout", (data, idx, labels) => {
    //       $('#line-chart-' + scope.state.uid + ' .stack._' + idx + '> path').removeClass('highlight');
    //       $(labels[idx]).removeClass('highlight');
    //     });
    //   chart.selectAll('path.area')
    //     // .on("click", (d) => {
    //     //   this.props.searchUpdated(d.name, 'categories');
    //     // })
    //     .on("mouseover", (data, idx, labels) => {
    //       $(labels[idx]).addClass('highlight');
    //       $('#line-chart-' + scope.state.uid + ' > svg > g.dc-legend').children().eq(idx).addClass('highlight');
    //     })
    //     .on("mouseout", (data, idx, labels) => {
    //       $(labels[idx]).removeClass('highlight');
    //       $('#line-chart-' + scope.state.uid + ' > svg > g.dc-legend').children().eq(idx).removeClass('highlight');
    //     });
    // });

    this.state.chart.render();
  }

  processTickText(v, idx, labels) {
    let d = new Date(v);
    switch (this.state.range) {
      default:
        if (d.getMonth() == 0) {
          $(labels[idx]).addClass('yearTick');
          return d.getFullYear();
        }
        return this.state.months[d.getMonth()];
      case 'year':
        if (d.getMonth() == 0) {
          $(labels[idx]).addClass('yearTick');
          return d.getFullYear();
        }
        if (d.getDate() == 1) {
          $(labels[idx]).addClass('monthTick');
          // return d.getFullYear();
        }
        return this.state.months[d.getMonth()] + ' ' + d.getDate();
      case 'month':
        if (d.getMonth() == 0) {
          $(labels[idx]).addClass('yearTick');
          return d.getFullYear();
        }
        if (d.getDate() == 1) {
          $(labels[idx]).addClass('monthTick');
          // return d.getFullYear();
        }
        return this.state.months[d.getMonth()] + ' ' + d.getDate();
      case 'default':
        if (d.getMonth() == 0) {
          $(labels[idx]).addClass('yearTick');
          return d.getFullYear();
        }
        return this.state.months[d.getMonth()] + ' ' + d.getDate();
        case 'hour' || 'day':
        if (d.getHours() == 0) {
          $(labels[idx]).addClass('dayTick');
          // return this.state.months[d.getMonth()] + ' ' + d.getDate();
        }

        if (d.getHours() % 12 == 0) {
          $(labels[idx]).addClass('dayTick');
        }

        let ampm = (d.getHours() < 12) ? ' am' : ' pm';
      return (d.getHours() % 12 == 0) ? 12 + ampm : d.getHours() % 12 + ampm;

      case 'second':
        return moment(d).format('MMMM Do YYYY, h:mm:ss a');
    }
  }

  populateStacks() {
    let first = false;
    _.each(this.state.cats, (cat) => {
      if (!first) {
        this.state.chart
          .group(this.state.dimGroup, cat, (d) => {
            return d.value[cat] ? d.value[cat] : 1;
          });
        first = true;
      } else {
        this.state.chart
          .stack(this.state.dimGroup, cat, (d) => {
            return d.value[cat] ? d.value[cat] : 0;
          });
      }
    });
  }

  reduceAdd(p, v) {
    if (p[v.cat.toLowercase] !== undefined) {
      console.log(p[v.cat] , v.value);
      p[v.cat] += v.value;
    } else {
      p[v.cat] = v.value;
    }
    // ++p.all;
    return p;
  }

  reduceRemove(p, v) {
    // console.log(p, v);
    if (p[v.cat] !== undefined) {
      p[v.cat] -= v.value;
    } else {
      p[v.cat] = v.value;
    }
    // --p.all;
    return p;
  }

  reduceInitial() {
    return { /*all: 0*/ };
  }

  generateUid(separator) {
    const delim = separator || '-';
    return (this.S4() + this.S4() + delim + this.S4() + delim + this.S4() + delim + this.S4() + delim + this.S4() + this.S4() + this.S4());
  }

  S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  render() {
    return (
      <ErrorBounder><div className={'chartContainer'}>
        <div id={'line-chart-' + this.state.uid} className='line-chart'></div>
      </div></ErrorBounder>
    );
  }
}

module.exports = LineChart;
