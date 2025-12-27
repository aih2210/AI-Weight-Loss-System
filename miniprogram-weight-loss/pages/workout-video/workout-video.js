// pages/workout-video/workout-video.js
const app = getApp();

Page({
  data: {
    plan: null,
    currentActivityIndex: 0,
    currentActivity: null,
    isPlaying: false,
    isPaused: false,
    timer: null,
    remainingTime: 0,
    totalTime: 0,
    completedActivities: [],
    
    // 视频库
    videoLibrary: {
      '热身': {
        videoUrl: 'https://example.com/warmup.mp4', // 实际使用时替换为真实视频URL
        thumbnail: 'https://example.com/warmup-thumb.jpg',
        duration: 300, // 5分钟
        description: '动态拉伸，活动全身关节',
        tips: [
          '动作幅度由小到大',
          '保持呼吸顺畅',
          '感觉身体逐渐发热'
        ]
      },
      '快走': {
        videoUrl: 'https://example.com/walking.mp4',
        thumbnail: 'https://example.com/walking-thumb.jpg',
        duration: 1200, // 20分钟
        description: '保持中等速度快走',
        tips: [
          '摆臂自然',
          '步伐均匀',
          '保持心率在120-140'
        ]
      },
      '慢跑': {
        videoUrl: 'https://example.com/jogging.mp4',
        thumbnail: 'https://example.com/jogging-thumb.jpg',
        duration: 1200,
        description: '匀速慢跑，保持节奏',
        tips: [
          '前脚掌着地',
          '身体微微前倾',
          '呼吸节奏2-2或3-3'
        ]
      },
      '跑步': {
        videoUrl: 'https://example.com/running.mp4',
        thumbnail: 'https://example.com/running-thumb.jpg',
        duration: 900,
        description: '中等配速跑步',
        tips: [
          '保持核心稳定',
          '手臂自然摆动',
          '注意呼吸节奏'
        ]
      },
      '跳绳': {
        videoUrl: 'https://example.com/rope.mp4',
        thumbnail: 'https://example.com/rope-thumb.jpg',
        duration: 600,
        description: '间歇跳绳训练',
        tips: [
          '用手腕发力',
          '膝盖微屈',
          '跳30秒休息10秒'
        ]
      },
      '深蹲': {
        videoUrl: 'https://example.com/squat.mp4',
        thumbnail: 'https://example.com/squat-thumb.jpg',
        duration: 600,
        description: '标准深蹲动作',
        tips: [
          '膝盖不超过脚尖',
          '臀部向后坐',
          '保持背部挺直',
          '下蹲至大腿与地面平行'
        ]
      },
      '俯卧撑': {
        videoUrl: 'https://example.com/pushup.mp4',
        thumbnail: 'https://example.com/pushup-thumb.jpg',
        duration: 600,
        description: '标准俯卧撑',
        tips: [
          '身体保持一条直线',
          '手臂与肩同宽',
          '胸部接近地面',
          '初学者可跪姿'
        ]
      },
      '平板支撑': {
        videoUrl: 'https://example.com/plank.mp4',
        thumbnail: 'https://example.com/plank-thumb.jpg',
        duration: 300,
        description: '核心力量训练',
        tips: [
          '肘关节在肩下方',
          '身体成一条直线',
          '收紧核心',
          '不要塌腰或撅臀'
        ]
      },
      '卷腹': {
        videoUrl: 'https://example.com/crunch.mp4',
        thumbnail: 'https://example.com/crunch-thumb.jpg',
        duration: 600,
        description: '腹部训练',
        tips: [
          '下背部贴地',
          '用腹部发力',
          '不要用手拉头',
          '呼气时卷起'
        ]
      },
      '弓步蹲': {
        videoUrl: 'https://example.com/lunge.mp4',
        thumbnail: 'https://example.com/lunge-thumb.jpg',
        duration: 600,
        description: '腿部力量训练',
        tips: [
          '前膝不超脚尖',
          '后膝接近地面',
          '保持上身直立',
          '左右交替进行'
        ]
      },
      '臀桥': {
        videoUrl: 'https://example.com/bridge.mp4',
        thumbnail: 'https://example.com/bridge-thumb.jpg',
        duration: 600,
        description: '臀部和核心训练',
        tips: [
          '肩膀贴地',
          '臀部发力抬起',
          '顶峰收缩2秒',
          '缓慢下放'
        ]
      },
      '拉伸放松': {
        videoUrl: 'https://example.com/stretch.mp4',
        thumbnail: 'https://example.com/stretch-thumb.jpg',
        duration: 300,
        description: '全身拉伸放松',
        tips: [
          '动作缓慢',
          '保持15-30秒',
          '感受肌肉拉伸',
          '不要憋气'
        ]
      }
    }
  },

  onLoad(options) {
    if (options.plan) {
      try {
        const plan = JSON.parse(decodeURIComponent(options.plan));
        const totalTime = plan.activities.reduce((sum, a) => sum + (a.duration * 60), 0);
        
        this.setData({
          plan,
          totalTime,
          currentActivity: plan.activities[0],
          remainingTime: plan.activities[0].duration * 60
        });
      } catch (error) {
        console.error('解析计划失败:', error);
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      }
    }
  },

  onUnload() {
    this.stopTimer();
  },

  // 开始训练
  startWorkout() {
    this.setData({
      isPlaying: true,
      isPaused: false
    });
    
    this.startTimer();
    
    wx.showToast({
      title: '开始训练！',
      icon: 'success'
    });
  },

  // 暂停训练
  pauseWorkout() {
    this.setData({
      isPaused: true
    });
    
    this.stopTimer();
    
    wx.showToast({
      title: '已暂停',
      icon: 'none'
    });
  },

  // 继续训练
  resumeWorkout() {
    this.setData({
      isPaused: false
    });
    
    this.startTimer();
    
    wx.showToast({
      title: '继续训练',
      icon: 'success'
    });
  },

  // 启动计时器
  startTimer() {
    this.stopTimer();
    
    this.data.timer = setInterval(() => {
      let remainingTime = this.data.remainingTime - 1;
      
      if (remainingTime <= 0) {
        // 当前动作完成
        this.completeCurrentActivity();
      } else {
        this.setData({ remainingTime });
      }
    }, 1000);
  },

  // 停止计时器
  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.data.timer = null;
    }
  },

  // 完成当前动作
  completeCurrentActivity() {
    const { currentActivityIndex, plan, completedActivities } = this.data;
    
    // 标记当前动作完成
    completedActivities.push(currentActivityIndex);
    
    // 检查是否还有下一个动作
    if (currentActivityIndex < plan.activities.length - 1) {
      // 进入下一个动作
      const nextIndex = currentActivityIndex + 1;
      const nextActivity = plan.activities[nextIndex];
      
      this.setData({
        currentActivityIndex: nextIndex,
        currentActivity: nextActivity,
        remainingTime: nextActivity.duration * 60,
        completedActivities
      });
      
      wx.showModal({
        title: '动作完成！',
        content: `下一个动作：${nextActivity.name}\n${nextActivity.description}`,
        confirmText: '开始',
        cancelText: '休息',
        success: (res) => {
          if (res.confirm) {
            this.startTimer();
          } else {
            this.pauseWorkout();
          }
        }
      });
    } else {
      // 所有动作完成
      this.finishWorkout();
    }
  },

  // 完成训练
  finishWorkout() {
    this.stopTimer();
    
    const { plan } = this.data;
    
    wx.showModal({
      title: '🎉 训练完成！',
      content: `太棒了！你完成了今天的训练！\n\n总时长：${plan.totalTime}分钟\n消耗：${plan.totalCalories}卡`,
      confirmText: '记录',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          // 记录运动
          this.saveWorkoutLog();
        } else {
          wx.navigateBack();
        }
      }
    });
  },

  // 保存运动记录
  saveWorkoutLog() {
    const { plan } = this.data;
    
    app.addExerciseLog({
      name: `${plan.day} - ${plan.focus}`,
      duration: plan.totalTime,
      calories: plan.totalCalories,
      type: 'plan',
      activities: plan.activities.map(a => a.name).join('、')
    });
    
    wx.showToast({
      title: '已记录',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    });
  },

  // 跳过当前动作
  skipActivity() {
    wx.showModal({
      title: '跳过动作',
      content: '确定要跳过当前动作吗？',
      success: (res) => {
        if (res.confirm) {
          this.completeCurrentActivity();
        }
      }
    });
  },

  // 查看动作详情
  viewActivityDetail() {
    const { currentActivity, videoLibrary } = this.data;
    const videoInfo = videoLibrary[currentActivity.name];
    
    if (!videoInfo) {
      wx.showToast({
        title: '暂无详情',
        icon: 'none'
      });
      return;
    }
    
    let content = `${videoInfo.description}\n\n💡 动作要点：\n`;
    videoInfo.tips.forEach((tip, index) => {
      content += `${index + 1}. ${tip}\n`;
    });
    
    wx.showModal({
      title: currentActivity.name,
      content: content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 播放视频
  playVideo() {
    const { currentActivity, videoLibrary } = this.data;
    const videoInfo = videoLibrary[currentActivity.name];
    
    if (!videoInfo || !videoInfo.videoUrl) {
      wx.showToast({
        title: '暂无视频',
        icon: 'none'
      });
      return;
    }
    
    // 暂停计时
    if (this.data.isPlaying && !this.data.isPaused) {
      this.pauseWorkout();
    }
    
    // 播放视频（这里使用模拟，实际应该使用video组件）
    wx.showModal({
      title: '视频教学',
      content: `正在播放：${currentActivity.name}\n\n${videoInfo.description}`,
      confirmText: '继续训练',
      success: (res) => {
        if (res.confirm && this.data.isPaused) {
          this.resumeWorkout();
        }
      }
    });
  },

  // 格式化时间
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  // 退出训练
  exitWorkout() {
    wx.showModal({
      title: '退出训练',
      content: '确定要退出吗？当前进度不会保存。',
      success: (res) => {
        if (res.confirm) {
          this.stopTimer();
          wx.navigateBack();
        }
      }
    });
  }
});
