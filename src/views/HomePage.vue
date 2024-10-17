<template>
    <div class="container">
        <div class="card shadow-sm">
            <div class="card-body mb-3 p-3 p-lg-5">
                <h1 class="mb-3">Processador de Interceptação do WhatsApp</h1>
                <p class="lead">Ferramenta de processamento para tratar as respostas da aplicativo <strong>WhatsApp</strong> acerca das mensagens e chamadas solicitadas judicialmente, especificamente através das plataformas <strong>WhatsApp Records</strong>.</p>
                <p class="lead">Para isso, é necessário que o usuário informe <span style="border-bottom: 1px black dashed;">os arquivos</span> do tipo <strong>".html"</strong> a serem processados. Após o processamento, todos os registros de mensagens e chamadas respondidos pela empresa constarão em formato de lista, com data e hora convertidos pro fuso horário selecionado, além de constar também informações dos provedores de conexão dos respectivos endereços IP.</p>

                <form @submit.prevent="handleFormSubmit" class="mt-5">
                    <div class="row">
                        <div class="input-group mb-2">
                            <input v-on:change="previewFile" id="inputFile" name="file" type="file" class="form-control form-control-lg" aria-label="Upload" accept=".html" required multiple>
                            <button id="btnSend" class="btn btn-primary btn-lg" type="submit">Processar</button>
                        </div>
                    </div>
                </form>
                <div v-if="processingProgress != null" class="alert mt-3 alert-warning" role="alert">
                    <div class="spinner-border spinner-border-sm me-3"><span class="visually-hidden">Loading...</span></div>
                    Processando arquivos: <strong>{{ processingProgress}}%</strong>
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
        previewFile(event) {
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