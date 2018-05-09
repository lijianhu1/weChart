var info = require('../../utils/js/info.js').info;
var tool = require('../../utils/js/tool.js').tool;

let getPosition = info.getPosition();
let getIndustry = info.getIndustry();
for(let i in getPosition) {
	getPosition[i].open = false;
	getPosition[i].children = [];
//	for(let j in getPosition[i].childList) {
//		getPosition[i].childList[j].checked = false;
//	}
}
for(let i in getIndustry) {
	getIndustry[i].open = false;
	getPosition[i].children = [];
//	for(let j in getIndustry[i].childList) {
//		getIndustry[i].childList[j].checked = false;
//	}
}

Page({
	data: {
		title: '',
		getPosition: getPosition,
		getIndustry: getIndustry,
		sltList: [],
		choiceList: [],
		itemTemp1: 0,
		itemTemp2: 0,
	},
	onLoad: function(query) {
		let pageForm = query.pageForm;
		let dataStatus = query.dataStatus;
		let formKey = query.formKey;
		let formData = query.formData;
		let choiceList = [];
		let sltList = dataStatus == 'job' ? this.data.getPosition : this.data.getIndustry;
		if(formData){
			let urlData = formData.split(',');
			let item = {};
			for (let i in urlData) {
				item = {
					id:urlData[i].split('-')[0],
					value:urlData[i].split('-')[1],
					itemTemp1:urlData[i].split('-')[2],
					itemTemp2:urlData[i].split('-')[3]
				}
				sltList[item.itemTemp1].childList[item.itemTemp2].checked = true
				choiceList.push(item);
			}
			
		}
		this.setData({
			pageForm: pageForm,
			dataStatus:dataStatus,
			formKey: formKey,
			dataStatus: dataStatus,
			title: dataStatus == 'job' ? '选择职位' : '选择行业',
			choiceList:choiceList,
			sltList:sltList
		})
	},
	listOpen(e) {
		//		this.setData({
		//			tempCityId: !event.target.dataset.open
		//		})
		var id = e.currentTarget.id,
			list = this.data.sltList;
		for(var i = 0, len = list.length; i < len; ++i) {
			if(list[i].id == id) {
				this.setData({
					itemTemp1: i
				});
				list[i].children = list[i].childList
				list[i].open = !list[i].open
			} else {
				list[i].open = false
			}
		}
		this.setData({
			sltList: list
		});
	},
	sltClick(e) {
		let sltList = this.data.sltList;
		let list = this.data.choiceList
		if(sltList[this.data.itemTemp1].childList[e.currentTarget.id].checked) {
			sltList[this.data.itemTemp1].childList[e.currentTarget.id].checked = false
			for(let i in list) {
				if(list[i].id == sltList[this.data.itemTemp1].childList[e.currentTarget.id].id) {
					let item = list[i]
					this.setData({
						'sltList': sltList
					});
					list.splice(i, 1)
					this.setData({
						'choiceList': list
					});
				}
			}
		}else if(list.length >= 1) {
			sltList[this.data.itemTemp1].childList[e.currentTarget.id].checked = false
			this.setData({
				'sltList': sltList
			});
			tool.showToastText('最多可以选择一个');
		} else {
			this.setData({
				itemTemp2: e.currentTarget.id
			});

			sltList[this.data.itemTemp1].childList[e.currentTarget.id].checked = true
			this.setData({
				'sltList': sltList
			});

			let item = this.data.sltList[this.data.itemTemp1].childList[e.currentTarget.id]
			item.itemTemp1 = this.data.itemTemp1;
			item.itemTemp2 = e.currentTarget.id;
			list.push(item);

			this.setData({
				'choiceList': list
			});
		}
		//		let choiceList = 'choiceList[event]'
		//		this.setData({
		//			tempCityId: event.target.dataset.id
		//		})
	},
	closeList(e) {
		let list = this.data.choiceList;
		let sltList = this.data.sltList;
		let item = list[e.currentTarget.id]
		sltList[item.itemTemp1].childList[item.itemTemp2].checked = false

		this.setData({
			'sltList': sltList
		});
		list.splice(e.currentTarget.id, 1)
		this.setData({
			'choiceList': list
		});
	},
	submitChoice(e) {
		if(!this.data.choiceList.length){
			tool.showToastText('请选择');
			return
		}
		let list = this.data.choiceList;
		let all = [];
		let item=''
		for(let i in this.data.choiceList) {
			item = this.data.choiceList[i].id + '-' + this.data.choiceList[i].value + '-' + this.data.choiceList[i].itemTemp1 + '-' + this.data.choiceList[i].itemTemp2
			all.push(item)
		}
//		wx.setStorageSync(this.data.formKey, all.join());
//		wx.redirectTo({
//			url: '../'+ this.data.pageForm +'/'+ this.data.pageForm +'?'+this.data.formKey+'='+all.join()
//		})
		wx.setStorageSync(this.data.formKey, all.join());
//		wx.redirectTo({
//			url: '../'+ this.data.pageForm +'/'+ this.data.pageForm
//		})
		wx.navigateBack()
	}
})