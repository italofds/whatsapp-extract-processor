<template>
    <div class="container p-4 pb-0">
        <div class="card shadow-sm">
            <div class="card-body mb-3 p-3 p-lg-5">
                <h1 class="mb-3">Processador de Interceptação do WhatsApp</h1>
                <p class="lead">Ferramenta de processamento para tratar as respostas da aplicativo <strong>WhatsApp</strong> acerca das mensagens e chamadas solicitadas judicialmente, especificamente através das plataformas <strong>WhatsApp Records</strong>.</p>
                <p class="lead">Para isso, é necessário que o usuário informe <strong>os arquivos</strong> do tipo <strong>".html"</strong> de um <strong>mesmo alvo</strong> a serem processados. Após o processamento, todos os registros de mensagens e chamadas respondidos pela empresa constarão em um formato otimizado para análise, com data e hora convertidos pro fuso horário selecionado, além de constar também informações dos provedores de conexão dos respectivos endereços IP.</p>

                <form @submit.prevent="handleFormSubmit" class="mt-5">
                    <div class="row">
                        <div class="input-group mb-2">
                            <input v-on:change="previewFiles" id="inputFiles" name="file" type="file" class="form-control form-control-lg" aria-label="Upload" accept=".html" required multiple>
                            <button id="btnSend" class="btn btn-primary btn-lg" type="submit">Processar</button>
                        </div>
                    </div>
                </form>

                <div v-if="processingProgress != null" class="alert mt-3 alert-warning" role="alert">
                    <div class="spinner-border spinner-border-sm me-3"><span class="visually-hidden">Loading...</span></div>
                    Processando arquivos: <strong>{{ processingProgress }}%</strong>
                </div>

                <p class="text-center text-muted small mt-5 pt-5 border-top separator">Leia um arquivo .JSON já processado e configurado pelo usuário.</p>
                <div class="w-100 text-center">
                    <label for="inputSavedFile" class="btn btn-primary btn-lg">Selecionar Arquivo</label>
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
                    this.updateProcessedData(result);
                    this.$router.push('/messages');
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
        content: 'OU';
        position: absolute;
        width: 100px;
        height: 20px;
        top: -10px;
        left: 50%;
        margin-left: -50px;
        background-color: var(--bs-body-bg);
    }
</style>