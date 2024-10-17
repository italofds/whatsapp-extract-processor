<template>
    <div>
        <h1 class="mb-4">Registros de Chamadas</h1>

        <div class="card mb-4 rounded-3 shadow-sm">
            <h4 class="card-header py-3">Localização Aproximada dos Provedores</h4>
            <div class="card-body">
                <GMapMap ref="myMapRef" :center="mapCenter" :zoom="mapZoom" map-type-id="terrain" style="width: 100%; height: 400px" :options="mapOptions">
                    <GMapMarker :key="marker" v-for="marker in mapMarkers" :position="marker.position"/>	
                </GMapMap>
            </div>
        </div>

        <div class="card rounded-3 shadow-sm">
            <h4 class="card-header py-3">
                Lista Eventos de Chamadas
                <button class="btn btn-outline-secondary ms-3" @click="$refs.listComponent.exportExcel()">Exportar Excel</button>
            </h4>
            <div class="card-body">
                <list-component ref="listComponent" :ipData="callLogs" :ispData="ispList" :timezoneData="selectedTimezone"></list-component>
            </div>
        </div>        
    </div>
</template>

<script>

import ListComponent from '@/components/CallListComponent.vue';
import darkMapStyleJSON from '../../assets/dark-map-style.json'

export default {    
    name: 'CallsPage',
    components: {
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
    mounted() {
        if(!this.processedData) {
            this.$router.push('/');
        }

        if(document.documentElement.getAttribute("data-bs-theme") === "dark"){
			this.mapOptions.styles = darkMapStyleJSON;
		}

		const mutationCallback = (mutationsList) => {
			for (const mutation of mutationsList) {
				if (
				mutation.type !== "attributes" ||
				mutation.attributeName !== "data-bs-theme"
				) {
				return
				}

				if(mutation.target.getAttribute("data-bs-theme") === "dark") {
					this.mapOptions.styles = darkMapStyleJSON;
				} else {
					this.mapOptions.styles = [];
				}
			}
		}
		const observer = new MutationObserver(mutationCallback);
		observer.observe(document.documentElement, { attributes: true });

        this.refreshMarkers();
    },
    data() {
        return {
            mapMarkers: [],
			mapCenter: { lat: 0, lng: 0 },
			mapZoom: 2,
			mapOptions: {
				zoomControl: true,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: false,
				scrollwheel: false,
				minZoom: 2
			},
            filterData: {
				initialDate: '',
				finalDate: '',
				initialTime: '',
				finalTime: '',
				country: '',
				region: '',
				city: '',
				isp: ''
			},
        }
    },
    computed: {
        messageLogs: function() {
            if(this.processedData) {
                return this.processedData.messageLogs;
            }
            return null;
        },
        callLogs: function() {
            if(this.processedData) {
                return this.processedData.callLogs.flatMap(call => 
                    call.events.map(event => ({ ...event, callId: call.callId, callCreator: call.callCreator }))
                );
            }
            return null;            
        },
        ispList: function() {
            if(this.processedData) {
                return this.processedData.ispList;
            }
            return null;
        },
        markersPositions: function() {
            if(this.processedData && this.processedData.ispList) {
                const arrayLatLng = this.processedData.ispList
                    .map(obj => ({position: { lat: obj.lat, lng: obj.lng }}))
                    .filter(obj => obj.position.lat !== null && obj.position.lng !== null);
                const arrayUniqueLatLng = arrayLatLng.filter((obj, index, self) =>
                    index === self.findIndex((t) => (
                        t.position.lat === obj.position.lat && t.position.lng === obj.position.lng
                    ))
                );
                return arrayUniqueLatLng;
            }
            return null;
        }
    },
    methods: {
        refreshMarkers() {
            this.mapMarkers = this.markersPositions;

            if(window.google) {
                const bounds = new window.google.maps.LatLngBounds();
                this.mapMarkers.map(marker => {
                    bounds.extend({
                        lat: marker.position.lat,
                        lng: marker.position.lng,
                    });
                });
                this.$refs.myMapRef.fitBounds(bounds);
            }
        }
    },
    watch: {
        markersPositions(newValue, oldValue) {
            if(newValue?.length != oldValue?.length) {
                this.refreshMarkers();
            }
        }
    }
};
</script>