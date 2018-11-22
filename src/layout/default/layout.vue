<template>
  <el-container class="layout">
    <!-- 伸缩栏 -->
    <el-aside class="aside" :width="asideWidth">
      <el-menu ref="subMenu" class="nav" :default-openeds="subMenusOpeneds" :collapse="collapse" unique-opened background-color="#30363e" text-color="#fff" @select="subMenuSelect">

        <!--  logo 部分 -->
        <div class="logo">
          <img src="@/assets/img/logo.png" alt="logo" style="width:50px;height:23px">
          <transition name="el-zoom-in-center">
            <h1 v-show="!collapse" :title="kindo.config.subTitle">{{ kindo.config.subTitle }}</h1>
          </transition>
        </div>

        <!-- 菜单部分 -->
        <nav-item v-for="menu in subMenus" :key="menu.id" :menu="menu">

        </nav-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 顶部菜单部分 -->
      <el-header class="header" height="64px">
        <el-row type="flex" justify="center" align="middle">
          <el-col :span="18" style="display: flex;">
            <div class="control">
              <i class="action fa-list" @click="() => { collapse = !collapse }">
              </i>
            </div>
            <div class="nav">
              <el-menu mode="horizontal" active-text-color="#01bdd6" @select="rootMenuSelect">
                <el-menu-item v-for="menu in rootMenus" :key="menu.id" :index="menu.id" :router="menu.id" :title="menu.name">
                  <i :class="menu.iconUrl"></i>
                  <span v-show="!collapseNav" style="margin-left: 10px">{{ menu.name }}</span>
                </el-menu-item>
              </el-menu>
            </div>
          </el-col>
          <el-col :span="6" style="min-width: 200px;">
            <div class="user">
              <el-dropdown>
                <el-button type="text" class="action" style="font-size: 12px">
                  {{ userInfo.name || userInfo.emplName }}
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item>
                            <div @click="showUserCenter">
                              <i class="el-icon-arrow-down" style="margin-right: 10px;">
                              </i>
                              <span>个人中心</span>
                            </div>
                          </el-dropdown-item> -->
                  <el-dropdown-item>
                    <div @click="signOut">
                      <i class="el-icon-more-outline" style="margin-right: 10px;">
                      </i>
                      <span>安全退出</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-header>

      <!-- 组件部分 -->
      <el-main>
        <transition name="el-fade-in-linear" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>

    <kindo-side-panel v-model="userCenter" closeHtml="<i class='el-icon-close'></i>" :widths="['400px']" @close="hideUserCenter">
      个人中心
    </kindo-side-panel>
  </el-container>
</template>

<script>
// 引入不限层级菜单
import NavItem from './navItem'

import { user } from '@/type.js'

import elementResizeDetectorMaker from 'element-resize-detector'
import debounce from 'lodash/debounce'
const erd = elementResizeDetectorMaker({
  strategy: 'scroll' //<- For ultra performance.
})

export default {
  components: {
    NavItem
  },

  data() {
    return {
      userInfo: kindo.cache.get(user.USER_INFO),

      userCenter: false,

      collapse: false,
      collapseNav: false,

      rootMenus: [],
      subMenus: [],
      subMenusOpeneds: []
    }
  },

  computed: {
    asideWidth() {
      return this.collapse ? '64px' : '220px'
    }
  },

  watch: {
    $route: {
      handler: function() {
        // 设定展开菜单
        const subKey = this.$route.path.split('/')[2]

        if (!subKey) {
          return
        }

        const getDefaultOpeneds = (menus, id, array = []) => {
          const tempMenu = menus.find(menu => menu.id === id)

          if (tempMenu && tempMenu.pid) {
            array.push(tempMenu.pid)
            return getDefaultOpeneds(menus, tempMenu.pid, array)
          } else {
            return array
          }
        }

        const opends = getDefaultOpeneds(kindo.cache.get(user.USER_MENU), subKey)

        this.subMenusOpeneds = opends
      },
      immediate: true
    },

    collapse() {
      this.subMenusOpeneds = this.subMenusOpeneds.concat([])

      // 选中菜单
      setTimeout(() => {
        const subPath = this.$route.path.split('/')[2]
        this.menuClick(subPath)
      }, 500)
    }
  },

  created() {
    this.rootMenus = kindo.cache.get(user.USER_MENU_TREE)

    this.$nextTick(function() {
      const rootPath = this.$route.fullPath.split('/')[1]
      if (this.$el.querySelectorAll(`[router="${rootPath}"]`)[0]) {
        this.$el.querySelectorAll(`[router="${rootPath}"]`)[0].click()
      } else {
        this.$el.querySelectorAll('.header .el-menu-item')[0].click()
      }
    })
  },

  mounted() {
    this.$nextTick(function() {
      let navWidth = 0
      const logoWidth = this.$el.querySelector('.logo').clientWidth
      const controlWidth = this.$el.querySelector('.control').clientWidth
      const navItems = this.$el.querySelectorAll('.nav .el-menu-item')

      for (let i = 0; i < navItems.length; ++i) {
        navWidth = navItems[i].clientWidth + navWidth
      }

      const debounceNav = debounce(() => {
        // 自适应菜单
        this.collapse = this.$el.clientWidth <= 1200
        this.collapseNav = this.$el.clientWidth * 0.83 - logoWidth - controlWidth < navWidth
      }, 300)

      erd.listenTo(this.$el, debounceNav)
      debounceNav()
    })
  },

  methods: {
    rootMenuSelect(key) {
      const menus = this.rootMenus.find(item => item.id === key)

      if (menus && menus.children && menus.children.length > 0) {
        this.subMenus = menus.children
        this.rootPath = key

        this.$nextTick(function() {
          const subPath = this.$route.path.split('/')[2]
          if (this.$el.querySelector(`[router='${subPath}']`)) {
            this.$el.querySelector(`[router='${subPath}']`).click()
          } else {
            this.$el.querySelectorAll('.aside .el-menu-item')[0].click()
          }
        })
      } else {
        // 只有根菜单
      }
    },

    subMenuSelect(key) {
      this.subPath = key

      this.$router.push(`/${this.rootPath}/${this.subPath}`)
    },

    menuClick(key) {
      if (this.$el.querySelector(`[router='${key}']`)) {
        this.$el.querySelector(`[router='${key}']`).click()
      }
    },

    signOut() {
      kindo.cache.clear()
      this.$router.push('/login')
    },

    showUserCenter() {
      this.userCenter = true
    },

    hideUserCenter() {
      this.userCenter = false
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  background: #f2f3f8;
  width: 100vw;
  height: 100vh;

  .aside {
    position: relative;
    transition: all 0.3s cubic-bezier(0.8, 0.1, 0.1, 0.8);
    overflow: hidden;

    /deep/ .el-menu-item:hover,
    /deep/ .el-menu-item:focus,
    /deep/ .el-menu-item.is-active {
      background-color: #1f2329 !important;
      font-weight: bold;
    }

    .logo {
      background-color: #3a4a5e;
      background-image: linear-gradient(143deg, #3a4a5e 30%, #3a4a5e 30%, #3a4a5e);
      padding-left: 15px;
      height: 64px;
      line-height: 64px;
      img,
      h1 {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        height: 32px;
      }
      h1 {
        color: #fff;
        font-size: 20px;
        margin: 0 0 0 12px;
        font-weight: 600;
        width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .nav {
      min-height: 100vh;
      &:not(.el-menu--collapse) {
        width: 220px;
      }
      &.el-menu--collapse {
        /deep/ .nav-icon {
          font-size: 20px;
        }
      }
    }
  }
  .header {
    height: 64px;
    padding: 0 10px 0 0;
    background: #fff;
    box-shadow: 0 1px 2px 0 #dde4e7, 0 1px 2px 0 #e5ecf0, 0 1px 2px 0 #e5ecf0;
    position: relative;

    .el-menu--horizontal > .el-menu-item.is-active {
      font-weight: bold;
    }

    .action {
      font-size: 16px;
      line-height: 64px;
      cursor: pointer;
      transition: all 0.3s, padding 0s;
      padding: 0 24px;
      &:hover {
        background: #e6f7ff;
      }
    }
    .nav,
    .control {
      display: flex;
      font-size: 20px;
      height: 62px;
      line-height: 62px;
      cursor: pointer;
      transition: all 0.3s, padding 0s;
    }
    .nav {
      .el-menu--horizontal > .el-menu-item {
        height: 62px;
        line-height: 62px;
      }
    }
    .user {
      text-align: right;
      .action {
        color: #01bdd6;
        padding: 0 12px;
      }
    }
  }
}
</style>
