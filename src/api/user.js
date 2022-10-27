import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/system/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo(name) {
  return request({
    url: `/api/system/user/get-self`,
    method: 'get'
  })
}

export function getUsers(listQuery) {
  let url
  if (listQuery.search.length > 0) {
    url = `/api/system/user/get-user?account=${listQuery.search}&page=${
      listQuery.page
    }&page_size=${listQuery.pageSize}&order_by=${listQuery.order}`
  } else {
    url = `/api/system/user/get-user?page=${listQuery.page}&page_size=${
      listQuery.pageSize
    }&order_by=${listQuery.order}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function updateInfo(name, data) {
  return request({
    url: `api/system/user/update-self`,
    method: 'put',
    data
  })
}

export function changePassword(data) {
  return request({
    url: `/api/system/user/reset-selfpasswd`,
    method: 'put',
    data
  })
}

export function postUserInfo(data) {
  return request({
    url: `/api/system/user/add-user`,
    method: 'post',
    data
  })
}

export function updateUserInfo(data) {
  return request({
    url: `/api/system/user/update-user`,
    method: 'put',
    data
  })
}

export function deleteUserInfo(data) {
  return request({
    url: `/api/system/user/del-user`,
    method: 'delete',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
