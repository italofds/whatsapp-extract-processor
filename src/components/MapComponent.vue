<template>
    <GMapMap ref="myMapRef" :center="mapCenter" :zoom="mapZoom" map-type-id="terrain" style="width: 100%; height: 400px" :options="mapOptions">                    
        <GMapMarker :key="marker" v-for="marker in notTargetMarkers" :zIndex="1" :position="marker.position" :icon="require('@/assets/images/yellow-pin.png')"/>
        <GMapMarker :key="marker" v-for="marker in targetMarkers" :zIndex="2" :position="marker.position" :icon="require('@/assets/images/blue-pin.png')"/>	
        <GMapHeatmap :data="heatmapData" :options="{radius: 40}"></GMapHeatmap>	
    </GMapMap>

    <div v-if="targetMarkers?.length > 0 || notTargetMarkers?.length > 0" class="mt-3 d-flex flex-row justify-content-center gap-5">
        <div v-if="targetMarkers?.length > 0" class="target-markers small text-muted">{{ $t('map.approximateTargetPositions') }}</div>
        <div v-if="notTargetMarkers?.length > 0" class="not-target-markers small text-muted">{{ $t('map.approximateInterlocutorPositions') }}</div>
    </div>
</template>

<script>
import darkMapStyleJSON from '@/assets/js/dark-map-style.json'

export default {
    name: 'MapComponent',
    props: {
        targetMarkers: null,
        notTargetMarkers: null,
        heatmapData: null
    },
    data() {
        return {
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
			}
        };
    },
    mounted() {
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
        this.$refs.myMapRef.$mapPromise.then(() => {
            this.refreshMapBounds();
        });

        this.refreshMapBounds();
    },
    watch: {
        targetMarkers() {
            this.refreshMapBounds();
        },
        notTargetMarkers() {
            this.refreshMapBounds();
        },
        heatmapData() {
            this.refreshMapBounds();
        },
    },
    methods: {
        refreshMapBounds() {
            if(window.google) {          
                let bounds = new window.google.maps.LatLngBounds();

                if (this.heatmapData?.length > 0) {
                    this.heatmapData?.forEach(p => bounds.extend(p.location));
                }
                if (this.targetMarkers?.length > 0) {
                    this.targetMarkers?.forEach(m => bounds.extend(m.position));
                }
                if (this.notTargetMarkers?.length > 0) {
                    this.notTargetMarkers?.forEach(m => bounds.extend(m.position));
                }
                this.$refs.myMapRef.fitBounds(bounds);
            }
        }
    }
};
</script>

<style>
    .target-markers,
    .not-target-markers {
        position: relative;
        padding-left: 15px;
    }

    .target-markers:before,
    .not-target-markers:before {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: 5px;
        width: 10px;
        height: 10px;
    }

    .target-markers:before {
        background-color: #0D6EFD;
    }

    .not-target-markers:before {
        background-color: #FFC107;
    }
</style>