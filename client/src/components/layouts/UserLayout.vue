<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <img src="~@/assets/logo-title.png" alt="" class="logo-title">
    <chart-map class="bg-map"></chart-map>
    <div class="left">
      <div class="highformwork left-item">
        <img src="~@/assets/3_0101.png" />
        <h3>轨道交通</h3>
      </div>
      <div class="pit left-item">
        <img src="~@/assets/3_0101.png" />
        <h3>基坑边坡</h3>
      </div>
      <div class="tunnel left-item">
        <img src="~@/assets/3_0101.png" />
        <h3>建构筑物</h3>
      </div>
      <div class="metro left-item">
        <img src="~@/assets/3_0101.png" />
        <h3>地基路面</h3>
      </div>
      <div class="house left-item">
        <img src="~@/assets/3_0101.png" />
        <h3>水运结构</h3>
      </div>
      <div class="bridge left-item">
        <img src="~@/assets/3_0101.png" />
        <h3>桥梁隧道</h3>
      </div>
    </div>
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="javascript:;">
            <img src="~@/assets/logo.png" class="logo" alt="logo" />
            <span class="title">工程检测智慧云管理平台</span>
          </a>
        </div>
        <!-- <div class="desc"> -->
        <!-- 平台主页 -->
        <!-- </div> -->
      </div>

      <route-view></route-view>

      <div class="footer">
        <!-- 建议请使用 chrome、Safari、IE10及以上浏览器 -->
      </div>
    </div>
    <div class="tip-foot">建议请使用 chrome、Safari、IE10及以上浏览器</div>
  </div>
</template>

<script>
import RouteView from '@/components/layouts/RouteView'
import { mixinDevice } from '@/utils/mixin.js'
import ChartMap from './components/ChartMap.vue'

export default {
  name: 'UserLayout',
  components: { RouteView, ChartMap },
  mixins: [mixinDevice],
  data() {
    return {}
  },
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="scss" scoped>
#userLayout.user-layout-wrapper {
  // width: 100%;
  height: 100%;
  position: relative;
  background-image: url('../../assets/login_bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  // background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .logo-title {
    position: relative;
    top: 20px;
    left: 20px;
  }

  .bg-map {
    position: absolute;
    left: 10%;
    top: 16%;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0);
    width: 45%;
    height: 60%;
  }

  .left {
    position: absolute;
    left: 10%;
    top: 16%;
    z-index: 10000;
    width: 45%;
    height: 60%;
    .left-item {
      position: relative;
      width: 100px;

      img {
        width: 100%;
        height: 100%;
        // display: none;
      }
      h3 {
        position: absolute;
        top: 50%;
        left: 0;
        transform:translate(0px, -10px);
        color: rgba(255,255,255,.7);
        display: inline-block;
        width: 100%;
        text-align: center;
        line-height: 20px;
      }
    }
    .highformwork {
      overflow: hidden;
      position: absolute;
      top: 70%;
      left: 18%;
    }
    // .highformwork:hover {
    //   transform: translateY(-30%) translateX(-30%);
    //   // background: url('~@/assets/3.png') no-repeat;
    //   width: 280px;
    //   height: 280px;
    // }
    // .highformwork:hover img {
    //   visibility: hidden;
    // }
    .pit {
      overflow: hidden;
      position: absolute;
      top: 42%;
      left: 74%;
    }
    // .pit:hover {
    //   transform: translateY(-30%) translateX(-30%);
    //   // background: url('resources/8_2.png') no-repeat;
    //   width: 280px;
    //   height: 280px;
    // }

    // .pit:hover img {
    //   visibility: hidden;
    // }
    .tunnel {
      overflow: hidden;
      position: absolute;
      top: 43%;
      left: 24%;
    }
    // .tunnel:hover {
    //   transform: translateY(-30%) translateX(-30%);
    //   // background: url('resources/8_3.png') no-repeat;
    //   width: 280px;
    //   height: 280px;
    // }

    // .tunnel:hover img {
    //   visibility: hidden;
    // }
    .metro {
      overflow: hidden;
      position: absolute;
      top: 16%;
      left: 59%;
    }
    // .metro:hover {
    //   transform: translateY(-30%) translateX(-30%);
    //   // background: url('resources/8_4.png') no-repeat;
    //   width: 280px;
    //   height: 280px;
    // }

    // .metro:hover img {
    //   visibility: hidden;
    // }
    .house {
      overflow: hidden;
      position: absolute;
      top: 21%;
      left: 38%;
    }
    // .house:hover {
    //   transform: translateY(-30%) translateX(-30%);
    //   // background: url('resources/8_5.png') no-repeat;
    //   width: 280px;
    //   height: 280px;
    // }

    // .house:hover img {
    //   visibility: hidden;
    // }

    .bridge {
      overflow: hidden;
      position: absolute;
      top: 66%;
      left: 44%;
    }
    // .bridge:hover {
    //   transform: translateY(-30%) translateX(-30%);
    //   // background: url('resources/8_6.png') no-repeat;
    //   width: 280px;
    //   height: 280px;
    // }

    // .bridge:hover img {
    //   visibility: hidden;
    // }
  }

  .container {
    // width: 100%;
    // min-height: 100%;
    // background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
    // padding: 11% 0 144px;
    position: absolute;
    top: 26%;
    right: 10%;
    z-index: 1000;
    background-color: rgba(51, 69, 89, 0.7);
    // background-color: #fff;
    padding: 40px;
    border-radius: 4px;

    a {
      text-decoration: none;
    }

    .top {
      text-align: center;

      .header {
        height: 44px;
        line-height: 44px;
        margin-bottom: 20px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 36px;
          vertical-align: top;
          margin-right: 16px;
          // margin-top: 6px;
          border-style: none;
        }

        .title {
          font-size: 26px;
          color: rgba(0, 0, 0, .85);
          color: rgba(255, 255, 255, 0.85);
          font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
            'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
            'Segoe UI Symbol';
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }

  .tip-foot {
    line-height: 50px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #666;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>