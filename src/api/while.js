import request from '@/utils/request'

export function getWhile(listQuery) {
  let url
  if (listQuery.search.length > 0) {
    url = `/api/system/while/get-while?while_ip=${listQuery.search}&page=${
      listQuery.page
    }&page_size=${listQuery.pageSize}&order_by=${listQuery.order}`
  } else {
    url = `/api/system/while/get-while?page=${listQuery.page}&page_size=${
      listQuery.pageSize
    }&order_by=${listQuery.order}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function createWhile(data) {
  return request({
    url: `/api/system/while/add-while`,
    method: 'post',
    data
  })
}

export function updateWhile(data) {
  return request({
    url: `/api/system/while/update-while`,
    method: 'put',
    data
  })
}

export function deleteWhile(while_id) {
  return request({
    url: `/api/system/while/del-while?while_id=${while_id}`,
    method: 'delete'
  })
}
