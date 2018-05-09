let serviceUrl = 'http://192.168.1.150:8080';
// let serviceUrl = 'http://192.168.1.145:8085'; //秋生
// let serviceUrl = 'http://192.168.1.125:8080'; //发哥
//let serviceUrl = 'http://localhost';
const tool = require('../js/tool.js').tool;

const ajaxResume = {
  //修改基本信息
  addBaseInfo(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/addBaseInfo',
      data,
      success
    })
  },
  //修改求职意向
  addJobIntention(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/addJobIntention',
      data,
      success
    })
  },
  //修改或添加教育经历
  addEducations(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/addEducations',
      data,
      success
    })
  },
  //修改或添加工作经历
  addWorkExperiences(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/addWorkExperiences',
      data,
      success
    })
  },
  //修改或添加项目经历
  addProjects(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/addProjects',
      data,
      success
    })
  },
  //修改或添加掌握技能
  addProfeskills(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/addProfeskills',
      data,
      success
    })
  },
  //修改或添加自我评价
  updateSelfEvaluate(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/updateSelfEvaluate',
      data,
      success
    })
  },
  //上传图片
  uploadHeadImg(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/uploadHeadImg',
      data,
      success
    })
  },
  //获取简历详情
  getResumeDeatil(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/getResumeDeatil',
      data,
      success
    })
  },
  //根据id获取不同经历接口
  getExperience(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/getExperience',
      data,
      success
    })
  },
  //删除各种经历接口
  experienceDelete(data,success){
    tool.ajax({
      url:serviceUrl+'/resume/experienceDelete',
      data,
      success
    })
  },
  //获取完善度
  countType(success){
  	tool.ajax({
      url:serviceUrl+'/resume/countType',
      success
    })
  }
};

module.exports = {
	ajaxResume: ajaxResume
}