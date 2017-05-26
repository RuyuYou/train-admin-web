import {Component} from 'react';
import superagent from 'superagent';
import noCache from 'superagent-no-cache';

class ErrorTip extends Component {
  render() {
    return (
      <span className="error-tip">{this.props.error}</span>
    )
  }
}

const tabsConfiguration = [
  {value: '新增'},
  {value: '修改'}
];


export default class SleeperEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      trainIdError: '',
      positionError: '',
      priceError: '',
      type: 'soft'
    };
  }

  receivePropsData(currentTicker) {
    const item = currentTicker.currentTicker;
    this.trainId.value = item.trainId;
    this.position.value = item.position;
    this.price.value = item.price;
  }

  componentWillReceiveProps(next) {
    if (next.currentTicker.trainId) {
      this.receivePropsData(next);
      if (next.currentTicker.type == '软卧') {
        this.setState({
          activeIndex: 1,
          updateFormEnable: true,
          type: 'soft'
        });
      } else {
        this.setState({
          activeIndex: 1,
          updateFormEnable: true,
          type: 'hard'
        });
      }
    }
  }

  cleanForm() {
    this.trainId.value = '';
    this.position.value = '';
    this.price.value = '';
  }

  handleTabsToggle(index) {
    if (index === 0) {
      this.cleanForm();
      this.setState({
        updateFormEnable: false,
        activeIndex: index
      });
    }
  }

  getTabs() {
    return tabsConfiguration.map((tab, index) => {
      let active = this.state.activeIndex === index ? 'btn-primary' : 'btn-default';
      return (
        <div className='btn-group' role='group' key={index}>
          <button type='button' className={'btn ' + active}
                  disabled={index === 1 && !this.state.updateFormEnable ? 'disabled' : ''}
                  onClick={this.handleTabsToggle.bind(this, index)}>
            {tab.value}
          </button>
        </div>
      );
    });
  }

  judgeTrainId() {
    if (this.trainId.value == '') {
      this.setState({
        trainIdError: '列车号不能为空'
      });
    }
  }

  judgePosition() {
    if (this.position.value == '') {
      this.setState({
        positionError: '位置不能为空'
      });
    }
  }

  judgePrice() {
    if (this.price.value == '') {
      this.setState({
        priceError: '价格不能为空'
      });
    }
  }

  hiddenErrorMessage(err) {
    var errObj = {};
    errObj[err] = '';
    this.setState(errObj);
  }

  submit() {
    let info = {};
    if (this.state.type == 'soft') {
      info = {
        trainId: this.trainId.value,
        position: this.position.value,
        price: this.price.value,
        type: '软卧'
      };
    } else {
      info = {
        trainId: this.trainId.value,
        position: this.position.value,
        price: this.price.value,
        type: '硬卧'
      };
    }

    if (this.state.activeIndex === 1) {
      const id = this.props.currentTicker._id;
      superagent.put(`/sleepers/${id}`)
        .use(noCache)
        .send(info)
        .end((err, res)=> {
          if (err) {
            throw err;
          }
          if (res.status === 204) {
            this.setState({trainIdError: '该列车已存储过票务信息'});
          } else if (res.status === 202) {
            this.setState({trainIdError: '不存在该列车,请先创建'});
          } else {
            this.props.modifyTickers();
            this.cleanForm();
          }
        })
    } else {
      superagent.post('/sleepers')
        .use(noCache)
        .send(info)
        .end((err, res)=> {
          if (err) {
            throw  err;
          }
          if (res.status === 204) {
            this.setState({trainIdError: '该列车已存储过票务信息'});
          } else if (res.status === 202) {
            this.setState({trainIdError: '不存在该列车,请先创建'});
          } else {
            this.props.modifyTickers();
            this.cleanForm();
          }
        });
    }
  }

  checkedType(type) {
    return type === this.state.type;
  }

  changeType() {
    if (this.hard.checked === true) {
      this.setState({
        type: this.hard.value
      });
    } else {
      this.setState({
        type: this.soft.value
      });
    }
  }

  render() {
    return (<div className="sleeper-form">

      <div className='btn-group btn-group-justified tab-padding' role='group'>
        {this.getTabs()}
      </div>
      <div className=' sleeper-form'>
        <label className='col-sm-4'>列车号</label>
        <div className='col-sm-8 margin-bottom'>
          <input type='text' className='form-control'
                 ref={(ref) => {
                   this.trainId = ref;
                 }} onBlur={this.judgeTrainId.bind(this)}
                 onFocus={this.hiddenErrorMessage.bind(this, 'trainIdError')}/>
          <ErrorTip error={this.state.trainIdError}/>
        </div>
      </div>

      <div className='form-group row'>
        <label className='col-sm-5 control-label'>卧铺类型</label>
        <div className='col-sm-6'>
          <label className='radio-inline'>
            <input type='radio' name='type' value='soft'
                   ref={(ref) => {
                     this.soft = ref;
                   }}
                   checked={this.checkedType('soft')}
                   onChange={this.changeType.bind(this)}

            />软卧
          </label>
          <label className='radio-inline'>
            <input type='radio' name='type' value='hard'
                   ref={(ref) => {
                     this.hard = ref;
                   }} checked={this.checkedType('hard')}
                   onChange={this.changeType.bind(this)}
            />硬卧
          </label>
        </div>
      </div>

      <div className=' sleeper-form'>
        <label className='col-sm-4'>位置</label>
        <div className='col-sm-8 margin-bottom'>
          <input type='text' className='form-control'
                 ref={(ref) => {
                   this.position = ref;
                 }} onBlur={this.judgePosition.bind(this)}
                 onFocus={this.hiddenErrorMessage.bind(this, 'positionError')}/>
          <ErrorTip error={this.state.positionError}/>
        </div>
      </div>

      <div className=' sleeper-form'>
        <label className='col-sm-4'>价格</label>
        <div className='col-sm-8 margin-bottom'>
          <input type='number' className='form-control'
                 ref={(ref) => {
                   this.price = ref;
                 }} onBlur={this.judgePrice.bind(this)}
                 onFocus={this.hiddenErrorMessage.bind(this, 'priceError')}/>
          <ErrorTip error={this.state.priceError}/>
        </div>
      </div>

      <div className='role-management-form text-center'>
        <button className='btn btn-primary btn-size'
                onClick={this.submit.bind(this)}>
          确定
        </button>
      </div>
    </div>);
  }
}