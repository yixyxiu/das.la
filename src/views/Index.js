import React from 'react';
import { Card, Space, Input, Button, Table, Alert, Pagination } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import https from '../api/https'
import TextArea from 'antd/lib/input/TextArea';


var blake2b = require('blake2b');
//const { TextArea } = Input;
let das = require('../mock/registered.json');
das.suffixList = require('../mock/suffix.json');
das.reserved = require('../mock/reserved.json');
das.recommendList = require('../mock/recommendList.json');
das.description = "DAS is a blockchain-based, open source, censorship-resistant decentralized account system that provides a globally unique naming system with a .bit suffix that can be used for cryptocurrency transfers, domain name resolution, authentication, and other scenarios."

console.log(das.suffixList)

export default class AddShop extends React.Component {


    state = {
        snsArr: [],
        keyword: '',
        list: [

        ],
        recommendList: [

        ],
        keywordList: [],
        animationClass: 'dasAnimation',
        columns: [
            {
                title: '可选账号',
                dataIndex: 'name',
                key: 'name',
            },
            // {
            //   title: '状态',
            //   render: record => (
            //     <Space size="middle">
            //         {record.status==0?'检测种':'可注册'}
            //     </Space>
            //   )
            // },
            {
                title: '操作',
                width: 100,
                key: 'action',
                align: 'right',
                render: record => (
                    <Space size="middle">
                        <Button type="primary" size={'normal'} shape="round" onClick={() => this.add(record)}>抢注该账号</Button>
                    </Space>
                ),
            },

        ]
    };

    textAreaChange = e => {
        let snsArr = e.target.value
        snsArr = snsArr.split(/[\s\n]/);
        snsArr.forEach((item, index) => {
            if (!item) {
                snsArr.splice(index, 1);//删除空项 
            }
        })
        this.setState({ snsArr: snsArr });
    }

    search = () => {

        let reserved = das.reserved;
        let registered = das.registered;
        let data = this.state.snsArr;
        let result = [];
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            //去标点符号并转小写
            item = item.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
            //过滤非数字和字母组合
            if (/^[a-zA-Z\d]+$/.test(item)) {
                if (this.canRegister(item)) {
                    let account = item + '.bit';
                    if (!arr.includes(account) && !reserved.includes(account) && !registered.includes(account)) {
                        arr.push(item);
                        result.push({
                            id: result.length + 1,
                            status: 0,
                            name: account
                        })
                    }
                }
            }
        }

        if (result.length == 0) {
            this.refreshRecommendList();
        }

        //console.log(result)
        this.setState({
            list: result
        });
    }


    // 校验一个账号是否已开放注册，用于 5- 9 位账号
    // 5-9 位，只开放 5 % 采用 blake2b 算法对账户名(包含 .bit 后缀)进行 hash ，取 hash 结果的第 1 个字节作为一个 u8 整数，当该整数小于等于 12 时，即可注册。
    canRegister = text => {

        if (text.length < 5)
            return false;

        if (text.length > 9)
            return true;

        // 5-9 位的，算法决定
        text += '.bit';
        var hash = blake2b(32, null, null, Buffer.from('2021-07-22 12:00'));
        hash = hash.update(Buffer.from(text));
        var output = new Uint8Array(32)
        var out = hash.digest(output);
        if (out[0] < 13) {
            //console.log(text,out[0])
            return true
        }

        return false
    }

    // 获取min 到 max 之间的随机数，包含min，不含 max
    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
    }

    add = record => {
        window.open("https://app.gogodas.com/account/register/" + record.name + "?inviter=cryptofans.bit&channel=cryptofans.bit", "newW")
    }

    keywordChanged = e => {
        let snsArr = e.target.value

        snsArr = snsArr.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        console.log(snsArr)

        this.setState({ keyword: snsArr });
    }

    keywordSearch = () => {
        let reserved = das.reserved;
        let registered = das.registered;
        let keyword = this.state.keyword;
        let result = [];

        keyword = keyword.replace(/\s/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        for (let i = 0; i < das.suffixList.length; i++) {
            let accountName = keyword + das.suffixList[i];
            // 只在结果集里显示 10 位以下的可注册账号
            if (this.canRegister(accountName) && accountName.length < 10) {
                let account = accountName + '.bit';
                // 排除
                if (!reserved.includes(account) && !registered.includes(account)) {
                    result.push({
                        id: result.length + 1,
                        status: 0,
                        name: account
                    })
                }
            }
        }

        //console.log(result)
        this.setState({
            keywordList: result
        });
    }

    refreshRecommendList = () => {

        let reserved = das.reserved;
        let registered = das.registered;
        let result = [];
        let arr = [];

        // 最多输出 10个
        while (result.length < 10) {
            let index = this.getRandomInt(0, das.recommendList.length);
            let item = das.recommendList[index];
            if (this.canRegister(item)) {
                let account = item + '.bit';
                // 排除
                if (!arr.includes(account) && !reserved.includes(account) && !registered.includes(account)) {
                    arr.push(item);
                    result.push({
                        id: result.length + 1,
                        status: 0,
                        name: account
                    })
                }
            }
        }

        //console.log(result)
        this.setState({
            recommendList: result
        });
    }

    sleep = async (text, idx) => {
        let that = this;
        return new Promise((resolve) => {
            https.fetchGet("https://autumnfish.cn/search", { 'keywords': text })
                .then(data => {
                    let result = that.state.list;
                    result[idx].status = 1;
                    this.setState({
                        list: result
                    });
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                })
        });
    }

    isReadyList = async (list) => {
        let strArr = ['晴天', '阴天', '雨天', '彩虹', '海底'];
        for (var i = 0; i < list.length; i++) {
            let item = list[i];
            /* 等待0.2s */
            await this.sleep(item.name, i);
        }
    }

    componentDidMount() {
        //this.isReadyList(result)
    }

    render() {
        const { list, recommendList, keywordList, columns } = this.state

        return (
            <div className={this.state.animationClass}>
                <Card title="DAS 注册小助手" bordered={false}>
                    <div style={{ display: 'inline-block', position: 'absolute', right: 15, top: 18, textAlign: 'right' }}>
                        <a style={{ color: '#1890ff' }} href="https://da.systems/explorer?inviter=cryptofans.bit&channel=cryptofans.bit&locale=zh-CN&utm_source=cryptofans+">【了解DAS】</a>
                    </div>
                    <Alert message="用法：将你想要的账号列表输入/粘贴到下方的编辑框内，或者粘贴一篇英文文章到编辑框内，查询哪些账号是可注册的。" type="info" />
                    <br />
                    <div style={{ position: 'relative', paddingRight: 100 }}>
                        <TextArea onChange={(e) => this.textAreaChange(e)} allowClear placeholder={das.description} rows={4} />
                        <div style={{ display: 'inline-block', position: 'absolute', right: 15, top: 0, width: 70, textAlign: 'right' }}>
                            <Button type="primary" shape="round" icon={<SearchOutlined />} onClick={() => this.search()}>查询</Button>
                        </div>
                    </div>
                    <br />
                    <Table rowKey={(item) => item.id} dataSource={list} columns={columns} />
                    <br />
                </Card>
                <Card title="按关键字匹配" bordered={false}>
                    <Alert message="用法：将你想要的账号前缀输入到编辑框内，查询哪些账号是可注册的。" type="info" />
                    <br />
                    <div style={{ position: 'relative', paddingRight: 100 }}>
                        <Input onBlur={(e) => this.keywordChanged(e)} placeholder="defi" allowClear maxLength={10} rows={1} />
                        <div style={{ display: 'inline-block', position: 'absolute', right: 15, top: 0, width: 70, textAlign: 'right' }}>
                            <Button type="primary" shape="round" icon={<SearchOutlined />} onClick={() => this.keywordSearch()}>搜索</Button>
                        </div>
                    </div>
                    <br />
                    <Table rowKey={(item) => item.id} dataSource={keywordList} columns={columns}  />
                    <br />
                </Card>
                <Card title="还是没找到心仪的账号？" bordered={false} extra={<Button type="primary" shape="round" danger icon={<RedoOutlined />} onClick={() => this.refreshRecommendList()}>换一批</Button>}>
                    <Alert
                        message="温馨提示"
                        description="小助手为你推荐了以下账号，请理性注册 DAS 账号"
                        type="warning"
                        showIcon
                    />
                    <br></br>
                    <Table rowKey={(item) => item.id} dataSource={recommendList} columns={columns} />
                    <br />
                </Card>
            </div>
        )

    }
}