import request from '@/utils/request'

export function getLoginLog(listQuery) {
  let url = `/api/system/log/login-log?page=${listQuery.page}&page_size=${
    listQuery.pageSize
  }&order_by=${listQuery.order}`

  if (listQuery.datetimeValue == null) {
    listQuery.datetimeValue = []
  }
  if (listQuery.search.length > 0) {
    url += `&account=${listQuery.search}`
  }

  if (listQuery.datetimeValue.length > 0) {
    url += `&time_start=${listQuery.datetimeValue[0]}&time_end=${
      listQuery.datetimeValue[1]
    }`
  }

  return request({
    url: url,
    method: 'get'
  })
}
