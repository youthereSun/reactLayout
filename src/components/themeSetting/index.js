import React from 'react'
import {Popover,Divider , Upload, message, Button, Icon} from 'antd';
import {SketchPicker} from 'react-color';
import {SwatchesPicker} from 'react-color';
const { Dragger } = Upload;

export default class ThemeSetting extends React.Component {
    state = {
        background: '#fff',
        fileList: []
    };

    handleChangeComplete = (color) => {
        this.setState({background: color.hex});
        this.props.emitColor(color.hex)
    };

    /**
     * file图片文件转base64
     * @param {*} img file文件或者blob
     * @param {*} callback function (imgurl)通过参数获得base64
     */
    getBase64(img, callback) {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }

    beforeUpload = (file) => {
        this.getBase64(file, (res) => {
            console.log(res)
            let url = 'url(' + res + ')'
            this.props.emitColor(url)

        })
        return false

    }

    render() {


        const content = (
        <div style={{textAlign:'center'}}>
                <div style={{padding:'10px 10px'}} >
                    <p>纯色背景</p>
                    <SketchPicker
                        color={this.state.background}
                        onChangeComplete={this.handleChangeComplete}
                    />
                </div>
                <div>
                    <p style={{padding:'10px 10px'}}>自定义背景</p>
                    <Dragger
                        beforeUpload={this.beforeUpload}
                        fileList={this.state.fileList} >
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击此处或将图片拖拽到此处上传背景图片</p>
                    </Dragger>
                </div>

            </div>
        );

        const iconStyle = {
            fontSize: '30px',
            color: "#001529",
            cursor:'pointer'
        }


        return (
            <div style={{position: 'absolute',top:'10%', right: 20, zIndex: 999}}>
                <Popover    content={content}  trigger="click">
                    <i style={iconStyle} className='iconfont icon-theme'></i>
                </Popover>
            </div>


        );

    }

}
