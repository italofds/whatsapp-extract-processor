<template>
    <GMapMap ref="myMapRef" :center="mapCenter" :zoom="mapZoom" map-type-id="terrain" style="width: 100%; height: 400px" :options="mapOptions">                    
        <GMapMarker :key="marker" v-for="marker in notTargetMarkers" :zIndex="1" :position="marker.position" :icon="require('@/assets/images/yellow-pin.png')"/>
        <GMapMarker :key="marker" v-for="marker in targetMarkers" :zIndex="2" :position="marker.position" :icon="require('@/assets/images/blue-pin.png')"/>		
    </GMapMap>

    <div class="mt-3 d-flex flex-row justify-content-center gap-5">
        <div class="target-markers small text-muted">Posições aproximadas do alvo</div>
        <div class="not-target-markers small text-muted">Posições aproximadas dos interlocutores</div>
    </div>
</template>

<script>
import darkMapStyleJSON from '@/assets/js/dark-map-style.json'

export default {
    name: 'MapComponent',
    props: {
        targetMarkers: null,
        notTargetMarkers: null
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
    },
    methods: {
        refreshMapBounds() {
            const mergedMarkers = [
                ...(this.targetMarkers ?? []),
                ...(this.notTargetMarkers ?? [])
            ];
            
            if(window.google && mergedMarkers && mergedMarkers.length > 0) {
                const bounds = new window.google.maps.LatLngBounds();
                mergedMarkers.map(marker => {
                    bounds.extend({
                        lat: marker.position.lat,
                        lng: marker.position.lng,
                    });
                });
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