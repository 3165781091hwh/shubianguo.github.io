// 页面1脚本 - 药品集采深度解析页面
(function() {
    'use strict';
    
    // 获取必要的DOM元素
    const wordcloudContainer = document.getElementById('wordcloud-container');
    
    // 检查必要元素是否存在
    if (!wordcloudContainer) {
        console.warn('词云容器未找到');
        return;
    }
    
    // 词云数据
    const wordData = [
        { name: '仿制', value: 595 }, { name: '医保', value: 485 }, { name: '医院', value: 469 },
        { name: '医生', value: 396 }, { name: '原研药', value: 381 }, { name: '问题', value: 284 },
        { name: '效果', value: 217 }, { name: '医疗', value: 182 }, { name: '患者', value: 180 },
        { name: '没有', value: 169 }, { name: '药品', value: 153 }, { name: '价格', value: 144 },
        { name: '国产', value: 138 }, { name: '报销', value: 129 }, { name: '药效', value: 123 },
        { name: '药物', value: 121 }, { name: '便宜', value: 137 }, { name: '保险', value: 115 },
        { name: '现在', value: 100 }, { name: '质量', value: 101 }, { name: '视频', value: 101 },
        { name: '病人', value: 112 }, { name: '自费', value: 94 }, { name: '医改', value: 75 },
        { name: 'DRG', value: 73 }, { name: '住院', value: 80 }, { name: '评价', value: 80 },
        { name: '一致性', value: 80 }, { name: '可能', value: 79 }, { name: '需要', value: 75 },
        { name: '只能', value: 74 }, { name: '三明', value: 74 }, { name: '不能', value: 72 },
        { name: '成本', value: 89 }, { name: '选择', value: 71 }, { name: '副作用', value: 67 },
        { name: '中成药', value: 66 }, { name: '疗效', value: 75 }, { name: '还有', value: 63 },
        { name: '觉得', value: 62 }, { name: '应该', value: 62 }, { name: '时候', value: 62 },
        { name: '进口', value: 88 }, { name: 'doge', value: 62 }, { name: '看病', value: 76 },
        { name: '大家', value: 96 }, { name: '国内', value: 71 }, { name: '国家', value: 80 },
        { name: '数据', value: 68 }, { name: '药店', value: 68 }, { name: '研发', value: 49 },
        { name: '监管', value: 49 }, { name: '生产', value: 49 }, { name: '出来', value: 45 },
        { name: '工艺', value: 45 }, { name: '改革', value: 45 }, { name: '确实', value: 45 },
        { name: '阿司匹林', value: 44 }, { name: '导致', value: 43 }, { name: '不会', value: 42 },
        { name: 'drg', value: 42 }, { name: '其他', value: 42 }, { name: '开始', value: 41 },
        { name: '药厂', value: 52 }, { name: '知道', value: 38 }, { name: '厂家', value: 38 },
        { name: '医药', value: 38 }, { name: '公司', value: 74 }, { name: '不同', value: 46 },
        { name: '要求', value: 36 }, { name: '企业', value: 36 }, { name: '有些', value: 36 },
        { name: '临床', value: 48 }, { name: '收入', value: 36 }, { name: '影响', value: 61 },
        { name: '不知道', value: 34 }, { name: '治疗', value: 76 }, { name: '控制', value: 32 },
        { name: '不到', value: 32 }, { name: '作为', value: 32 }, { name: '不行', value: 32 },
        { name: '使用', value: 32 }, { name: '中药', value: 40 }, { name: '根本', value: 50 },
        { name: '中国', value: 50 }, { name: '保证', value: 31 }, { name: '肯定', value: 31 },
        { name: '手术', value: 64 }, { name: '标准', value: 43 }, { name: '时间', value: 46 },
        { name: '辅料', value: 30 }, { name: '专利', value: 30 }, { name: '保险公司', value: 30 }
    ];
    
    // 初始化词云图
    function initWordCloud() {
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.warn('ECharts库未加载，等待加载完成...');
            setTimeout(initWordCloud, 100);
            return;
        }
        
        // 检查词云插件是否已加载
        if (typeof echarts.registerTransform === 'undefined') {
            console.warn('ECharts词云插件未加载，等待加载完成...');
            setTimeout(initWordCloud, 100);
            return;
        }
        
        try {
            // 初始化图表
            const myChart = echarts.init(wordcloudContainer);
            
            // 配置选项
            const option = {
                tooltip: {
                    show: true,
                    formatter: '{b} ({c})', // 格式化提示：名称 (频率)
                    backgroundColor: 'rgba(50,50,50,0.7)',
                    borderColor: '#ccc',
                    borderWidth: 1,
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [{
                    type: 'wordCloud',
                    // 词语大小范围，拉开差距，增强对比
                    sizeRange: [15, 120],
                    
                    // 所有词语水平排列，更显规整
                    rotationRange: [0, 0],
                    rotationStep: 0,
                    
                    // 词语间距，调整为更合适的值，确保圆形布局美观
                    gridSize: 12,
                    
                    // 设置词云形状为正圆形，避免鸡蛋形状和重叠问题
                    shape: 'circle',
                    
                    // 不允许词语超出画布边界，避免重叠涂抹
                    drawOutOfBound: false,
                    
                    // 设置词云布局的宽高比，确保是正圆形
                    width: '100%',
                    height: '100%',
                    
                    textStyle: {
                        fontWeight: 'bold',
                        // 升级的色彩方案
                        color: function (params) {
                            // params.value 是词频
                            // params.dataIndex 是数据索引
                            const value = params.value;
                            if (value > 300) {
                                // 核心词 (医保, 医院, 医生, 仿制, 原研药) - 高亮科技蓝
                                return '#01BAEF'; 
                            } else if (value > 100) {
                                // 一级关联词 - 深蓝
                                return '#0B4F6C';
                            } else if (value > 50) {
                                // 二级关联词 - 中度灰蓝
                                return '#536872'; 
                            } else {
                                // 背景词 - 浅灰
                                return '#888'; 
                            }
                        }
                    },
                    emphasis: { // 鼠标悬浮时高亮样式
                        textStyle: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    data: wordData
                }]
            };
            
            // 设置配置并渲染
            myChart.setOption(option);
            
            // 监听窗口大小变化，使图表自适应
            window.addEventListener('resize', function() {
                myChart.resize();
            });
            
            console.log('词云图初始化完成');
            
        } catch (error) {
            console.error('初始化词云图时出错:', error);
        }
    }
    
    // 初始化函数
    function init() {
        // 等待DOM加载完成后初始化词云图
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initWordCloud);
        } else {
            initWordCloud();
        }
    }
    
    // 启动初始化
    init();
    
})(); 