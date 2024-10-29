<template>
    <div class="p-4 pb-0">
        <h1 class="mb-4">Gráficos</h1>

        <div class="d-flex flex-row">

            <div style="min-width: 300px;">
                <div class="card rounded-3 shadow-sm me-4">
                    <div class="card-header">
                        <h4 class="card-title">Filtros</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex flex-column mb-3">
                            <label class="form-label">Tipo de Conversa</label>
                            <div class="list-group">
                                <label class="list-group-item list-group-item-action">
                                    <input class="form-check-input" type="radio" v-model="conversationType" value="all">
                                    <span class="ms-3">Todos</span>
                                </label>
                                <label class="list-group-item list-group-item-action">
                                    <input class="form-check-input" type="radio" v-model="conversationType" value="messages">
                                    <span class="ms-3">Mensagens</span>
                                </label>
                                <label class="list-group-item list-group-item-action">
                                    <input class="form-check-input" type="radio" v-model="conversationType" value="calls">
                                    <span class="ms-3">Chamadas</span>
                                </label>
                            </div>
                        </div>
                        <div class="d-flex flex-column">
                            <label class="form-label">Direção da Comunicação</label>
                            <div class="list-group">
                                <label class="list-group-item list-group-item-action">
                                    <input class="form-check-input" type="radio" v-model="communicationDirection" value="all">
                                    <span class="ms-3">Todas</span>
                                </label>
                                <label class="list-group-item list-group-item-action">
                                    <input class="form-check-input" type="radio" v-model="communicationDirection" value="sended">
                                    <span class="ms-3">Enviadas</span>
                                </label>
                                <label class="list-group-item list-group-item-action">
                                    <input class="form-check-input" type="radio" v-model="communicationDirection" value="received">
                                    <span class="ms-3">Recebidas</span>
                                </label>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>            

            <div class="flex-fill">
                <chart-component :data="dataChart1" :title="'Registros por Data'" :type="'line'"></chart-component>

                <!-- <div class="card rounded-3 shadow-sm mb-3">
                    <div class="card-header">
                        <h4 class="card-title">Registros por Dia da Semana</h4>
                    </div>
                    <div class="card-body">
                        ...
                    </div>
                </div>

                <div class="card rounded-3 shadow-sm mb-3">
                    <div class="card-header">
                        <h4 class="card-title">Registros por Hora</h4>
                    </div>
                    <div class="card-body">
                        ...
                    </div>
                </div>

                <div class="card rounded-3 shadow-sm mb-3">
                    <div class="card-header">
                        <h4 class="card-title">Registros por Provedor</h4>
                    </div>
                    <div class="card-body">
                        ...
                    </div>
                </div>

                <div class="card rounded-3 shadow-sm mb-3">
                    <div class="card-header">
                        <h4 class="card-title">Registros por Local Aproximado</h4>
                    </div>
                    <div class="card-body">
                        ...
                    </div>
                </div>

                <div class="card rounded-3 shadow-sm mb-3">
                    <div class="card-header">
                        <h4 class="card-title">Tipos de Mensagens</h4>
                    </div>
                    <div class="card-body">
                        ...
                    </div>
                </div>

                <div class="card rounded-3 shadow-sm">
                    <div class="card-header">
                        <h4 class="card-title">Tipos de Chamadas</h4>
                    </div>
                    <div class="card-body">
                        ...
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>

import ChartComponent from '@/components/ChartComponent.vue';
import {formatDate} from '@/utils/utils'

export default {    
    name: 'ChartsPage',
    components: {
        ChartComponent,
	},
    props: {
        processedData: {
            type: Object,
            required: true
        },
        selectedTimezone: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            conversationType: "all",
            communicationDirection: "all"
        }
    },
    mounted() {
        if(!this.processedData) {
            this.$router.push('/');
        }
    },
    computed: {
        dataChart1: function() {
            if(this.processedData) {                
                var logList = [];                
                if(this.conversationType == 'all' || this.conversationType == 'messages') {
                    logList = logList.concat(...this.processedData.messageLogs);
                }
                
                if(this.conversationType == 'all' || this.conversationType == 'calls') {
                    var callList = this.processedData.callLogs.flatMap(call => call.events
                        .filter(event => 
                            event.type == 'offer'
                        )
                        .map(event => ({
                            callId: call.callId,
                            callCreator: call.callCreator,
                            ...event
                        }))
                    );
                    console.log(callList);
                    logList = logList.concat(...callList);
                }

                var filteredList = [];
                var target = this.processedData.requestParams.accountId;
                if(this.communicationDirection == 'all' || this.communicationDirection == 'sended') {
                    filteredList = filteredList.concat(...logList.filter(log => log.sender == target || log.from == target ));
                }

                if(this.communicationDirection == 'all' || this.communicationDirection == 'received') {
                    filteredList = filteredList.concat(...logList.filter(log => log.sender != target || log.from != target ));
                }
                
                const dateCounts = {};
                
                filteredList.forEach(log => {
                    const data = this.formatDate(log.timestamp, "DD/MM/YYYY", this.selectedTimezone);
                    if (!dateCounts[data]) {
                        dateCounts[data] = 0;
                    }
                    dateCounts[data] += 1
                });
                
                const dateCountsArray = Object.entries(dateCounts).map(([date, count]) => ({ date, count }));
                
                return {
                    labels: dateCountsArray.map(row => row.date),
                        datasets: [
                        {
                            label: 'Registros',
                            data: dateCountsArray.map(row => row.count)
                        }
                    ]
                }
            } else {
                return null;
            }
        }
    },
    methods: {
        formatDate
    },
    watch: {
    }
};
</script>