// pages/device-management/device-management.js
const app = getApp();

Page({
  data: {
    connectedDevices: [],
    availableDevices: [],
    scanning: false,
    showAddModal: false,
    deviceTypes: [
      { name: 'Apple Watch', icon: '⌚', type: 'watch', supported: true },
      { name: '小米手环', icon: '📿', type: 'band', supported: true },
      { name: '华为手环', icon: '⌚', type: 'band', supported: true },
      { name: '智能体重秤', icon: '⚖️', type: 'scale', supported: true },
      { name: '血压计', icon: '🩺', type: 'bp', supported: false },
      { name: '血糖仪', icon: '💉', type: 'glucose', supported: false }
    ]
  },

  onLoad() {
    this.loadConnectedDevices();
  },

  loadConnectedDevices() {
    const userData = app.getData();
    const devices = userData.connectedDevices || [];
    
    this.setData({
      connectedDevices: devices
    });
  },

  showAddDevice() {
    this.setData({
      showAddModal: true
    });
  },

  hideModal() {
    this.setData({
      showAddModal: false,
      scanning: false,
      availableDevices: []
    });
  },

  stopPropagation() {},

  scanDevices() {
    this.setData({
      scanning: true,
      availableDevices: []
    });

    wx.showLoading({
      title: '扫描中...'
    });

    // 模拟蓝牙扫描
    setTimeout(() => {
      const mockDevices = [
        { id: 1, name: '小米手环 6', type: 'band', rssi: -45, battery: 85 },
        { id: 2, name: 'Apple Watch Series 7', type: 'watch', rssi: -52, battery: 92 },
        { id: 3, name: '华为手环 7', type: 'band', rssi: -68, battery: 78 }
      ];

      wx.hideLoading();
      
      this.setData({
        scanning: false,
        availableDevices: mockDevices
      });

      if (mockDevices.length === 0) {
        wx.showToast({
          title: '未发现设备',
          icon: 'none'
        });
      }
    }, 2000);
  },

  connectDevice(e) {
    const device = e.currentTarget.dataset.device;
    
    wx.showLoading({
      title: '连接中...'
    });

    // 模拟连接过程
    setTimeout(() => {
      wx.hideLoading();

      const userData = app.getData();
      if (!userData.connectedDevices) {
        userData.connectedDevices = [];
      }

      // 检查是否已连接
      const exists = userData.connectedDevices.find(d => d.id === device.id);
      if (exists) {
        wx.showToast({
          title: '设备已连接',
          icon: 'none'
        });
        return;
      }

      // 添加设备
      userData.connectedDevices.push({
        ...device,
        connectedAt: new Date().toLocaleString(),
        lastSync: new Date().toLocaleString()
      });

      app.saveData(userData);

      wx.showToast({
        title: '连接成功',
        icon: 'success'
      });

      this.hideModal();
      this.loadConnectedDevices();
    }, 1500);
  },

  syncDevice(e) {
    const index = e.currentTarget.dataset.index;
    const device = this.data.connectedDevices[index];

    wx.showLoading({
      title: '同步中...'
    });

    // 模拟同步过程
    setTimeout(() => {
      wx.hideLoading();

      // 更新同步时间
      const userData = app.getData();
      userData.connectedDevices[index].lastSync = new Date().toLocaleString();
      app.saveData(userData);

      this.loadConnectedDevices();

      wx.showToast({
        title: '同步成功',
        icon: 'success'
      });
    }, 1500);
  },

  disconnectDevice(e) {
    const index = e.currentTarget.dataset.index;
    const device = this.data.connectedDevices[index];

    wx.showModal({
      title: '断开连接',
      content: `确定要断开 ${device.name} 吗？`,
      success: (res) => {
        if (res.confirm) {
          const userData = app.getData();
          userData.connectedDevices.splice(index, 1);
          app.saveData(userData);

          this.loadConnectedDevices();

          wx.showToast({
            title: '已断开连接',
            icon: 'success'
          });
        }
      }
    });
  },

  viewDeviceDetail(e) {
    const device = e.currentTarget.dataset.device;
    
    wx.showModal({
      title: device.name,
      content: `类型：${device.type}\n电量：${device.battery}%\n信号：${device.rssi} dBm\n连接时间：${device.connectedAt}\n最后同步：${device.lastSync}`,
      showCancel: false
    });
  }
});
