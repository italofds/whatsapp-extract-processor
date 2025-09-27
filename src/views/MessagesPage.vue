<template>
    <div class="p-4 pb-0">
        <h1 class="mb-4">{{ $t('messages.title') }}</h1>

        <div class="card mb-4 rounded-3 shadow-sm">
            <h4 class="card-header py-3">{{ $t('messages.providersLocation') }}</h4>
            <div class="card-body">
                <map-component ref="mapComponent" :targetMarkers="targetMarkers" :notTargetMarkers="notTargetMarkers"></map-component>
            </div>
        </div>

        <div class="card rounded-3 shadow-sm">
            <h4 class="card-header py-3">
                {{ $t('messages.listTitle') }}
                <button class="btn btn-outline-secondary ms-3" @click="$refs.listComponent.exportExcel()">{{ $t('messages.exportExcel') }}</button>
            </h4>
            <div class="card-body">
                <list-component ref="listComponent" :processedData="processedData" :timezoneData="selectedTimezone"></list-component>
            </div>
        </div>        
    </div>
</template>

<script>

import MapComponent from '@/components/MapComponent.vue';
import ListComponent from '@/components/MessagesListComponent.vue';

export default {    
    name: 'MessagesPage',
    components: {
        MapComponent,
		ListComponent
	},
    props: {
        processedData: {
            type: Object,
            required: true
        },
        selectedTimezone: {
            type: Number,
            required: true
        },
    },
    data() {
        return {
            targetMarkers: null,
            notTargetMarkers: null
        }
    },
    mounted() {
        if(!this.processedData) {
            this.$router.push('/');
        }

        this.notTargetMarkers = this.notTargetMarkersPositions;
        this.targetMarkers = this.targetMarkersPositions;
    },    
    computed: {
        targetMarkersPositions: function() {
            return this.getCallPositions(true);
        },
        notTargetMarkersPositions: function() {
            return this.getCallPositions(false);
        },
        messageLogs: function() {
            if(this.processedData) {
                return this.processedData.messageLogs;
            }
            return null;
        },
        ispList: function() {
            if(this.processedData) {
                return this.processedData.ispList;
            }
            return null;
        }
    },
    methods: {
        getCallPositions(isTarget) {
            if(this.processedData && this.processedData.messageLogs && this.processedData.requestParams && this.processedData.ispList) {
                const targetPositions = this.processedData.messageLogs
                    .filter(event => 
                        ((isTarget && event.sender === this.processedData.requestParams.accountId)
                        || (!isTarget && event.sender !== this.processedData.requestParams.accountId))
                        && this.processedData.ispList[event.ispIndex].lat 
                        && this.processedData.ispList[event.ispIndex].lng)    
                    .map(event => ({ 
                        position: { 
                            lat: this.processedData.ispList[event.ispIndex].lat, 
                            lng: this.processedData.ispList[event.ispIndex].lng 
                        }
                    }));

                const uniqueTargetPositions = Array.from(
                    new Map(targetPositions.map(item => [`${item.position.lat},${item.position.lng}`, item])).values()
                );

                return uniqueTargetPositions;                
            }
            return null;
        }
    },
    watch: {
        targetMarkersPositions(newValue, oldValue) {
            if(newValue?.length != oldValue?.length) {
                this.targetMarkers = newValue;
            }
        },
        notTargetMarkersPositions(newValue, oldValue) {
            if(newValue?.length != oldValue?.length) {                
                this.notTargetMarkers = newValue;
            }
        }
    }
};
</script>