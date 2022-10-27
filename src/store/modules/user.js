import { login, getUserInfo, updateInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  account: '',
  user_name: '',
  avatar: '',
  roles: [],
  date_joined: '',
  phone: '',
  email: '',
  remarks: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_NAME: (state, user_name) => {
    state.user_name = user_name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_DATEJOINED: (state, date_joined) => {
    state.date_joined = date_joined
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_REMARKS: (state, remarks) => {
    state.remarks = remarks
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), password: password }).then(response => {
        const { access_token } = response
        commit('SET_TOKEN', access_token)
        commit('SET_USER_NAME', username)
        setToken(access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.name).then(response => {
        if (!response) {
          reject('获取用户信息失败.')
        }
        const { roles, user_name, create_time, account, email, phone, remarks } = response.detail

        // 根据后端接口获取role
        const roleNames = []
        roles.forEach(element => {
          roleNames.push(element.role_name)
        })
        // roles must be a non-empty array
        if (!roleNames || roleNames.length <= 0) {
          reject('账号无权限登录')
        }

        commit('SET_ROLES', roleNames)
        commit('SET_USER_NAME', user_name)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_DATEJOINED', create_time)
        commit('SET_ACCOUNT', account)
        commit('SET_PHONE', phone)
        commit('SET_EMAIL', email)
        commit('SET_REMARKS', remarks)
        resolve(response.detail)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 更新个人信息
  updateInfo({ commit, state }, userInfoForm) {
    return new Promise((resolve, reject) => {
      updateInfo(state.username, userInfoForm).then(response => {
        if (!response) {
          reject('更新用户信息失败.')
        }
        commit('SET_USER_NAME', userInfoForm.user_name)
        commit('SET_PHONE', userInfoForm.phone)
        commit('SET_EMAIL', userInfoForm.email)
        resolve(response.detail)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
