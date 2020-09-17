import React from 'react'
import {Input, Select, Icon} from 'antd';
import './index.css'

const {Search} = Input;
export default class InputBanner extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
            defaultValue: '点击这里修改内容'
        }
    }

    toggleIsEdit(status, value) {
        if (value) {
            this.setState({isEdit: status, defaultValue: value},()=>{
                this.props.updateText(this.props.id,this.state.defaultValue)
            })
        }

    }


    render() {
        let inputDom = <Search
            placeholder="input search text"
            enterButton="确认"
            size="large"
            defaultValue={this.state.defaultValue}
            onSearch={value => this.toggleIsEdit(false, value)}
        />
        let bannerDom = <div style={{color:'grey',fontSize:'40px'}} onClick={this.toggleIsEdit.bind(this, true, this.state.defaultValue)}>{this.state.defaultValue}</div>

        return (
            <div style={{width: '100%', height: '100%'}}>
                <div  className='flex'>
                    {this.state.isEdit ? inputDom : bannerDom}
                </div>
            </div>
        )
    }
}
