Component({
  properties: {
    dialogData: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {
        show: false,
        title: '',   //模态框title
        content: '',  //模态框内容，可以solt
        confirm:"确定",   //确定按钮文案
        cancel:"取消",    //取消按钮文案
      } // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    buttonType:{
      type: null,
      value:""
    }
  },
  methods: {
    _modaltCancel(){
      this.setData({
        ['dialogData.show']: false
      });
      this.triggerEvent('cancel')
    },
    _modalConfirm(){
      this.setData({
        ['dialogData.show']: false
      });
      this.triggerEvent('confirm')
    }
  }
})