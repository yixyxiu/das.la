import React from 'react';
import { Card, Space,Input, Button, Row, Col, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
var blake2b = require('blake2b');
const { TextArea } = Input;

export default class AddShop extends React.Component {
    

    state = {
        snsArr: [],
        list: [
            
        ],
        columns: [
            {
              title: '可选账号',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              width: 100,
              key: 'action',
              render: record => (
                <Space size="middle">
                    <Button type="primary" size={'small'} onClick={() => this.add(record)}>抢注该账号</Button>
                </Space>
              ),
            },
            
        ]
    };
    
    textAreaChange = e =>{
        let snsArr = e.target.value
        snsArr = snsArr.split(/[\s\n]/);
        snsArr.forEach((item,index)=>{
            if(!item){
                snsArr.splice(index,1);//删除空项 
            }
        })
        this.setState({ snsArr });
    }

    search = () =>{
        let data = this.state.snsArr;
        //console.log(data)
        let result = [];
        let arr = [];
        for(let i=0; i<data.length; i++){

            let item = data[i];
            //去标点符号并转小写
            item = item.replace(/\s/g,"").replace(/[^a-zA-Z0-9]/g,"").toLowerCase();
            //过滤非数字和字母组合
            if(/^[a-zA-Z\d]+$/.test(item)){

                if(item.length<4){
                    
                }else if(item.length>4 && item.length<10){

                    if(this.strInit(item)){
                        
                        if(!arr.includes(item)){
                            arr.push(item);
                            result.push({
                                id: result.length+1,
                                name: item
                            })
                        }
                    }
                }else if(item.length>10){
                    if(!arr.includes(item)){
                        arr.push(item);
                        result.push({
                            id: result.length+1,
                            name: item
                        })
                    }
                }
            }
        }
        //console.log(result)
        this.setState({ 
            list: result
        });
    }
    //校验
    strInit = text => {

        text += '.bit';
        var hash = blake2b(32, null, null, Buffer.from('2021-07-22 12:00'));
        hash = hash.update(Buffer.from(text));
        var output = new Uint8Array(32)
        var out = hash.digest(output);
        if(out[0]<13){
            //console.log(text,out[0])
            return true
        } 
        else return false
    }

    add = record =>{
        window.open("https://app.gogodas.com/account/register/"+record.name+".bit?inviter=cryptofans.bit&channel=cryptofans.bit", "newW")
    }
    
    componentDidMount() {
        
    }

    render() {
        const { list,columns } = this.state
        
        return (
            <Card title="DAS 注册小助手" bordered={false}>
                <div style={{display:'inline-block',position:'absolute',right:15,top:18,textAlign:'right'}}>
                    <a style={{color:'#1890ff'}} href="https://da.systems/explorer?inviter=cryptofans.bit&channel=cryptofans.bit&locale=zh-CN&utm_source=cryptofans+">【了解DAS】</a>
                </div>
                <div>你可以将你将要的账号列表输入/粘贴到下方的编辑框内，查询哪些账号是可注册的。</div>
                <br />
                <div style={{position:'relative',paddingRight:70}}>
                    <TextArea onChange={(e)=> this.textAreaChange(e)} placeholder="" autoSize />
                    <div style={{display:'inline-block',position:'absolute',right:0,top:0,width:70,textAlign:'right'}}>
                        <Button type="primary" onClick={()=> this.search()}>查询</Button>
                    </div>
                </div>
                <br />
                <Table rowKey={(item)=>item.id} dataSource={list} columns={columns} pagination={false} />
                
            </Card>
        )

    }
}