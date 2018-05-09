// components/login.js
const app = getApp();
const ajaxUser = require('../../utils/service/ajaxUser.js');
const info = require('../../utils/js/info.js').info;

let mouth = ['01月','02月','03月','04月','05月','06月','07月','08月','09月','10月','11月','12月'];
let year = [];
for (let i=1960;i<2030;i++){
  year.push(i+'年');
}
let currDate = new Date();
let currYear = currDate.getFullYear()+'年';
let currMouth = (currDate.getMonth()+1)>10?(currDate.getMonth()+1)+'月':'0'+(currDate.getMonth()+1)+'月';
let currMouthIndex = mouth.indexOf(currMouth);
let currYearIndex = year.indexOf(currYear);
year.splice(currYearIndex+1,0,'至今');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dateValue: {
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '0'
    }
  },
  ready: function (e) {
    /*if(this.data.dateValue===""){
      this.setData({
        multiIndex:[currYearIndex+1],
        multiArray:[year,[]],
      });
      let option={
        value:""
      };
      this.triggerEvent('success',option)
    }else*/ if(this.data.dateValue==0){
      this.setData({
        multiIndex:[currYearIndex+1],
        multiArray:[year,[]],
        // dateValue:0
      })
    }else {
      let dateValue = this.data.dateValue.split('-');
      let _year = dateValue[0],_mouth = dateValue[1];
      let _yearIndex="";
      let _mouthIndex="";
      for (let i=0;i<year.length;i++){
        if(year[i].indexOf(_year)!=-1){
          _yearIndex = i;
          break;
        }
      }
      for (let i=0;i<mouth.length;i++){
        if(mouth[i].indexOf(_mouth)!=-1){
          _mouthIndex = i;
          break;
        }
      };
      this.setData({
        multiIndex:[_yearIndex,_mouthIndex]
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    multiArray: [year,mouth],
    multiIndex: [currYearIndex,currMouthIndex],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //点击选择
    _pickerChange(e){
      let index = e.detail.value;
      if(index[0]==currYearIndex+1){
        this.setData({
          dateValue:'0'
        });
      }else {
        let _mouth = year[index[0]].split('年')[0];
        let _year = mouth[index[1]].split('月')[0];
        this.setData({
          dateValue:_mouth+'-'+_year
        });
      };
      let option={
        value:this.data.dateValue
      };
      this.triggerEvent('success',option)
    },
    //下拉选择
    _pickerColumnChange(e){
      let column = e.detail.column;
      let value = e.detail.value;
      let that = this;
      if(column==0){
        if(value==(currYearIndex+1)){
          that.setData({
            multiArray:[year,[]]
          })
        }else {
          that.setData({
            multiArray:[year,mouth],
            multiIndex:[value,currMouthIndex]
          })
        }
      }

    }
  }
});
