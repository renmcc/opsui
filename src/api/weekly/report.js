import request from '@/utils/request'

export function getReport(listQuery) {
  let url = `/api/weekly/report/get-weekly-report?page=${
    listQuery.page
  }&page_size=${listQuery.pageSize}&order_by=${listQuery.order}`

  if (listQuery.search.length > 0) {
    url += `&creater=${listQuery.search}`
  }

  // 过滤创建时间
  if (listQuery.datetimeValue == null) {
    listQuery.datetimeValue = []
  }

  if (listQuery.datetimeValue.length > 0) {
    url += `&create_start_time=${listQuery.datetimeValue[0]}&create_end_time=${
      listQuery.datetimeValue[1]
    }`
  }

  // 过滤操作时间
  if (listQuery.startTimeValue == null) {
    listQuery.startTimeValue = []
  }

  if (listQuery.startTimeValue.length > 0) {
    url += `&start_time=${listQuery.startTimeValue[0]}&end_time=${
      listQuery.startTimeValue[1]
    }`
  }

  // 过滤申请人
  if (listQuery.applicant.length > 0) {
    url += `&applicant=${listQuery.applicant}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function createReport(data) {
  return request({
    url: `/api/weekly/report/add-weekly-report`,
    method: 'post',
    data
  })
}

export function updateReport(data) {
  return request({
    url: `/api/weekly/report/update-weekly-report`,
    method: 'put',
    data
  })
}

export function deleteReport(report_id) {
  return request({
    url: `/api/weekly/report/del-weekly-report?report_id=${report_id}`,
    method: 'delete'
  })
}

export function createReports(data) {
  return request({
    url: `/api/weekly/report/add-weekly-reports`,
    method: 'post',
    data
  })
}
