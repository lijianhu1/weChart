// components/login.js
const app = getApp();
const ajaxUser = require('../../utils/service/ajaxUser.js');
const info = require('../../utils/js/info.js').info;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '登录或注册ivva'
    },
    matchData:{
      type:Object,
      value:info.getPosition()
    }
  },
  ready: function () {
  },
  /**
   * 组件的初始数据
   */
  data: {
    matchList:[]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _search(e){
      let value = e.detail.value;
      if(value){
        let timer = setTimeout(()=>{
          let data = this.data.matchData;
          let matchDataArr=[];
          for(let i in data){
            let childList = data[i].childList
            for (let j in childList){
              if(childList[j].value.indexOf(value)!=-1){
                let item= childList[j];
                matchDataArr.push(item);
              }
            }
          };
          this.setData({
            matchList:matchDataArr
          });
        },1000)
      }

    }
  }
});
