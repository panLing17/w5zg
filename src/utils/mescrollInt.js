import Vue from 'vue'
import image from '../assets/img/top@2x.png'
let load = require('../assets/img/downLa.png')
let loadTop = require('../assets/img/loadTop@2x.png')
Vue.prototype.$mescrollInt = function (id,upFun,init,scrollWatch,downFun,downRe) {
  //创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
  //解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
  let self = this;
  self.mescroll = new MeScroll(id, { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
    up: {
      callback: upFun, //上拉回调
      offset: 100, //距离底部小于800px，则触发分页
      loadFull: {
        use: false, //列表数据过少,是否自动加载下一页,直到满屏或者无更多数据为止;默认false
        delay: 1000 //延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
      },
      // 关闭自定义滚动条
      scrollbar:{
        use: false
        // barClass : "mescroll-bar"
      },
      //以下参数可删除,不配置
      isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
      page:{size:6},  //可配置每页4条数据,默认10
      toTop:{ //配置回到顶部按钮
        warpId: id,
        src : image, //默认滚动到1000px显示,可配置offset修改
        warpClass: 'scrollWarpClass',
        //html: null, //html标签内容,默认null; 如果同时设置了src,则优先取src
        offset : 500
      },
      empty:{ //配置列表无任何数据的提示
        warpId:"dataList",
        icon : "../res/img/mescroll-empty.png" ,
//						  	tip : "亲,暂无相关数据哦~" ,
//						  	btntext : "去逛逛 >" ,
//						  	btnClick : function() {
//						  		alert("点击了去逛逛按钮");
//						  	}
      },
      //vue的案例请勿配置clearId和clearEmptyId,否则列表的数据模板会被清空
      //vue的案例请勿配置clearId和clearEmptyId,否则列表的数据模板会被清空
//						clearId: "dataList",
//						clearEmptyId: "dataList"
      noMoreSize:1,
      // 上拉初始化完毕
      inited(){
        setTimeout(()=>{
          if (init) {
            init()
          }
        },200)
      },
      onScroll: scrollWatch
    },
    down: {
      use: downRe?true:false,
      // auto: false,
      callback: downFun, //下拉回调
      warpClass: "mescroll-downwarp", //容器,装载布局内容,参见mescroll.css
      resetClass: "mescroll-downwarp-reset", //高度重置的动画,参见mescroll.css
      htmlContent: '<p class="downwarp-progress1"><img class="loadTop" src="'+loadTop+'"></p><p class="wrapLoad"><img class="loadC" src="'+load+'"><span class="downwarp-tip">下拉刷新</span></p>', //布局内容
      inited: function(mescroll, downwarp) {
        console.log("down --> inited");
        //初始化完毕的回调,可缓存dom
        mescroll.downTipDom = downwarp.getElementsByClassName("downwarp-tip")[0];
        mescroll.downProgressDom = downwarp.getElementsByClassName("downwarp-progress1")[0];

        mescroll.loadTop = downwarp.getElementsByClassName("loadTop")[0]
        mescroll.loadTop.style.width = '6.93rem'

        mescroll.loadC = downwarp.getElementsByClassName("loadC")[0]
        mescroll.loadC.style.width = '.48rem'
        mescroll.loadC.style.marginRight = '.21rem'

        mescroll.wrapLoad = downwarp.getElementsByClassName("wrapLoad")[0]
        mescroll.wrapLoad.style.display = 'flex'
        mescroll.wrapLoad.style.alignItems = 'center'
        mescroll.wrapLoad.style.justifyContent = 'center'
      },
      inOffset: function(mescroll) {
        console.log("down --> inOffset");
        //进入指定距离offset范围内那一刻的回调
        if(mescroll.downTipDom) {
          mescroll.downTipDom.innerHTML = "下拉刷新"
          mescroll.loadC.style.transform = "rotateZ(360deg)"
        }
        if(mescroll.downProgressDom){}
      },
      outOffset: function(mescroll) {
        console.log("down --> outOffset");
        //下拉超过指定距离offset那一刻的回调
        if(mescroll.downTipDom) mescroll.downTipDom.innerHTML = "松开刷新";
        if (mescroll.downProgressDom) {}

      },
      onMoving: function(mescroll, rate, downHight) {
        //下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离offset的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度

      },
      beforeLoading: function(mescroll, downwarp) {
        console.log("down --> beforeLoading");
        //准备触发下拉刷新的回调
        return false; //如果要完全自定义下拉刷新,那么return true,此时将不再执行showLoading(),callback();
      },
      showLoading: function(mescroll) {
        console.log("down --> showLoading");
        //触发下拉刷新的回调
        if(mescroll.downTipDom) {
          mescroll.downTipDom.innerHTML = "加载中 ..."
          mescroll.loadC.style.transform = "rotateZ(180deg)"
        }
      }
    }
  })
}
