// 地图配置文件
// 请在腾讯位置服务申请Key：https://lbs.qq.com/

module.exports = {
  // 腾讯地图API Key
  // 申请步骤：
  // 1. 访问 https://lbs.qq.com/
  // 2. 注册并登录
  // 3. 创建应用（选择微信小程序类型）
  // 4. 获取Key并填写在下方
  qqmapKey: 'YOUR_TENCENT_MAP_KEY_HERE',
  
  // 是否使用真实地图API（已废弃，现在自动检测）
  // 如果配置了有效的Key，自动使用真实API
  // 如果未配置Key，提示用户配置
  useRealAPI: true,
  
  // 默认搜索配置
  defaultConfig: {
    radius: 2000, // 默认搜索半径（米）
    pageSize: 20, // 每页结果数
    autoSearch: false // 是否自动搜索（改为false，需要用户手动点击）
  }
};
