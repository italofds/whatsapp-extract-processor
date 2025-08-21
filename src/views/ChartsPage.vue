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
                <chart-component :data="dataChart2.data" :title="'Interlocutores mais Comuns'" :type="'bar'" :options="dataChart2.options"></chart-component>
                
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
import {formatDate, formatPhoneNumber} from '@/utils/utils'
import moment from 'moment';

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
        filteredList: function() {

            if(this.processedData) {                
                var logList = [];                
                if(this.conversationType == 'all' || this.conversationType == 'messages') {
                    logList = logList.concat(...this.processedData.messageLogs);
                }
                
                if(this.conversationType == 'all' || this.conversationType == 'calls') {
                    var callList = this.processedData.callLogs.map(call => {
                        return {
                            callId: call.callId,
                            callCreator: call.callCreator,
                            ...call.events[0]
                        };
                    });
                    logList = logList.concat(...callList);

                }
                
                var filteredList = [];
                var target = this.processedData.requestParams.accountId;
                if(this.communicationDirection == 'all' || this.communicationDirection == 'sended') {
                    filteredList = filteredList.concat(...logList.filter(log => log.sender == target || log.from == target ));
                }
                
                if(this.communicationDirection == 'all' || this.communicationDirection == 'received') {
                    filteredList = filteredList.concat(...logList.filter(log => log.sender != target && log.from != target ));
                }
                
                return filteredList.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            }
            
            return null;
        },
        dataChart1: function() {
            if(this.filteredList && this.filteredList.length) {    
                
                const recordDates = this.filteredList.map(log =>
                    this.formatDate(log.timestamp, "YYYY-MM-DD", this.selectedTimezone)
                );
               
                const firstDate = recordDates[0];
                const lastDate = recordDates[recordDates.length - 1];
                
                const continuousDates = [];
                let currentDate = moment(firstDate);
                
                while (currentDate.isSameOrBefore(lastDate)) {
                    continuousDates.push(currentDate.format("YYYY-MM-DD"));
                    currentDate.add(1, 'days');
                }               
                
                const dateCountsArray = continuousDates.map(date => {
                    const count = recordDates.filter(d => d === date).length;
                    const formatedDate = moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
                    return { date:formatedDate, count };
                });
                
                return {
                    labels: dateCountsArray.map(row => row.date),
                    datasets: [
                    {
                        label: 'Qtd. de Registros',
                        data: dateCountsArray.map(row => row.count)
                    }
                    ]
                }
            } else {
                return null;
            }
        },
        dataChart2: function() {
            const contactList = {};
            const accountId = this.processedData.requestParams.accountId;
            
            if(this.filteredList) {
                this.filteredList.forEach(item => {
                    let interlocutor = null;
                    
                    if (item.sender && item.recipients) {
                        if (item.msgStyle === "group") {
                            interlocutor = item.groupId;
                        } else {
                            if (item.sender === accountId) {
                                interlocutor = item.recipients;
                            } else if (item.recipients === accountId) {
                                interlocutor = item.sender;
                            }
                        }                        
                    }
                    else if (item.from && item.to) {
                        if (item.from === accountId) {
                            interlocutor = item.to;
                        } else if (item.to === accountId) {
                            interlocutor = item.from;
                        }
                    }
                    
                    if (interlocutor) {
                        contactList[interlocutor] = (contactList[interlocutor] || 0) + 1;
                    }
                });
                
                const result = Object.keys(contactList).map(contact => ({
                    contact: contact,
                    count: contactList[contact]
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

                return {
                    data: {
                        labels: result.map(row => {
                            // If it's a group, return the id directly
                            const item = this.filteredList.find(i => {
                                if (i.groupId && i.groupId === row.contact) return true;
                                if (i.sender && i.sender === row.contact) return true;
                                if (i.recipients && i.recipients === row.contact) return true;
                                if (i.from && i.from === row.contact) return true;
                                if (i.to && i.to === row.contact) return true;
                                return false;
                            });
                            if (item && item.msgStyle === 'group') {
                                return "Grupo " + row.contact;
                            } else {
                                return this.formatPhoneNumber(row.contact);
                            }
                        }),
                        datasets: [
                            {
                                label: 'Qtd. de Registros',
                                data: result.map(row => row.count)
                            }
                        ]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            }   
            
            return null;
        }
    },
    methods: {
        formatDate,
        formatPhoneNumber
    },
    watch: {
    }
};
</script>