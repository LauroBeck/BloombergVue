<template>
  <div class="star-container">
    <svg :width="size" :height="size" style="background: #000;">
      <g :transform="`translate(${size/2}, ${size/2})`">
        <circle v-for="r in [0.2, 0.4, 0.6, 0.8, 1]" :key="r" :r="r * radius" class="grid-line" />
        
        <path :d="starPath" class="star-glow" />
        
        <text v-for="(label, i) in labels" :key="i" 
              :x="labelPos(i).x" :y="labelPos(i).y" 
              text-anchor="middle" class="label-text">
          {{ label }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  marketData: {
    type: Object,
    default: () => ({ spx: 6343, nikkei: 50900, usdjpy: 159.8, oil: 116, vix: 18 })
  }
});

const size = 600;
const radius = 220;
const labels = ['S&P 500', 'Nikkei 225', 'USD-JPY', 'Brent Oil', 'Volatility'];

const labelPos = (i) => {
  const angle = i * (2 * Math.PI / labels.length) - Math.PI / 2;
  return {
    x: Math.cos(angle) * (radius + 40),
    y: Math.sin(angle) * (radius + 40)
  };
};

const starPath = computed(() => {
  const angleStep = (2 * Math.PI / labels.length);
  
  const normalizedData = [
    props.marketData.spx / 6500, 
    props.marketData.nikkei / 53000,
    1 - (props.marketData.usdjpy - 150) / 10, 
    props.marketData.oil / 116,
    props.marketData.vix / 20
  ];

  const line = d3.lineRadial()
    .angle((d, i) => i * angleStep)
    .radius(d => Math.max(0, d * radius))
    .curve(d3.curveLinearClosed);
  
  return line(normalizedData);
});
</script>

<style scoped>
.star-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  padding: 20px;
}
.star-glow {
  fill: rgba(0, 255, 65, 0.2);
  stroke: #00ff41;
  stroke-width: 2;
  filter: drop-shadow(0 0 12px #00ff41);
  transition: all 0.5s ease;
}
.grid-line {
  fill: none;
  stroke: rgba(0, 255, 65, 0.1);
  stroke-dasharray: 4;
}
.label-text {
  fill: #00ff41;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
}
</style>
