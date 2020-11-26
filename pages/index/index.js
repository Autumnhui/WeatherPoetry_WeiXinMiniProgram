//index.js
//获取应用实例
const app = getApp()
const jinrishici = require('../../utils/jinrishici.js')

Page({
  
  data: {
    title:"🌈",
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    sentence1:"一蓑烟雨任平生",
    sentence2:"也无风雨也无晴。",
    sentence3:"",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    yuanwen:"",

    chengshi:"广州",
    shike:"辰时&食时",
    tianqi:"多云",
    wendu:"20",
    img:"qing",
    region: ['广东省','广州市'],
    // customItem: '全部',
    today_result:[],
    // shicheng:"?"
  },

  // 时辰无用

  // onLoad:function(){
  //   var thhat=this;
  //   // 十二时辰按照地支，十二属相排列
  //   let tzArr = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  //   // 十二时辰对应
  //   let sdArr = ['夜半', '鸡鸣', '平旦', '日出', '食时', '隅中', '日平', '日昳', '晡时', '日入', '黄昏', '人定']
  //   // 一个时辰为八刻
  //   let skArr = ['一', '二', '三', '四', '五', '六', '七', '八']
     
  //   // 默认获取当前时辰，时刻
  //   const getShiChen = (h = new Date().getHours(), m = new Date().getMinutes(), s = new Date().getSeconds()) => {
  //     let shichenStr = tzArr[parseInt(h / 2)] + '时（' + sdArr[parseInt(h / 2)] + '）'
  //     // 判断时刻
  //     if (h % 2 === 0) {
  //       shichenStr += skArr[parseInt(m / 15)]
  //     } else if (h % 2 === 1) {
  //       shichenStr += skArr[parseInt(m / 15) + 4]
  //     }
  //     return shichenStr + '刻'
      
  //   }
  //    var shichenStr=getShiChen()
  //   console.log(getShiChen())
  //   thhat.setData({
  //     "shicheng":shichenStr
  //   })
  // },

    // 用户地址选择
    bindRegionChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value[2])
      // this.shuaxin()
      // var city = e.detail.value[2];
      // this.setData({
      //   region1: city
      // });
      var city=e.detail.value[2].slice(0,2);
      console.log(city)
      this.getWeatherData(city);
    },

  getWeatherData:function(value){
    var that =this;
    // 获取天气信息
    wx.request({
      url: 'https://tianqiapi.com/api?version=v6',
      data: {
        appid:'85266992',
        appsecret:'pyKKja4s',
        city:value
      },
      success (res) {
        console.log(res,'用户选择')
        that.setData({
          "chengshi":res.data.city,
          "tianqi":res.data.wea,
          "wendu":res.data.tem,
          "img":res.data.wea_img,
        })
      },
      fail:function(erro){
        console.log(erro,'失败')
      }
    })
  },



  // 刷新
  shuaxin(){
    this.onReady()
    wx.redirectTo({
      url: '../index/index',
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  // 启动时
  onLoad: function () {
    var that = this;
    wx.request({

      url: 'https://tianqiapi.com/api?version=v6',
      data: {
        appid:'85266992',
        appsecret:'pyKKja4s',
        // city:value
      },
      success (res) {
        // console.log(res,'启动')
        that.setData({
          "chengshi":res.data.city,
          "tianqi":res.data.wea,
          "wendu":res.data.tem,
          "img":res.data.wea_img,
        })
      },
      fail:function(err){
        console.log(err,'启动失败')
      }
    })

    jinrishici.load(res => {
      // 下面是处理逻辑示例
      // console.log(res)
      this.setData({"jinrituijian":res.data.content,
                    "biaoqian":res.data.matchTags,
                    "chaodai": res.data.origin.dynasty,
                    "zuozhe":res.data.origin.author,
                    "timu":res.data.origin.title,
                    })


// 以逗号为分隔，展示2-3句诗词。
  let juzi1=res.data.content.split("，");
  // console.log(juzi1)
  // console.log(juzi1[1])
  // console.log(juzi1[2])

  //如果第三句为空，则只显示两句。
  if (juzi1[2]==undefined){
        this.setData({
          sentence1:juzi1[0]+"，",
          sentence2:juzi1[1],
        })
  // 如果第三局不为空，则显示第三句在第二句后。
    } else {
      this.setData({
        sentence1:juzi1[0]+"，",
        sentence2:juzi1[1],
        sentence3:"，"+juzi1[2]})
    }
  
  // 查看原文时，换行。
  let yuanwen_c=res.data.origin.content;
  // console.log(yuanwen_c)
  let yuanwenjuzi = yuanwen_c;
  let text = "";
  var i;
  for (i = 0; i < yuanwenjuzi.length; i++) {
    text += yuanwenjuzi[i] + "\n";
  }
  this.setData({
    yuanwen:text
  })


    })
     
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  menuHide () {
    if (this.data.hasPopped) {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
  },
  menuMain () {
    if (!this.data.hasPopped) {
      this.popp()
      this.setData({
        hasPopped: true,
      })
    } else {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
  },

  menuToAbout () {
    this.menuMain()
    wx.navigateTo({
      url: '/pages/about/home/home',
    })
  },
  popp() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationFour = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(180).step()
    animationOne.translate(0, -60).rotateZ(360).opacity(1).step()
    animationTwo.translate(-Math.sqrt(3600 - 400), -30).rotateZ(360).opacity(1).step()
    animationThree.translate(-Math.sqrt(3600 - 400), 30).rotateZ(360).opacity(1).step()
    animationFour.translate(0, 60).rotateZ(360).opacity(1).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
      animationFour: animationFour.export(),
    })
  },
  takeback() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationFour = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(0).step();
    animationOne.translate(0, 0).rotateZ(0).opacity(0).step()
    animationTwo.translate(0, 0).rotateZ(0).opacity(0).step()
    animationThree.translate(0, 0).rotateZ(0).opacity(0).step()
    animationFour.translate(0, 0).rotateZ(0).opacity(0).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
      animationFour: animationFour.export(),
    })
  },

  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },

})
