import request from '@/utils/request'

export function getProject(listQuery) {
  let url = `/api/weekly/project/get-weekly-project?page=${
    listQuery.page
  }&page_size=${listQuery.pageSize}&order_by=${listQuery.order}`

  if (listQuery.search.length > 0) {
    url += `&project_name=${listQuery.search}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function createProject(data) {
  return request({
    url: `/api/weekly/project/add-weekly-project`,
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: `/api/weekly/project/update-weekly-project`,
    method: 'put',
    data
  })
}

export function deleteProject(project_id) {
  return request({
    url: `/api/weekly/project/del-weekly-project?project_id=${project_id}`,
    method: 'delete'
  })
}

export function getProjectInfo() {
  const url = `/api/weekly/project/get-weekly-project?page=1&page_size=100&order_by=id`

  return request({
    url: url,
    method: 'get'
  })
}
