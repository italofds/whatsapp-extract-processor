<template>
    <div class="container p-4 pb-0">
        <div class="card shadow-sm">
            <div class="card-body mb-3 p-3 p-lg-5">
                <h1 class="mb-3">{{ $t('home.title') }}</h1>
                <p class="lead" v-html="$t('home.intro1')"></p>
                <p class="lead" v-html="$t('home.intro2')"></p>
                
                <form @submit.prevent="handleFormSubmit" class="mt-5">
                    <div class="row">
                        <div class="input-group mb-2">
                            <input v-on:change="previewFiles" id="inputFiles" name="file" type="file" class="form-control form-control-lg" aria-label="Upload" accept=".html" required multiple>
                            <button id="btnSend" class="btn btn-primary btn-lg" type="submit">{{ $t('home.processButton') }}</button>
                        </div>
                    </div>
                </form>

                <div class="alert alert-info mt-2" role="alert">
                    <i class="bi bi-info-circle-fill me-2"></i>
                    <small v-html="$t('home.alert1')"></small>
                </div>

                <div v-if="processingProgress != null" class="alert mt-2 alert-warning" role="alert">
                    <div class="spinner-border spinner-border-sm me-3"><span class="visually-hidden">{{ $t('app.loading') }}</span></div>
                    {{ $t('home.processingAlert', { progress: processingProgress }) }}
                </div>

                <p class="text-center text-muted small mt-5 pt-5 border-top separator" :data-content="$t('home.orDivider')" >{{ $t('home.readJson') }}</p>
                <div class="w-100 text-center">
                    <label for="inputSavedFile" class="btn btn-primary btn-lg">{{ $t('home.selectJsonButton') }}</label>
                    <input v-on:change="openSavedFile" class="d-none" aria-label="Upload" id="inputSavedFile" type="file" accept=".json">
                </div>                
            </div>
        </div>
    </div>    

</template>

<script>
export default {
    name: 'HomePage',
    data() {
        return {
            formData: {
				selectedFiles: null
            },
            worker: null,  
            processingProgress: null
        }
    },
    mounted() {
        this.formData.selectedFiles = null;
        this.worker = null;
        this.processingProgress = null;
        this.updateProcessedData(null);
    },
    methods: {
        openSavedFile(event) {
            if(event.target.files) {
                const file = event.target.files[0];
                
                if (file && file.type === "application/json") {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const processedData = JSON.parse(event.target.result);

                            if(processedData?.requestParams?.accountId && (processedData?.messageLogs?.length > 0 || processedData?.callLogs?.length > 0)) {
                                this.updateProcessedData(processedData);
                                this.$router.push('/messages');
                            
                            } else {
                                console.error("The processed data from file is invalid.");
                            }
                        
                        } catch (error) {
                            console.error("An error occurred while reading JSON file: ", error.message);
                        }
                    };
                    reader.readAsText(file);

                } else {
                    console.error("The selected file is not a valid JSON format.");
                }
            }			
		},
        previewFiles(event) {
			this.formData.selectedFiles = event.target.files;
		},
        handleFormSubmit() {
            this.processingProgress = 0;
			var files = this.formData.selectedFiles;
            this. worker = new Worker(new URL('../utils/processor.js', import.meta.url))
            this.worker.postMessage({ files: files });

            this.worker.onmessage = (e) => {
                const { progress, result } = e.data;
                this.processingProgress = progress;

                if (result) {
                    if(result.requestParams.accountId && (result.messageLogs.length > 0 || result.callLogs.length > 0)) {
                        this.updateProcessedData(result);
                        this.$router.push('/messages');

                    } else {
                        alert(this.$t('app.processingError'));
                        this.processingProgress = null;
                        return;
                    }
                }
            };
		},
        updateProcessedData(processedData) {
            this.$emit('updateProcessedData', processedData);
        }
    }

};
</script>

<style>
    .separator {
        position: relative;
    }

    .separator:before {
        content: attr(data-content);
        position: absolute;
        width: 100px;
        height: 20px;
        top: -10px;
        left: 50%;
        margin-left: -50px;
        background-color: var(--bs-body-bg);
    }
</style>