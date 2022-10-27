import request from '@/utils/request'

export function getHandleType(listQuery) {
  let url = `/api/weekly/type/get-weekly-type?page=${
    listQuery.page
  }&page_size=${listQuery.pageSize}&order_by=${listQuery.order}`

  if (listQuery.search.length > 0) {
    url += `&type_name=${listQuery.search}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function createHandleType(data) {
  return request({
    url: `/api/weekly/type/add-weekly-type`,
    method: 'post',
    data
  })
}

export function updateHandleType(data) {
  return request({
    url: `/api/weekly/type/update-weekly-type`,
    method: 'put',
    data
  })
}

export function deleteHandleType(type_id) {
  return request({
    url: `/api/weekly/type/del-weekly-type?type_id=${type_id}`,
    method: 'delete'
  })
}

export function getHandleTypeInfo() {
  const url = `/api/weekly/type/get-weekly-type?page=1&page_size=100&order_by=id`

  return request({
    url: url,
    method: 'get'
  })
}
