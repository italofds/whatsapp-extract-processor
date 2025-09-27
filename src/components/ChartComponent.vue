<template>
    <div class="card rounded-3 shadow-sm mb-4">
        <div class="card-header">
            <h4 class="card-title">{{ title }}</h4>
        </div>
        <div class="card-body">
            <canvas ref="canvas" style="max-height:400px;"></canvas>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
import { markRaw } from 'vue'

export default {
    name: 'ChartComponent',
    props: {
        data: null,
        type: {
            type: String,
            default: 'pie'
        },
        title: {
            type: String,
            default: 'Title'
        },
        options: null
    },
    data() {
        return {
            chart: null,
        };
    },
    mounted() {
        this.createChart();
    },
    watch: {
        data: {
            deep: true,
            handler() {
                this.updateChart();
            }
        }
    },
    methods: {
        updateChart() {
            if(this.chart) {
                this.chart.data = this.data;
                this.chart.update();

            } else {
                this.createChart();
            }
        },
        createChart() {
            if (this.chart) {
                this.chart.destroy();
            }

            if(this.data) {
                const chartObj = new Chart(this.$refs.canvas.getContext('2d'), {
                    type: this.type,
                    data: this.data,
                    options: this.options
                });
                
                this.chart = markRaw(chartObj);
            }            
        }
    },
    beforeUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
};
</script>