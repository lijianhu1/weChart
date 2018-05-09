let serviceUrl = 'http://192.168.1.150:8080';
// let serviceUrl = 'http://192.168.1.145:8085'; //秋生
// let serviceUrl = 'http://192.168.1.125:8080'; //发哥
//let serviceUrl = 'http://localhost';
const tool = require('../js/tool.js').tool;

const ajaxPosition = {
	//职位搜索
	jobsearch(data, success) {
		tool.ajax({
			url: serviceUrl + '/job/jobsearch',
			data,
			type: 'POST',
			success
		})
	},
	//在招职位
	getTalentDemandList(data, success) {
		tool.ajax({
			url: serviceUrl + '/job/getTalentDemandList',
			data,
			type: 'POST',
			success
		})
	},
	//职位详情
	getTalentDemand(data, success) {
		tool.ajax({
			url: serviceUrl + '/job/getTalentDemand',
			data,
			type: 'POST',
			success
		})
	},
	//职位投递
	userDelivery(data, success) {
		tool.ajax({
			url: serviceUrl + '/record/userDelivery',
			data,
			type: 'POST',
			success
		})
	},
	//职位投递
	hotSearch(success) {
		tool.ajax({
			url: serviceUrl + '/job/hotSearch',
			type: 'GET',
			success
		})
	},
	//简历完善度
	countType(success) {
		tool.ajax({
			url: serviceUrl + '/resume/countType',
			type: 'GET',
			success
		})
	},

};

module.exports = ajaxPosition