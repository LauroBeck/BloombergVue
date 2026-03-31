<template>
  <div class="candle-container">
    <svg :width="width" :height="height" style="overflow: visible;">
      <g v-for="grid in 5" :key="grid">
        <line x1="0" :x2="width" 
              :y1="(height / 5) * grid" :y2="(height / 5) * grid" 
              stroke="#1a1a1a" stroke-width="1" />
      </g>

      <g v-for="(c, i) in candles" :key="i">
        <line :x1="getX(i)" :x2="getX(i)" 
              :y1="getY(c.high)" :y2="getY(c.low)" 
              stroke="#666" stroke-width="1" />
        <rect :x="getX(i) - 4" :y="getY(Math.max(c.open, c.close))" 
              width="8" :height="Math.abs(getY(c.open) - getY(c.close)) || 2"
              :fill="c.close >= c.open ? '#00ff41' : '#ff3300'" />
      </g>

      <text v-if="candles.length" :y="getY(candles[candles.length-1].close)" 
            :x="width + 5" fill="#fff" font-size="10" font-family="monospace">
        {{ candles[candles.length-1].close.toFixed(2) }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import * as d3 from 'd3';

const props = defineProps(['candles']);
const width = 500;
const height = 300;

// Dynamic Y-Scale: Zooms in on the 6,527 breakout zone
const yScale = computed(() => {
  if (props.candles.length < 2) return d3.scaleLinear().domain([6520, 6535]).range([height, 0]);
  
  const allValues = props.candles.flatMap(c => [c.high, c.low]);
  const min = d3.min(allValues);
  const max = d3.max(allValues);
  const padding = (max - min) * 0.2; // Add 20% headspace
  
  return d3.scaleLinear()
    .domain([min - padding, max + padding])
    .range([height, 0]);
});

const getY = (val) => yScale.value(val);
const getX = (i) => (i * (width / 50)) + 20;
</script>

<style scoped>
.candle-container { padding: 20px; background: #000; border: 1px solid #222; margin-top: 10px; }
</style>
