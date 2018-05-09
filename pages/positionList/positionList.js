// pages/positionList/positionList.js
const ajaxPosition = require('../../utils/service/ajaxPosition.js');
const ajaxUser = require('../../utils/service/ajaxUser.js');
const info = require('../../utils/js/info.js').info;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '相关职位',
    rowCount: '',
    allCityList: info.getCityList(),
    salaryList: info.getSalary2(),
    jobYearList: info.getjobYear(),
    educationList: info.getEducation(),
    jobTypeList: info.getWorkType(),
    compNatureList: info.getComProperty(),//公司性质
    compSizeList: info.getCompSize(),//公司规模
    releaseDateList: info.getUpdateTime(),//发布日期
    navType: '',  //1城市、2职位、3公司、4推荐
    searchCondition: {
      keyWord: '',  //关键字
      page: 1,
      pageSize: 20,
      salaryRange: '',//薪资范围
      compNature: '',//公司性质
      jobYear: '',//工作年限
      education: '',//学历
      city: '',//城市
      compSize: '',//公司规模
      jobType: '',//各种类型
      releaseDate: '',//发布时间
      job: '',//职位id
      recommendJob: 0  //1、推荐
    },
    searchResult: [],
    updataing: false,
    loginData: {   //登录数据
      show: false,
      code: '',
      city: ''
    },
    getTime: new Date().getTime(),
    // provinceList:info.getCityList()
    provinceList: [],  //省列表
    cityList: [],    //市列表
    areaList: [],    //区列表
    provinceId: '',
    cityId: '',
    areaId: '',
    cityName: '',
    showArea: false,//判断是否选区
    showModal: false,
    updataEnd: false,
    loading: false,
    firstLoad:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['searchCondition.keyWord']: options.keyWord
    });
    this.getLocation();
    this.isLoginFun();
    this.getCityList();

  },
  onShow(){

    // let deliveryId = app.globalData.deliveryId;
    // let that = this;
    // if(deliveryId.length>0){  //获取投递成功的职位Id
    //   let searchResult = this.data.searchResult;
    //   for (let i=0;i<searchResult.length;i++){
    //     for(let j=0;j<deliveryId.length;j++){
    //       if((searchResult[i].positionId==deliveryId[j])&&(searchResult[i].isDelivery==0)){
    //         let updata = `searchResult[${i}].isDelivery`
    //         that.setData({
    //           [updata]:1
    //         })
    //       }
    //     }
    //   }
    // }
    // if(!this.data.firstLoad){
    //   this.submitSearch()
    // }
  },
  jobsearch(){
    this.setData({
      loading: true
    });
    ajaxPosition.jobsearch(this.data.searchCondition, res => {
      this.setData({
        loading: false
      });
      if (res.code == 200) {
        this.setData({
          searchResult: this.data.searchResult.concat(res.jobList),
          updataing: false,
          rowCount: res.rowCount
        });
        wx.setNavigationBarTitle({
          title: `相关职位(${res.rowCount})`  //页面标题为路由参数
        });
        if (res.jobList.length == 0) {
          this.setData({
            updataEnd: true
          })
        }
      } else if (res.code == 302) {
        this.setData({
          updataEnd: true,
        });
        wx.setNavigationBarTitle({
          title: "相关职位(0)"  //页面标题为路由参数
        });
      }

    })
  },
  isLoginFun(){
    let that = this;
    wx.checkSession({
      success (e){
        wx.getStorage({
          key: 'userId',
          success: function (res) {
            app.data.loginStatus = true
            // that.setData({
            //   wasLogin: true
            // });
          },
          fail(err){
            app.data.loginStatus = false
            // that.setData({
            //   wasLogin: false
            // });
          }
        })

      },
      fail(){
        app.data.loginStatus = false
        // that.setData({
        //   wasLogin: false
        // });
        wx.login({
          success: res => {
            let reqdata = {
              js_code: res.code,
            };
            ajaxUser.getSessionKey(reqdata, res => {
              if (res.success) {
                wx.setStorage({
                  key: "rd_session",
                  data: res.data
                });
              }
            })
          }
        })
      },
    });
  },
  getCityList(){
    let that = this;
    this.setData({
      provinceList: that.data.allCityList,
      cityList: that.data.allCityList[0].childList
    })
  },
  cityChange(e){
    let that = this;
    let level = e.currentTarget.dataset.level;
    let id = e.currentTarget.dataset.id;
    let cityName = e.currentTarget.dataset.name;
    if (level == 1) {
      let children = e.currentTarget.dataset.children;
      that.setData({
        cityList: children,
        areaList: children[0].childList,
        provinceId: id,
        cityId: '',
      })
    } else if (level == 2) {
      let children = e.currentTarget.dataset.children;
      that.setData({
        areaList: children,
        cityId: id,
        cityName: cityName,
        ['searchCondition.city']: id,
        showArea: true,
        showModal: false,
        areaId:''
      });
      that.submitSearch()
    } else if (level == 3) {
      if(!id){
        let level2Id = that.data.cityId;
        that.setData({
          ['searchCondition.city']: level2Id,
          areaId:''
        });
      }else {
        that.setData({
          ['searchCondition.city']: id,
          showModal: false,
          areaId: id
        });
      }
      that.submitSearch()
    }
  },
  //提交搜索
  submitSearch(e){
    let reqdata = this.data.searchCondition;
    let that = this;
    this.setData({
      ["searchCondition.page"]:1,
      updataEnd:false
    })
    ajaxPosition.jobsearch(reqdata, res => {
      if (res.code == 200) {
        that.setData({
          searchResult: res.jobList,
        });
        wx.setNavigationBarTitle({
          title: `相关职位(${res.rowCount})`  //页面标题为路由参数
        });
      } else if (res.code == 302) {
        that.setData({
          searchResult: [],
        });
        wx.setNavigationBarTitle({
          title: "相关职位(0)"  //页面标题为路由参数
        });
      }
      that.setData({
        showModal: false
      })
    })
  },
  //导航条件选择
  navChange(e){
    console.log(e)
    let type = e.currentTarget.dataset.navType;
    this.setData({
      navType: type,
      showModal: true
    });
  },
  switchCity(){
    this.setData({
      showArea: false
    })
  },
  //隐藏模态框
  hideModal(){
    this.setData({
      showModal: false
    })
  },
  //条件选择
  conditionChange(e){
    let condiType = e.currentTarget.dataset.condiType;
    let oldId = this.data.searchCondition[condiType];
    let id = e.currentTarget.dataset.id;
    if (oldId == id) {
      this.setData({
        ['searchCondition.' + condiType]: ''
      });
    } else {
      this.setData({
        ['searchCondition.' + condiType]: id
      });
    }
  },
  posiTypeChange(e){
    let type = e.currentTarget.dataset.positionType;
    let that = this;
    this.setData({
      ['searchCondition.recommendJob']: type,
    });
    // if (type == 0) {
    //   that.setData({
    //     ['searchCondition.releaseDate']: 2
    //   })
    // }else if(type==1){
    //   that.setData({
    //     ['searchCondition.releaseDate']: ''
    //   })
    // };
    that.submitSearch()
  },
  getPositionDetail(e){
    let positionId = e.currentTarget.dataset.positionId;
    let userId = e.currentTarget.dataset.userId;
    wx.navigateTo({
      url: `/pages/positionDetail/positionDetail?talentId=${positionId}&compId=${userId}`
    })
  },
  keyWordInput(e){
    let val = e.detail.value;
    this.setData({
      ['searchCondition.keyWord']: val
    });
  },
  //加载更多
  loadMore(){
    let page = this.data.searchCondition.page;
    page += 1;
    this.setData({
      ['searchCondition.page']: page
    });
    this.jobsearch()
  },

  //获取城市
  getLocation(){
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let longitude = res.longitude;
        let latitude = res.latitude;
        let reqdata = {
          ak: 'cGICkI5AgtrQfR8MYAZggRvEakMQ5tdf',
          location: latitude + ',' + longitude,
          output: 'json'
        };
        ajaxUser.baiduCity(reqdata, cityres => {
          if (cityres.status == 0) {
            let cityName = cityres.result.addressComponent.city.split('市')[0];
            let allCityList = that.data.allCityList;
            for (let i in allCityList) {
              let cityList = allCityList[i].childList;
              for (let j in cityList) {
                if (cityList[j].value == cityName) {
                  that.setData({
                    cityName: cityName,
                    showArea: true,
                    areaList: cityList[j].childList,
                    ['searchCondition.city']: cityList[j].id
                  });
                  console.log(cityList[j]);
                  break;
                }
              }
            }
          }
          that.jobsearch();
          that.setData({
            firstLoad:false
          })
        });
      },
      fail: err => {
        that.jobsearch();
        that.setData({
          firstLoad:false
        })
      }
    });

  },
  //滚蛋加载
  // lower(){
  //   let that = this;
  //   let updataing = that.data.updataing;
  //   if(!updataing){
  //     that.setData({
  //       updataing:true
  //     });
  //     setTimeout(()=>{
  //       let page = that.data.searchCondition.page;
  //       page+=1;
  //       that.setData({
  //         ['searchCondition.page']:page
  //       });
  //       that.jobsearch();
  //     },500)
  //   }
  // }


});