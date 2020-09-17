import React from 'react';
import {Layout, Menu, Icon} from 'antd';
import {WidthProvider, Responsive} from "react-grid-layout";
import _ from "lodash";
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/map';
import SideMenu from './components/sideMenu'
import {viewChartById} from './api/api'
import './utils/echartLibs'
import InputBanner from './components/inputBanner'
import ThemeSetting from './components/themeSetting'
import { Scrollbars } from 'react-custom-scrollbars';
import chartConfig from './mock/chartConfig.json'

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const {Content, Sider} = Layout;

export default class DragLayout extends React.Component {
    static defaultProps = {
        cols: {lg: 18, md: 10, sm: 6, xs: 4, xxs: 2},
        rowHeight: 20,
        breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},

    };

    constructor(props) {
        super(props);
        this.state = {
            widgets: [],
            collapsed: false,
            doms: null,
            themeColor: "#fff"
        }
    }

    componentDidMount() {
        this.saveToLS('layouts', [])
    }

    componentWillUnmount() {
        this.saveToLS('layouts', [])
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.collapsed !== nextState.collapsed) {
            return true
        }
        if (this.state.doms !== nextState.doms) {
            return true
        }
        if (this.state.themeColor !== nextState.themeColor) {
            return true
        }
        return false
    }

    /**
     * 侧边栏折叠
     * @param collapsed
     */
    onCollapse = collapsed => {
        this.setState({collapsed});
    };

    saveToLS(key, value) {
        if (global.localStorage) {
            global.localStorage.setItem(
                "32FER23FFDF3435WDAF",
                JSON.stringify({
                    [key]: value
                })
            );
        }
    }

    getFromLS = (key) => {
        let ls = {};
        if (global.localStorage) {
            try {
                ls = JSON.parse(global.localStorage.getItem("32FER23FFDF3435WDAF")) || {};
            } catch (e) {
                /*Ignore*/
            }
        }
        return ls[key];
    }

    /**
     * 移除部件
     * @param i
     */
    onRemoveItem(i) {
        this.setState({
            widgets: this.state.widgets.filter((item, index) => index != i)
        }, () => {
            this.generateDOM()
        });
    }

    /**
     * 拖放回调
     * @param layout
     * @param layoutItem
     * @param event ‘drop’
     */
    onDrop = (layout, layoutItem, event) => {
        let code = this.code;//实际code
        const addItem = {
            x: layoutItem.x,
            y: layoutItem.y, // puts it at the bottom
            w: 5,
            h: 10,
            i: new Date().getTime().toString(),
        };
        this.setState(
            {
                widgets: this.state.widgets.concat({
                    ...addItem,
                    code,
                }),
            }, () => {
                this.generateDOM()
            }
        )
    };

    /**
     * @param layout 当此改动的块
     * @param layouts 变化完成后的新布局信息，包含每个块的xywhi
     * 在这里保存对应信息
     */
    onLayoutChange(layout, layouts) {
        let list = [];
        for (let i = 0; i < this.state.widgets.length; i++) {
            for (let j = 0; j < layouts.lg.length; j++) {
                if (this.state.widgets[i].i === layouts.lg[j].i) {
                    list.push({...this.state.widgets[i], ...layouts.lg[j]})//都存在的属性，后面覆盖前面
                    /*          list.push(Object.assign( this.state.widgets[i],layouts.lg[j]))*/
                    continue
                }
            }
        }
        this.saveToLS('layouts', list)
    }

    /**
     * 如果是chart，则为chart的code
     * 如果是div，则为undifine
     * @param code
     */
    updateCode(code) {
        this.code = code;//使用变量名减少重新渲染
    }

    /**
     * if code => getConfigByCode   else => resolve id
     * @returns {Promise<unknown[]>}
     */
    getData = () => {
        let asyncFun = []
        this.state.widgets.forEach((item, index) => {
            if (item.code) {
                asyncFun.push(Promise.resolve(JSON.parse(chartConfig.config)))
            } else {
                asyncFun.push(this.fakePromise(item.i))
            }
        })
        return Promise.all(asyncFun)
    }

    /**
     * 修改文字内容需要同步
     * @param id
     * @param text
     */
    updateText(id, text) {

        const widgets = this.state.widgets.map(item => {
            if (item.i === id) {
                item.text = text
            }
            return item
        })
        this.setState({
            widgets
        })
    }


    /**
     * 生成挂件
     * @returns {Uint8Array | BigInt64Array | any[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
     */
    generateDOM = () => {
        this.getData().then(res => {
            let doms = _.map(this.state.widgets, (l, i) => {
                let component = l.code ? (
                    <ReactEcharts
                        option={res[i]}
                        theme={res[i].otherSetting ? res[i].otherSetting.chartTheme ? res[i].otherSetting.chartTheme : "" : res[i].otherSettings ? res[i].otherSettings.chartTheme : ""}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{width: '100%', height: '100%'}}
                    />
                ) : (

                    <InputBanner id={l.i} updateText={this.updateText.bind(this)}/>
                )
                return (
                    <div key={l.i} data-grid={l}>
                        <span className='remove'
                              onClick={this.onRemoveItem.bind(this, i)}>
                            <Icon style={{color: 'red'}}
                             type="close"/></span>
                        {component}
                    </div>
                );
            });

            this.setState({doms})
        })
    };

    fakePromise(id) {
        return Promise.resolve(id)
    }

    /**
     * 设置主题色
     * @param themeColor
     */
    applyTheme(themeColor) {
        this.setState({
            themeColor
        })
    }

    /**
     * 储存配置格式
     * config=>  code不为undefine=》图标类型    text不为undefine=》html类型
     */
    saveConfig = () => {

        const bg = this.state.themeColor;
        const layouts = this.getFromLS('layouts')
        let list = [];
        for (let i = 0; i < this.state.widgets.length; i++) {
            for (let j = 0; j < layouts.length; j++) {
                if (this.state.widgets[i].i === layouts[j].i) {
                    let obj={...this.state.widgets[i], ...layouts[j]}
                    obj['text']=this.state.widgets[i].text
                    list.push(obj)//都存在的属性，后面覆盖前面
                    /*          list.push(Object.assign( this.state.widgets[i],layouts.lg[j]))*/
                    continue
                }
            }
        }
        const config = {list, bg}
        console.log(config)
        debugger
    }

    getConfigByCode(code) {
        let params = {
            code: code
        }
        let p = new Promise((resolve, reject) => {
            viewChartById(params, (res) => {
                if (res.data) {
                    resolve(JSON.parse(res.data.config))//把config传出去
                } else {
                    reject()
                }
            })
        })
        return p
    }


    render() {
        return (
            <Layout style={{height: '100vh'}}>
                <Sider width={300} collapsedWidth={0} collapsible collapsed={this.state.collapsed}
                       onCollapse={this.onCollapse}>
                    <Scrollbars >
                    <SideMenu saveConfig={this.saveConfig} getConfigByCode={this.updateCode.bind(this)}/>
                    </Scrollbars>
                </Sider>
                <Layout>
                    <Content>
                        <div style={{height: '100vh'}}>
                            <ThemeSetting emitColor={this.applyTheme.bind(this)}/>
                            <ResponsiveReactGridLayout
                                style={{background: this.state.themeColor, height: "100vh"}}
                                useCSSTransforms={true}
                                {...this.props}
                                onLayoutChange={this.onLayoutChange.bind(this)}
                                onDrop={this.onDrop}
                                isDroppable={true}

                            >
                                {this.state.doms}
                            </ResponsiveReactGridLayout>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
