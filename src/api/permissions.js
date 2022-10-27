import request from '@/utils/request'

export function getPermissionsInfo() {
  return request({
    url: `/api/system/info/get-api`,
    method: 'get'
  })
}
