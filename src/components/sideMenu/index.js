import React, {Component} from "react";
import { Layout, Menu, Icon ,Button} from 'antd';
import menuData from '../../mock/menu.json'

import './index.css';
import { message } from 'antd';
import {getChartByType} from '../../api/api'
const { SubMenu } = Menu;

class SideMenu extends Component{
    constructor(props) {
        super();
        this.state={
            charts:{},
            renderedDom:{}
        }
    }

    toggleLoading(flag){
        const key = 'updatable';
        if(flag){
            message.loading({ content: 'fetching data...', key });
        }else {
            message.success({ content: 'Loaded!', key});
        }
    }


    componentDidMount() {
       this.toggleLoading(true)
        /*mock data menuData*/
       Promise.resolve(menuData).then((res)=>{

           this.toggleLoading(false)
           let object=res;
           let types=Object.keys(object);//获取types
           let renderedDom={};
           for (let i = 0; i < types.length ; i++) {
               renderedDom[types[i]]=object[types[i]].map((item,index)=>{
                   return (
                       <div
                           key={item.code}
                           className="droppable-element chartImgItem"
                           draggable={true}
                           unselectable="on"
                           onMouseDown={this.emitCode.bind(this,item.code)}
                       >
                           <p className='chartTitle'>{item.title}</p>
                           <img className='chartCover' src={toBase64( item.file_code)}></img>
                       </div>
                   )
               })

           }


           this.setState(
               {
                   charts:res,
                   renderedDom
               }
           )
       })
    }

    emitCode(code){
        this.props.getConfigByCode(code)
    }

    render() {
        let menus=[{key:'line',title:'折线图'},{key:'pie',title:'饼状图'},{key:'map',title:'地图'},{key:'bar',title:'柱状图'},{key:'gauge',title:'仪表盘'},{key:'progressbar',title:'进度条'},{key:'dynamicMap',title:'动态地图'}]
        let subMenus=menus.map((item,index)=>{
            return (
                <SubMenu key={item.key} title={item.title}>
                    <div className="chartImgContainer">
                        {this.state.renderedDom[item.key]}
                    </div>
                </SubMenu>

            )
        })

        return (
                <Menu theme="dark" defaultSelectedKeys={['sub1']} mode="inline">

                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="line-chart" />
                                <span>Chart</span>
                            </span>
                        }
                    >
                        {subMenus}
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <Icon type="html5"  />
                                <span>Html</span>
                            </span>
                        }
                    >
                        <div className="chartImgContainer">
                            <div
                                className="droppable-element chartImgItem"
                                draggable={true}
                                unselectable="on"
                                onMouseDown={this.emitCode.bind(this,undefined)}
                            >
                                <p className='chartTitle'>DIV</p>

                            </div>

                        </div>
                    </SubMenu>
                    <SubMenu
                        key="sub3"
                        title={
                            <span>
              <Icon type="setting" />
              <span>设置</span>
            </span>
                        }
                    >
                        <Menu.Item key="1">
                            <Button onClick={this.props.saveConfig} type="primary"  block>
                                保存配置
                            </Button>
                        </Menu.Item>

                    </SubMenu>
                </Menu>

        )
    }

}


function toBase64(code) {
    let s='data:image/png;base64,'
/*    let res='url('+ (s+code)+')';*/

    return  s+code

}

export default SideMenu
