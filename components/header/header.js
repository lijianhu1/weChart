Component({
	properties: {
		title: { // 属性名
			type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
			value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
		}
	},
	attached(){
		let urlList = getCurrentPages();
		if(urlList.length>1){
			this.setData({
		      backShow: true
		    })
		}else{
			this.setData({
		      backShow: false
		    })
		}
	},
	data: {
		backShow:false,
	},
	methods: {
		// 返回
		navigateBack: function() {
			wx.navigateBack()
		},
	}
})