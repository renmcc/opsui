const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  user_name: state => state.user.user_name,
  account: state => state.user.account,
  email: state => state.user.email,
  date_joined: state => state.user.date_joined,
  phone: state => state.user.phone,
  position: state => state.user.position,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
