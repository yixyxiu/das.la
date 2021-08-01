import Mock from 'mockjs'

Mock.mock(/\/yx\/endpointapp\/page.action/,"get",require("./appList.json"))
//Mock.mock(/\/upload/,"post",require("./upload.json"))