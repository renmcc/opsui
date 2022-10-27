import request from '@/utils/request'

export function getRoles(listQuery) {
  let url
  if (listQuery.search.length > 0) {
    url = `/api/system/role/get-role?role_name=${listQuery.search}&page=${
      listQuery.page
    }&page_size=${listQuery.pageSize}&order_by=${listQuery.order}`
  } else {
    url = `/api/system/role/get-role?page=${listQuery.page}&page_size=${
      listQuery.pageSize
    }&order_by=${listQuery.order}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function createGroup(data) {
  return request({
    url: `/api/system/role/add-role`,
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: `/api/system/role/update-role`,
    method: 'put',
    data
  })
}

export function deleteGroup(role_id) {
  return request({
    url: `/api/system/role/del-role?role_id=${role_id}`,
    method: 'delete'
  })
}

export function getGroupsInfo() {
  return request({
    url: `api/system/role/get-role?page=1&page_size=100&order_by=id`,
    method: 'get'
  })
}

