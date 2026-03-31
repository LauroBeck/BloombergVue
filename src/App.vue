<template>
  <div class="app-terminal">
    <div class="bloomberg-header">
      <div class="brand-line">
        <span class="bloomberg-text">BLOOMBERG</span>
        <span class="version-text">STARGATE_TERMINAL // v12.6</span>
      </div>
      <div class="status-bar">
        <div class="status-item target-hit">SPX: 6,527.27 (TARGET_HIT)</div>
        <div class="status-item target-lag">NIKKEI: 51,063.72 (REBALANCE_LAG)</div>
        <div class="timestamp">{{ currentTimestamp }}</div>
      </div>
    </div>
    
    <div class="main-layout">
      <div class="star-section">
        <StarStargate :marketData="marketData" />
      </div>

      <div class="chart-section">
        <div class="chart-label">GIP &lt;EQUITY&gt; SPX INTRADAY</div>
        <div class="chart-wrapper">
           <CandleChart :candles="candles" />
        </div>
      </div>
    </div>

    <div class="bottom-ticker">
      <div v-for="(val, key) in marketData" :key="key" class="ticker-item">
        <span class="ticker-key">{{ key.toUpperCase() }}</span>
        <span class="ticker-val" :class="{ 'hit': key === 'spx' }">
          {{ typeof val === 'number' ? val.toFixed(2) : val }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import { io } from 'socket.io-client';
import StarStargate from './components/StarStargate.vue';
import CandleChart from './components/CandleChart.vue';

const currentTimestamp = ref(new Date().toLocaleTimeString());
const marketData = reactive({ spx: 6527.27, nikkei: 51063.72, usdjpy: 158.80, oil: 107.46, vix: 17.5 });
const candles = ref([]);

onMounted(() => {
  setInterval(() => { currentTimestamp.value = new Date().toLocaleTimeString(); }, 1000);
  
  const socket = io('http://localhost:3000');
  socket.on('marketUpdate', (data) => {
    Object.assign(marketData, data);
    if (data.candle) {
      candles.value.push(data.candle);
      if (candles.value.length > 50) candles.value.shift();
    }
  });
});
</script>

<style>
body { margin: 0; background: #000; color: #00ff41; font-family: 'Helvetica', Arial, sans-serif; overflow: hidden; }
.app-terminal { height: 100vh; display: flex; flex-direction: column; }

.bloomberg-header { background: #000; border-bottom: 1px solid #333; padding: 8px 15px; }
.brand-line { display: flex; justify-content: space-between; align-items: center; }
.bloomberg-text { font-size: 20px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
.version-text { font-family: monospace; font-size: 11px; color: #00ff41; opacity: 0.8; }

.status-bar { display: flex; gap: 10px; margin-top: 5px; align-items: center; }
.target-hit { background: #00ff41; color: #000; padding: 1px 6px; font-weight: bold; font-size: 12px; }
.target-lag { border: 1px solid #ff3300; color: #ff3300; padding: 0 6px; font-size: 12px; }
.timestamp { margin-left: auto; color: #ffbb00; font-family: monospace; font-size: 12px; }

.main-layout { display: flex; flex: 1; min-height: 0; }
.star-section { flex: 1; border-right: 1px solid #1a1a1a; display: flex; align-items: center; justify-content: center; }
.chart-section { flex: 1.2; padding: 20px; background: #050505; display: flex; flex-direction: column; }
.chart-label { color: #ffbb00; font-size: 12px; font-family: monospace; margin-bottom: 10px; border-bottom: 1px solid #222; padding-bottom: 5px; }
.chart-wrapper { flex: 1; min-height: 0; }

.bottom-ticker { display: flex; background: #0a0a0a; border-top: 1px solid #333; padding: 10px; justify-content: space-around; }
.ticker-key { color: #666; font-size: 11px; margin-right: 5px; }
.ticker-val { font-weight: bold; font-family: monospace; }
.ticker-val.hit { color: #fff; }
</style>
