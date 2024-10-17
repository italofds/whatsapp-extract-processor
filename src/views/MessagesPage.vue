<template>
    <div>
        <h1 class="mb-4">Registros de Mensagens</h1>

        <!-- <div class="card mb-4 rounded-3 shadow-sm">
            <h4 class="card-header py-3">Filtros</h4>
            <div class="card-body pb-4">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label for="inputInitialDate" class="form-label">Data Inicial</label>
                        <input v-model="filterData.initialDate" type="date" class="form-control" id="inputInitialDate">
                    </div>
                    <div class="col-md-3">
                        <label for="inputFinalDate" class="form-label">Data Final</label>
                        <input v-model="filterData.finalDate" type="date" class="form-control" id="inputFinalDate">
                    </div>
                    <div class="col-md-3">
                        <label for="inputInitialTime" class="form-label">Hora Inicial</label>
                        <input v-model="filterData.initialTime" type="time" class="form-control" id="inputInitialTime" >
                    </div>
                    <div class="col-md-3">
                        <label for="inputFinalTime" class="form-label">Hora Final</label>
                        <input v-model="filterData.finalTime" type="time" class="form-control" id="inputFinalTime">
                    </div>
                    <div class="col-md-3">
                        <label for="selectCountry" class="form-label">País</label>
                        <select v-model="filterData.country" class="form-select" id="selectCountry">
                            <option value="">Todos</option>
                            <option v-for="item in countryItens" :value="item" :key="item">{{ item }}</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="selectRegion" class="form-label">UF</label>
                        <select v-model="filterData.region" class="form-select" id="selectRegion">
                            <option value="">Todos</option>
                            <option v-for="item in regionItens" :value="item" :key="item">{{ item }}</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="selectCity" class="form-label">Cidade</label>
                        <select v-model="filterData.city" class="form-select" id="selectCity">
                            <option value="">Todos</option>
                            <option v-for="item in cityItens" :value="item" :key="item">{{ item }}</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="selectISP" class="form-label">ISP</label>
                        <select v-model="filterData.isp" class="form-select" id="selectISP">
                            <option value="">Todos</option>
                            <option v-for="item in ispItens" :value="item" :key="item">{{ item }}</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="selectSender" class="form-label">Remetente</label>
                        <select class="form-select" id="selectSender">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="selectRecipient" class="form-label">Destinatário</label>
                        <select class="form-select" id="selectRecipient">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="selectMsgStyle" class="form-label">Estilo de Mensagem</label>
                        <select class="form-select" id="selectMsgStyle">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="selectGroup" class="form-label">Grupo</label>
                        <select class="form-select" id="selectGroup">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="selectType" class="form-label">Tipo</label>
                        <select class="form-select" id="selectType">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="selectDevice" class="form-label">Dispositivo</label>
                        <select class="form-select" id="selectDevice">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="inputMinSize" class="form-label">Tamanho Mínimo</label>
                        <input type="number" class="form-control" id="inputMinSize">
                    </div>
                    <div class="col-md-3">
                        <label for="inputMaxSize" class="form-label">Tamanho Máximo</label>
                        <input type="number" class="form-control" id="inputMaxSize">
                    </div>
                </div>
            </div>
            <div class="card-footer py-3 text-end">
                <button type="button" class="btn btn-outline-secondary me-2" data-bs-dismiss="modal">Limpar Filtros</button>
                <button type="button" class="btn btn-primary">Atualizar Filtros</button>
            </div>
        </div> -->

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
                Lista de Mensagens
                <button class="btn btn-outline-secondary ms-3" @click="$refs.listComponent.exportExcel()">Exportar Excel</button>
            </h4>
            <div class="card-body">
                <list-component ref="listComponent" :ipData="messageLogs" :ispData="ispList" :timezoneData="selectedTimezone"></list-component>
            </div>
        </div>        
    </div>
</template>

<script>

import ListComponent from '@/components/MessagesListComponent.vue';
import darkMapStyleJSON from '../../assets/dark-map-style.json'

export default {    
    name: 'MessagesPage',
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