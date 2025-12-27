// pages/medication/medication.js
const app = getApp();

Page({
  data: {
    medications: [],
    showModal: false,
    medName: '',
    dosage: '',
    frequency: '',
    purpose: '',
    sideEffects: '',
    // 药物与减重的关系数据库
    medicationDatabase: {
      '降压药': {
        avoidFoods: ['高盐食物', '咖啡', '酒精', '西柚'],
        avoidExercise: ['剧烈运动', '高强度间歇训练'],
        suggestions: '服用降压药期间要控制盐分摄入，避免剧烈运动导致血压波动'
      },
      '降糖药': {
        avoidFoods: ['高糖食物', '精制碳水', '含糖饮料'],
        avoidExercise: ['空腹运动'],
        suggestions: '服用降糖药期间要特别注意血糖监测，运动前后要适当补充食物'
      },
      '甲状腺药': {
        avoidFoods: ['豆制品', '高纤维食物', '钙补充剂'],
        avoidExercise: [],
        suggestions: '甲状腺药物需空腹服用，服药后1小时内避免进食'
      },
      '抗抑郁药': {
        avoidFoods: ['酒精', '咖啡因', '高糖食物'],
        avoidExercise: [],
        suggestions: '部分抗抑郁药可能影响食欲和体重，需要特别注意饮食控制'
      },
      '激素类药物': {
        avoidFoods: ['高盐食物', '高糖食物'],
        avoidExercise: [],
        suggestions: '激素类药物可能导致水肿和体重增加，需要严格控制饮食'
      }
    }
  },

  onLoad() {
    this.loadMedications();
  },

  onShow() {
    this.loadMedications();
  },

  loadMedications() {
    const userData = app.getData();
    this.setData({
      medications: userData.medications || []
    });
  },

  showAddModal() {
    this.setData({
      showModal: true
    });
  },

  hideModal() {
    this.setData({
      showModal: false,
      medName: '',
      dosage: '',
      frequency: '',
      purpose: '',
      sideEffects: ''
    });
  },

  stopPropagation() {},

  onMedNameInput(e) {
    this.setData({
      medName: e.detail.value
    });
  },

  onDosageInput(e) {
    this.setData({
      dosage: e.detail.value
    });
  },

  onFrequencyInput(e) {
    this.setData({
      frequency: e.detail.value
    });
  },

  onPurposeInput(e) {
    this.setData({
      purpose: e.detail.value
    });
  },

  onSideEffectsInput(e) {
    this.setData({
      sideEffects: e.detail.value
    });
  },

  saveMedication() {
    const { medName, dosage, frequency, purpose } = this.data;
    
    if (!medName || !dosage || !frequency) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 分析药物影响
    const analysis = this.analyzeMedication(medName, purpose);

    const userData = app.getData();
    if (!userData.medications) {
      userData.medications = [];
    }

    userData.medications.push({
      id: Date.now(),
      name: medName,
      dosage,
      frequency,
      purpose,
      sideEffects: this.data.sideEffects,
      analysis,
      addedDate: new Date().toLocaleDateString()
    });

    app.saveData(userData);

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });

    this.hideModal();
    this.loadMedications();
  },

  analyzeMedication(medName, purpose) {
    const { medicationDatabase } = this.data;
    
    // 简单匹配药物类型
    for (const [type, info] of Object.entries(medicationDatabase)) {
      if (medName.includes(type.replace('药', '')) || purpose.includes(type.replace('药', ''))) {
        return {
          type,
          avoidFoods: info.avoidFoods,
          avoidExercise: info.avoidExercise,
          suggestions: info.suggestions
        };
      }
    }

    return {
      type: '其他',
      avoidFoods: [],
      avoidExercise: [],
      suggestions: '建议咨询医生了解药物对减重的影响'
    };
  },

  viewDetail(e) {
    const med = e.currentTarget.dataset.med;
    let content = `💊 ${med.name}\n📋 用法：${med.dosage}，${med.frequency}\n🎯 用途：${med.purpose}\n\n`;
    
    if (med.analysis && med.analysis.avoidFoods.length > 0) {
      content += `⚠️ 避免食物：\n${med.analysis.avoidFoods.join('、')}\n\n`;
    }
    
    if (med.analysis && med.analysis.avoidExercise.length > 0) {
      content += `⚠️ 避免运动：\n${med.analysis.avoidExercise.join('、')}\n\n`;
    }
    
    if (med.analysis && med.analysis.suggestions) {
      content += `💡 建议：\n${med.analysis.suggestions}`;
    }

    wx.showModal({
      title: '用药详情',
      content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  deleteMedication(e) {
    const index = e.currentTarget.dataset.index;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条用药记录吗？',
      success: (res) => {
        if (res.confirm) {
          const userData = app.getData();
          userData.medications.splice(index, 1);
          app.saveData(userData);
          
          this.loadMedications();
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  }
});
